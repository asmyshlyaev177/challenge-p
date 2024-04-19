import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

// TODO: replace with date-fns
dayjs.extend(weekOfYear);

export default dayjs;
