const cp = require('child_process');

const execCommand = async (command = '') => {
  return new Promise((resolve, reject) => {
    const proc = cp.exec(command);

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ stdout, stderr, code });
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
};

describe('app cli', () => {
  describe('file argument', () => {
    it('Should throw an error if file not provided', async () => {
      const res = await execCommand('npm run app');
      expect(res.code).toEqual(1);
      expect(res.stderr).toMatch('Please provide JSON file');
    });

    it('No error if file provided', async () => {
      const res = await execCommand('npm run app input.json');
      expect(res.code).toEqual(0);
      expect(res.stderr).toBeFalsy();
    });

    it('Error if file does not exists', async () => {
      const file = 'package.json11';

      const res = await execCommand(`npm run app ${file}`);
      expect(res.code).toEqual(1);
      expect(res.stderr).toMatch(`File "${file}" doesn't exist`);
    });

    it('Error if file is not a .json', async () => {
      const file = 'README.md';

      const res = await execCommand(`npm run app ${file}`);
      expect(res.code).toEqual(1);
      expect(res.stderr).toMatch(`Please provide JSON file`);
    });
  });

  describe('should return result', () => {
    it('correct result', async () => {
      const expected = [
        '0.06',
        '0.90',
        '87.00',
        '3.00',
        '0.30',
        '0.30',
        '5.00',
        '0.00',
        '0.00',
      ];

      const res = await execCommand('npm run app input.json');
      expect(res.code).toEqual(0);
      expect(res.stderr).toBeFalsy();
      expect(res.stdout.split('\n').filter(Boolean).slice(2)).toEqual(expected);
    });
  });
});
