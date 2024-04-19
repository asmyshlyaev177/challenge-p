import parseRule from './parseRule';

describe('parseRule', () => {
  it('percent', () => {
    const config = { percent: 5 };
    const obj = {
      date: '2016-01-06',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: { amount: 30000, currency: 'EUR' },
    };

    expect(parseRule(config)(obj)).toEqual('');
  });
});
