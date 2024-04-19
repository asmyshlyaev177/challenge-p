import checkFile from './checkFile.mjs';
import config from './config.mjs';
import parseRule from './parseRule.mjs';
import { removeKeyBefore } from './utils.mjs';

const args = process.argv.slice(2);

const file = checkFile(args);

class FeeManager {
  constructor() {
    this.config = {};
    this.users = new Map();
  }

  run = (rows) => {
    return rows.reduce((acc, row) => {
      const res = this.config[row.user_type][row.type](row);
      acc.push({ ...row, fee: res });
      return acc;
    }, []);
  };

  setConfig = (configObj) => {
    this.config = {
      natural: {
        cash_in: parseRule(configObj.natural.cash_in, this.users),
        cash_out: parseRule(configObj.natural.cash_out, this.users),
      },
      juridical: {
        cash_in: parseRule(configObj.juridical.cash_in, this.users),
        cash_out: parseRule(configObj.juridical.cash_out, this.users),
      },
    };
  };

  cleanup = (date) => {
    removeKeyBefore(this.users, date);
  };
}

const feeManager = new FeeManager();
feeManager.setConfig(config);

const result = feeManager.run(file);

result.forEach((el) => console.log(el.fee));

// for clean up old entries before 2016
// feeManager.cleanup('2016-01-01');
