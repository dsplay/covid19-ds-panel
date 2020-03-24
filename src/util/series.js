import axios from 'axios';
import moment from 'moment';

const DATA_URL = 'https://pomber.github.io/covid19/timeseries.json';
const KEY = 'series';

export async function loadSeries() {
  let seriesData;
  let recent = true;

  try {

    const cache = localStorage.getItem(KEY);
    seriesData = cache && JSON.parse(cache);

    if (seriesData) {
      const keys = Object.keys(seriesData);
      const firstKey = keys[0];
      // console.log(keys);
      const { date: lastDate } = seriesData[firstKey][seriesData[firstKey].length - 1];
      // console.log(lastDate);

      const today = moment.utc().startOf('day');
      const last = moment(lastDate, 'YYYY-M-D').utc();
      // console.log(last);

      const diff = today.diff(last, 'days');

      recent = diff < 2;
    }

  } catch (e) {
    console.log('error reading from localStorage')
  }

  if (!seriesData || !recent) {
    console.log('fetching...');
    const response = await axios.get(DATA_URL);
    const raw = response.data;

    seriesData = {};

    Object.keys(raw).forEach((key) => {
      seriesData[key] = raw[key];
    });

    localStorage.setItem(KEY, JSON.stringify(seriesData));
  }

  return seriesData;
}