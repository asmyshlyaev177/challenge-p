import * as dateFns from 'date-fns';

import currencies from './currencies.mjs';
import { getWeekNumber } from './utils.mjs';

const parseRule = (operationConfig, users) => {
  return (rowObj) => {
    let toFee = rowObj.operation.amount;

    if (operationConfig.week_limit) {
      const { date } = rowObj;
      const limitKey = `${rowObj.user_id}-${dateFns.getYear(date)}-${getWeekNumber(
        date,
      )}`;

      const remainingLimit =
        users.get(limitKey) ?? operationConfig.week_limit.amount;

      users.set(limitKey, Math.max(remainingLimit - toFee, 0));

      toFee = Math.max(toFee - remainingLimit, 0);
    }

    return [
      (val) =>
        operationConfig.percents ? (val * operationConfig.percents) / 100 : 0,
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
