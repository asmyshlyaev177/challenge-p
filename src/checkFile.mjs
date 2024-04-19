import fs from 'fs';
import path from 'path';

const formatError = `Please provide JSON file
    with format:
      [
        {
          "date": "YYYY-MM-DD",
          "user_id": number|string,
          "user_type": natural|juridical,
          "type": cash_in|cash_out,
          "operation": { "amount": float, "currency": "EUR" }
        },
        ...
      ]
    `;

const checkFile = (args) => {
  if (!args.length) {
    console.error(formatError);
    process.exit(1);
  }

  const fileName = args[0] || '';
  const cwd = process.cwd();
  const filePath = path.join(cwd, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`File "${fileName}" doesn't exist`);
    process.exit(1);
  }

  if (path.extname(fileName) !== '.json') {
    console.error(formatError);
    process.exit(1);
  }

  let file;

  try {
    file = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
  } catch (err) {
    console.error(
      `Can't parse JSON file "${fileName}" from ${process.cwd()}\n ${err}`,
    );
    process.exit(1);
  }

  // TODO: file format check

  return file;
};

export default checkFile;
