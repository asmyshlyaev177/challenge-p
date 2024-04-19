import * as dateFns from 'date-fns';

export function removeKeyBefore(map, date) {
  const keys = [...map.keys()];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    // eslint-disable-next-line no-unused-vars
    const [_, year, week] = prop.match(/.*-(\d{4,4})-(\d{1,2})$/);
    const keyDate = dateFns.setWeek(dateFns.setYear(new Date(), +year), +week);

    if (dateFns.isBefore(keyDate, new Date(date))) {
      map.delete(prop);
    }
  }
}

export const getWeekNumber = (date) =>
  dateFns.getWeek(date, {
    // 0 - Sunday, 1 Monday
    weekStartsOn: 1,
  });
