// Lightweight async_hooks tracer + basic monkeypatching to record where
// sockets and child processes are created during Jest runs.
// This is intended for local debugging; safe to leave enabled temporarily.

import async_hooks from 'node:async_hooks';
import fs from 'node:fs';

const OUT = (msg: string) => {
  try {
    // write to stderr to ensure it appears in CI logs
    fs.writeSync(2, `[jest-async-trace] ${msg}\n`);
  } catch (e) {
    // swallow
  }
};

// record a few resource types we care about
const INTERESTING = new Set(['TCPWRAP', 'PIPEWRAP', 'TTYWRAP', 'Timeout', 'Immediate', 'ChildProcess', 'FSREQCALLBACK']);

const stacks = new Map<number, { type: string; stack: string }>();

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    try {
      if (INTERESTING.has(type)) {
        // capture stack without this file's frames
        const stack = (new Error()).stack || '';
        stacks.set(asyncId, { type, stack });
      }
    } catch (e) {
      /* ignore */
    }
  },
  destroy(asyncId) {
    try { stacks.delete(asyncId); } catch (e) { /* ignore */ }
  }
});

hook.enable();

// Monkeypatch child_process.spawn and fork to capture caller stacks
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cp = require('node:child_process');
  ['spawn', 'fork'].forEach((fnName) => {
    if (typeof cp[fnName] === 'function') {
      const orig = cp[fnName];
      cp[fnName] = function (...args: any[]) {
        try {
          const stack = (new Error()).stack || '';
          OUT(`${fnName} called with args=${JSON.stringify(args.map(a => typeof a === 'string' ? a : typeof a))}`);
          // print top of stack for quick triage
          OUT(stack.split('\n').slice(0, 6).join('\n'));
        } catch (e) { /* ignore */ }
        return orig.apply(this, args);
      };
    }
  });
} catch (e) {
  /* ignore if require fails */
}

// Monkeypatch net.Socket.connect to log stacks when sockets are opened
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const net = require('node:net');
  if (net && net.Socket && net.Socket.prototype) {
    const origConnect = net.Socket.prototype.connect;
    net.Socket.prototype.connect = function (...args: any[]) {
      try {
        const stack = (new Error()).stack || '';
        OUT(`Socket.connect called args=${JSON.stringify(args.map(a => (typeof a === 'object' ? '[object]' : a)))} `);
        OUT(stack.split('\n').slice(0, 6).join('\n'));
      } catch (e) { /* ignore */ }
      return origConnect.apply(this, args);
    };
  }
} catch (e) {
  /* ignore */
}

// expose a dump function for after tests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dumpTraces() {
  try {
    OUT(`dumpTraces: ${stacks.size} recorded async resources`);
    let i = 0;
    for (const [id, info] of stacks) {
      OUT(`trace[${i++}] id=${id} type=${info.type}`);
      OUT(info.stack.split('\n').slice(0, 8).join('\n'));
    }
  } catch (e) { /* ignore */ }
}

// Also call dump at process exit just in case
process.on('exit', () => {
  try { dumpTraces(); } catch (e) { }
});

// noop export so TS/ESM resolution works
export {};
