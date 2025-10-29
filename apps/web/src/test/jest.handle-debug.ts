// Jest setup file to log active handles after tests, for debugging only
afterAll(() => {
  try {
    // @ts-ignore - internal API used for debugging
    const handles = process._getActiveHandles();
    console.log('\n=== ACTIVE HANDLES (start) ===');
    handles.forEach((h: any, i: number) => {
      try {
        console.log(i, h && h.constructor && h.constructor.name, h);
      } catch (err) {
        console.log(i, '<error printing handle>');
      }
    });
    console.log('=== ACTIVE HANDLES (end) ===\n');
  } catch (e) {
    // ignore
  }
});
