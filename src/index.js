import checkFile from './checkFile.mjs';

const args = process.argv.slice(2);

const file = checkFile(args);

console.log({ file });
