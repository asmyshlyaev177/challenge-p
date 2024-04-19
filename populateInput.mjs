import fs from 'fs';

import * as dateFns from 'date-fns';

const obj = {
  date: '2016-01-10',
  user_id: 3,
  user_type: 'natural',
  type: 'cash_out',
  operation: { amount: 1000.0, currency: 'EUR' },
};

let table = [];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 1 million entries
for (let i = 0; i < 1000000; i++) {
  const newObj = {
    ...obj,
    date: dateFns.addMinutes(obj.date, randomIntFromInterval(1, 21000) + i),
    user_id: randomIntFromInterval(1, 9),
    user_type: randChoice(['natural', 'juridical']),
    type: randChoice(['cash_out', 'cash_in']),
    operation: { amount: 30 * randomIntFromInterval(1, 25), currency: 'EUR' },
  };
  table.push(newObj);
}

table = table.sort((a, b) => (a.date > b.date ? 1 : -1));

const json = JSON.stringify(table, null, 2);

fs.writeFile('input1.json', json, 'utf8', () => {});
