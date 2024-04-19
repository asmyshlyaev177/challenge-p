import dayjs from './dayjs.mjs';
import parseRule from './parseRule';

const obj = {
  date: '2016-01-06',
  user_id: 1,
  user_type: 'natural',
  type: 'cash_out',
  operation: { amount: 100, currency: 'EUR' },
};

describe('parseRule', () => {
  describe('percent', () => {
    it('0 fee', () => {
      const config = { percents: 0 };

      expect(parseRule(config)(obj)).toEqual('0.00');
    });

    it('should return %', () => {
      const config = { percents: 5 };

      expect(parseRule(config)(obj)).toEqual('5.00');
    });
  });

  describe('min', () => {
    it('percent < min should return min', () => {
      const config = { percents: 5, min: { amount: 20 } };

      expect(parseRule(config)(obj)).toEqual('20.00');
    });

    it('percent > min should return percent', () => {
      const config = { percents: 1, min: { amount: 5 } };

      expect(
        parseRule(config)({
          ...obj,
          operation: { ...obj.operation, amount: 1000 },
        }),
      ).toEqual('10.00');
    });
  });

  describe('max', () => {
    it('percent < max should return percent', () => {
      const config = { percents: 5, max: { amount: 10 } };

      expect(parseRule(config)(obj)).toEqual('5.00');
    });

    it('percent > max should return max', () => {
      const config = { percents: 5, max: { amount: 1 } };

      expect(parseRule(config)(obj)).toEqual('1.00');
    });
  });

  describe('few rules', () => {
    it('return min', () => {
      const config = { percents: 0.5, min: { amount: 1 }, max: { amount: 5 } };

      expect(parseRule(config)(obj)).toEqual('1.00');
    });

    it('return max', () => {
      const config = { percents: 10, min: { amount: 1 }, max: { amount: 5 } };

      expect(parseRule(config)(obj)).toEqual('5.00');
    });

    it('return percent', () => {
      const config = { percents: 3, min: { amount: 1 }, max: { amount: 5 } };

      expect(parseRule(config)(obj)).toEqual('3.00');
    });
  });

  describe('week_limit', () => {
    it('transaction bellow limit', () => {
      const config = { percents: 1, week_limit: { amount: 1000 } };
      const users = new Map();

      const rule = parseRule(config, users);
      expect(rule(obj)).toEqual('0.00');
      // expect([...users]).toEqual([
      //   ['1-2016-2', config.week_limit.amount - obj.operation.amount],
      // ]);
    });

    it('transaction equal limit', () => {
      const limit = 1000;
      const config = { percents: 1, week_limit: { amount: limit } };
      const users = new Map();

      const rule = parseRule(config, users);
      expect(
        rule({ ...obj, operation: { ...obj.operation, amount: limit } }),
      ).toEqual('0.00');
      // expect([...users]).toEqual([
      //   ['1-2016-2', config.week_limit.amount - limit],
      // ]);
    });

    it('transaction above limit', () => {
      const limit = 100;
      const percent = 1;
      const config = { percents: percent, week_limit: { amount: limit } };
      const transaction = 300;
      const users = new Map();

      const rule = parseRule(config, users);
      expect(
        rule({ ...obj, operation: { ...obj.operation, amount: transaction } }),
      ).toEqual((((transaction - limit) * percent) / 100).toFixed(2));
      // expect([...users]).toEqual([
      //   ['1-2016-2', Math.max(config.week_limit.amount - transaction, 0)],
      // ]);
    });

    // TODO: rewrite
    it.skip('3 transactions in a week', () => {
      const config = { percents: 1, week_limit: { amount: 100 } };
      const users = new Map();
      const obj2 = {
        ...obj,
        date: dayjs(obj.date).add(1, 'day'),
        operation: { ...obj.operation, amount: 50 },
      };
      const obj3 = {
        ...obj,
        date: dayjs(obj.date).add(2, 'day'),
        operation: { ...obj.operation, amount: 100 },
      };
      const rule = parseRule(config, users);
      expect(rule(obj)).toEqual('0.00');
      expect(rule(obj2)).toEqual('0.50');
      expect(rule(obj3)).toEqual('1.00');
    });

    it('should work', () => {
      const config = { percents: 0.3, week_limit: { amount: 1000 } };
      const users = new Map();
      // 2016 year
      // Mo   Tu    We    Th    Fr    Sa    Su
      // 1    2     3
      // 4    5     6     7     8     9     10
      // 11   12    13    14    15    16    17
      // 18   19    20    21    22    23    24
      // 25   26    27    28    29    30    31

      const obj1 = {
        date: '2016-01-06',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 30000, currency: 'EUR' },
      };
      const obj2 = {
        date: '2016-01-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000.0, currency: 'EUR' },
      };
      const obj3 = {
        date: '2016-01-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 100.0, currency: 'EUR' },
      };
      const obj4 = {
        date: '2016-01-10',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 100.0, currency: 'EUR' },
      };
      const obj5 = {
        date: '2016-02-15',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 300.0, currency: 'EUR' },
      };
      const rule = parseRule(config, users);
      expect(
        [obj1, obj2, obj3, obj4, obj5].reduce((acc, val) => {
          acc.push(rule(val));
          return acc;
        }, []),
      ).toEqual(['87.00', '3.00', '0.30', '0.30', '0.00']);
    });
  });
});
