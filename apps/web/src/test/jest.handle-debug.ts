// Jest setup file to log active handles after tests, for debugging only
afterAll(() => {
  try {
    // @ts-ignore - internal API used for debugging
    const handles = process._getActiveHandles();
    console.log('\n=== ACTIVE HANDLES (start) ===');
    handles.forEach((h: any, i: number) => {
      try {
        const name = h && h.constructor && h.constructor.name;
        console.log(i, name);
        // Try to gracefully close common handle types
        if (name === 'ChildProcess' && h && typeof h.kill === 'function') {
          try { h.kill(); } catch (e) { /* ignore */ }
        }
        if (name === 'Socket' && h && typeof h.destroy === 'function') {
          try { h.destroy(); } catch (e) { /* ignore */ }
        }
        if (name === 'Server' && h && typeof h.close === 'function') {
          try { h.close(); } catch (e) { /* ignore */ }
        }
        console.log(i, h);
      } catch (err) {
        console.log(i, '<error printing handle>');
      }
    });
    console.log('=== ACTIVE HANDLES (end) ===\n');
  } catch (e) {
    // ignore
  }
});
