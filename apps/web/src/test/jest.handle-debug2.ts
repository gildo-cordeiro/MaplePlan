// Clean debug helper for detecting open handles in Jest

afterAll(() => {
  try {
    // @ts-ignore
    const handles = (process as any)._getActiveHandles();
    console.log('\n=== ACTIVE HANDLES (start) ===');
    handles.forEach((h: any, i: number) => {
      try {
        const name = h && h.constructor && h.constructor.name;
        console.log(`${i} ${name}`);
        if (name === 'ChildProcess') {
          try {
            const pid = h.pid;
            const spawnargs = h.spawnargs && h.spawnargs.join(' ');
            console.log(`  ChildProcess pid=${pid} spawnargs=${spawnargs} killed=${!!h.killed}`);
            const isJestWorker = spawnargs && spawnargs.includes('jest-worker');
            if (!isJestWorker && typeof h.kill === 'function') {
              try { h.kill(); console.log(`  -> killed pid=${pid}`); } catch (e) { console.log(`  -> failed to kill pid=${pid}`); }
            } else if (isJestWorker) {
              console.log('  -> skipping kill for jest-worker child process');
            }
          } catch (e) {
            console.log('  -> childproc info error');
          }
        }
        if (name === 'Socket' || name === 'Pipe') {
          try {
            const remoteAddress = h.remoteAddress || (h._peername && h._peername.address) || null;
            const remotePort = h.remotePort || (h._peername && h._peername.port) || null;
            console.log(`  Socket remote=${remoteAddress}:${remotePort} readable=${!!h.readable} writable=${!!h.writable}`);
            if (typeof h.destroy === 'function') {
              try { h.destroy(); console.log('  -> socket destroyed'); } catch (e) { }
            }
          } catch (e) {
            console.log('  -> socket info error');
          }
        }
        if (name === 'Server' && h && typeof h.close === 'function') {
          try { h.close(() => console.log('  -> server closed')); } catch (e) { console.log('  -> server close error'); }
        }
        try { console.log(h); } catch (e) { console.log('<error printing handle>'); }
      } catch (err) {
        console.log(i, '<error printing handle>');
      }
    });
    console.log('=== ACTIVE HANDLES (end) ===\n');
  } catch (e) {
    // ignore
  }
});
