import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

import currencies from './currencies.mjs';

dayjs.extend(weekOfYear);

const parseRule = (operationConfig, users) => {
  return (rowObj) => {
    let toFee = rowObj.operation.amount;

    if (operationConfig.week_limit) {
      const date = dayjs(rowObj.date);
      const limitKey = `${rowObj.user_id}-${date.year()}-${date.week()}`;

      const remainingLimit =
        users.get(limitKey) ?? operationConfig.week_limit.amount;

      users.set(limitKey, Math.max(remainingLimit - toFee, 0));

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

export default parseRule;
