const config = {
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

export default config;
