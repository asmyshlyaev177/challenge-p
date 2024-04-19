import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

import checkFile from './checkFile.mjs';

dayjs.extend(weekOfYear);

const args = process.argv.slice(2);

const file = checkFile(args);

const currencies = { EUR: { fractions: 2 } };

const eurConfig = {
  natural: {
    cash_in: {
      percents: 0.03,
      max: {
        amount: 5,
        currency: 'EUR',
      },
    },
    cash_out: {
      percents: 0.3,

      week_limit: {
        amount: 1000,
        currency: 'EUR',
      },
    },
  },
  juridical: {
    cash_in: {
      percents: 0.03,
      max: {
        amount: 5,
        currency: 'EUR',
      },
    },
    cash_out: {
      percents: 0.3,
      min: {
        amount: 0.5,
        currency: 'EUR',
      },
    },
  },
};

class FeeManager {
  constructor() {
    this.config = {};
    this.users = {};
  }

  // TODO: to separate function with tests?
  parseRule = (operationConfig) => {
    return (rowObj) => {
      let toFee = rowObj.operation.amount;

      if (operationConfig.week_limit) {
        const date = dayjs(rowObj.date);
        const limitKey = `${rowObj.user_id}-${date.year()}-${date.week()}`;

        const remainingLimit =
          this.users?.[limitKey] ?? operationConfig.week_limit.amount;

        this.users[limitKey] = Math.max(remainingLimit - toFee, 0);

        toFee = Math.max(toFee - remainingLimit, 0);
      }

      return [
        operationConfig.percents &&
          ((val) => (val * operationConfig.percents) / 100),
        operationConfig.min &&
          ((val) => Math.max(val, operationConfig.min.amount)),
        operationConfig.max &&
          ((val) => Math.min(val, operationConfig.max.amount)),
        (val) =>
          Number(val).toFixed(currencies[rowObj.operation.currency].fractions),
      ]
        .filter(Boolean)
        .reduce((acc, fn) => fn(acc), toFee);
    };
  };

  run = (rows) => {
    return rows.reduce((acc, row) => {
      const res = this.config[row.user_type][row.type](row);
      acc.push({ ...row, fee: res });
      return acc;
    }, []);
  };

  setConfig = (config) => {
    this.config = {
      natural: {
        cash_in: this.parseRule(config.natural.cash_in),
        cash_out: this.parseRule(config.natural.cash_out),
      },
      juridical: {
        cash_in: this.parseRule(config.juridical.cash_in),
        cash_out: this.parseRule(config.juridical.cash_out),
      },
    };
  };
}

const feeManager = new FeeManager();
feeManager.setConfig(eurConfig);

const result = feeManager.run(file);

result.map((el) => el.fee).forEach((fee) => console.log(fee));
