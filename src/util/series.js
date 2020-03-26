import axios from 'axios';
import moment from 'moment';

const DATA_URL = 'https://pomber.github.io/covid19/timeseries.json';
const KEY = 'series';
const VERSION_KEY = 'version';
const VERSION = 4;

export async function loadSeries() {
  let seriesData;
  let recent = true;

  try {

    const cache = localStorage.getItem(KEY);
    seriesData = cache && JSON.parse(cache);
    const storedVersion = localStorage.getItem(VERSION_KEY);

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

      recent = diff < 2 && +storedVersion === VERSION;
    }

  } catch (e) {
    console.log('error reading from localStorage')
  }

  if (!seriesData || !recent) {
    console.log('fetching...');
    const response = await axios.get(DATA_URL);
    const raw = response.data;

    seriesData = {};

    Object.keys(raw).forEach((country) => {

      let lastValidConfirmed = 0;
      let lastValidDeaths = 0;
      let lastValidRecovered = 0;

      seriesData[country] = raw[country].map(({
        date,
        confirmed = 0,
        deaths = 0,
        recovered = 0,
      }) => {
        lastValidConfirmed = confirmed || lastValidConfirmed;
        lastValidDeaths = deaths || lastValidDeaths;
        lastValidRecovered = recovered || lastValidRecovered;

        return ({
          date,
          confirmed: lastValidConfirmed,
          deaths: lastValidDeaths,
          recovered: lastValidRecovered,
        });
      });
    });

    localStorage.setItem(KEY, JSON.stringify(seriesData));
    localStorage.setItem(VERSION_KEY, VERSION.toString());
  }

  return seriesData;
}