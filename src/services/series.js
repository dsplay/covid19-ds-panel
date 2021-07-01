import axios from 'axios';
import moment from 'moment';
import $ from 'jquery';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import { mapName } from '../util/country';

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com';
const CORS_PROXY = 'https://api.allorigins.win/get';
const DATA_URL = 'https://pomber.github.io/covid19/timeseries.json';
const KEY_SERIES = 'series';
const KEY_VERSION = 'version';
const KEY_UPDATED = 'updated';
const VERSION = '2.1';
const TODAYS_DATA_URL = 'https://www.worldometers.info/coronavirus/';
const FLAG_ADD_TODAY = true;



async function getTodaysData() {
  console.log('fetching today\'s data...');
  // const response = await axios.get(`${CORS_PROXY}/${TODAYS_DATA_URL}`);
  const response = await axios.get(CORS_PROXY, {
    params: {
      url: TODAYS_DATA_URL,
    },
  });

  const container = $('<div></div>');
  container.html(response.data.contents);

  const countriesHTML = container.find('#main_table_countries_today tbody tr');
  const countries = {};
  countriesHTML.each((i, countryEl) => {
    const name = mapName($(countryEl).find('td:nth-child(2)').text().trim());
    countries[name] = {
      date: moment().utc().startOf('day').format('YYYY-M-D'),
      confirmed: +$(countryEl).find('td:nth-child(3)').text().replace(',', ''),
      deaths: +$(countryEl).find('td:nth-child(5)').text().replace(',', ''),
      recovered: +$(countryEl).find('td:nth-child(7)').text().replace(',', ''),
    }
  });

  console.log(countries);

  return countries;
}

export async function loadSeries() {
  let seriesData;
  let recent = true;

  try {

    const cache = localStorage.getItem(KEY_SERIES);
    seriesData = cache && JSON.parse(decompressFromUTF16(cache));
    const storedVersion = localStorage.getItem(KEY_VERSION);
    const lastUpdate = localStorage.getItem(KEY_UPDATED);

    if (seriesData) {
      const now = moment().utc();
      const diff = now.diff(moment(lastUpdate).utc(), 'hours');
      console.log(`${diff} hours since last update.`);
      recent = lastUpdate && (diff < 3) && storedVersion === VERSION;
    }

  } catch (e) {
    console.log('error reading from localStorage', e);
  }

  if (!seriesData || !recent) {
    console.log('fetching series...');
    const response = await axios.get(DATA_URL);
    const raw = response.data;
    const today = moment().utc().startOf('day').format('YYYY-M-D');
    // add todays info
    if (FLAG_ADD_TODAY) {
      try {
        const todaysData = await getTodaysData();
        Object.keys(raw).forEach((country) => {
          const last = raw[country][raw[country].length - 1];
          const lastDate = last.date;
          if (todaysData[country]) {
            if (lastDate === today) {
              raw[country][raw[country].length - 1] = {
                date: todaysData[country].date,
                confirmed: Math.max(todaysData[country].confirmed, last.confirmed),
                deaths: Math.max(todaysData[country].deaths, last.deaths),
                recovered: Math.max(todaysData[country].recovered, last.recovered),
              };
            } else {
              raw[country].push({
                date: todaysData[country].date,
                confirmed: Math.max(todaysData[country].confirmed, last.confirmed),
                deaths: Math.max(todaysData[country].deaths, last.deaths),
                recovered: Math.max(todaysData[country].recovered, last.recovered),
              });
            }
          } else {
            if (last !== today) {
              raw[country].push({
                ...raw[country][raw[country].length - 1],
                date: today,
              });
            }
            console.log('Today\'s data not found for country:', country);
          }
        });
      } catch (e) {
        console.log('error getting today\'s info:', e);
      }
    }

    seriesData = {};

    Object.keys(raw).forEach((country) => {

      let lastValidConfirmed = 0;
      let lastValidDeaths = 0;
      let lastValidRecovered = 0;

      seriesData[country] = raw[country]
        // .filter(({ date: dateString }) => {
        //   const date = moment(dateString);
        //   return date.diff(today, 'months') >= -6;
        // })
        .map(({
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

    localStorage.setItem(KEY_SERIES, compressToUTF16(JSON.stringify(seriesData)));
    localStorage.setItem(KEY_VERSION, VERSION.toString());
    localStorage.setItem(KEY_UPDATED, moment().utc().toISOString());
  }

  // console.log(seriesData);

  return seriesData;
}