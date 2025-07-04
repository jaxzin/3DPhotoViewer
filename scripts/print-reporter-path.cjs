try {
  const path = require.resolve('jest-html-reporter');
  console.log('Reporter path in container:', path);
} catch (err) {
  console.error('Failed to resolve reporter:', err);
  process.exit(1);
}
