import checkFile from './checkFile.mjs';
import config from './config.mjs';
import parseRule from './parseRule.mjs';

const args = process.argv.slice(2);

const file = checkFile(args);

class FeeManager {
  constructor() {
    this.config = {};
    // TODO: cleanup
    //     function removeKeyStartsWith(obj, letter) {
    //     for (var prop in obj) {
    //         if (obj.hasOwnProperty(prop) && prop[0] == letter){
    //             delete obj[prop];
    //         }
    //     }
    // }
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
}

const feeManager = new FeeManager();
feeManager.setConfig(config);

const result = feeManager.run(file);

result.map((el) => el.fee).forEach((fee) => console.log(fee));
