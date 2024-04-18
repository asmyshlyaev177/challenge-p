const cp = require('child_process');

describe('app cli', () => {
  describe('file argument', () => {
    it('Should throw an error if file not provided', () => {
      cp.exec('npm run app', (error, stdout, stderr) => {
        expect(stderr).toMatch('Please provide JSON file');
        expect(error).toBeTruthy();
        expect(stdout).toBeTruthy();
      }).on('exit', (code) => {
        expect(code).toEqual(1);
      });
    });

    it('No error if file provided', () => {
      cp.exec('npm run app input.json', (error, stdout, stderr) => {
        expect(stderr).toBeFalsy();
        expect(error).toBeFalsy();
        expect(stdout).toBeTruthy();
      }).on('exit', (code) => {
        expect(code).toEqual(0);
      });
    });

    it('Error if file does not exists', () => {
      const file = 'package.json11';
      cp.exec(`npm run app ${file}`, (error, stdout, stderr) => {
        expect(stderr).toMatch(`File "${file}" doesn't exist`);
        expect(error).toBeTruthy();
        expect(stdout).toBeTruthy();
      }).on('exit', (code) => {
        expect(code).toEqual(1);
      });
    });

    it('Error if file is not a .json', () => {
      const file = 'README.md';
      cp.exec(`npm run app ${file}`, (error, stdout, stderr) => {
        expect(stderr).toMatch(`Please provide JSON file`);
        expect(error).toBeTruthy();
        expect(stdout).toBeTruthy();
      }).on('exit', (code) => {
        expect(code).toEqual(1);
      });
    });
  });
});
