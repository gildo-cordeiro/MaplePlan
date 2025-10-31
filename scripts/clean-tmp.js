const fs = require('fs');
const path = require('path');

const target = path.resolve(process.cwd(), 'tmp');

try {
  if (!fs.existsSync(target)) {
    console.log('No tmp directory found. Nothing to clean.');
    process.exit(0);
  }

  // Use fs.rmSync when available (Node 14.14+). Fall back to recursive rmdir for older Node.
  if (typeof fs.rmSync === 'function') {
    fs.rmSync(target, { recursive: true, force: true });
  } else {
    // rmdirSync with recursive is deprecated in newer Node, but available in older versions.
    fs.rmdirSync(target, { recursive: true });
  }

  console.log('Removed tmp directory:', target);
  process.exit(0);
} catch (err) {
  console.error('Failed to remove tmp directory:', err);
  process.exit(1);
}
