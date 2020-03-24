import React, { useEffect, useState, useMemo } from 'react';
import Country from './country';
import { useInterval } from '../util/use-interval';
import { loadSeries } from '../util/series';
import { useTranslation } from 'react-i18next';

const url = new URL(window.location.href);

function MainPanel() {

  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState();
  const [countryIndex, setCountryIndex] = useState(0);
  const [countries, setCountries] = useState([]);
  const [pageTime, setPageTime] = useState(15000);

  useEffect(() => {
    if (series) {
      const url = new URL(window.location.href);
      const routeCountries = url.searchParams.get('countries');
      const routeDuration = url.searchParams.get('duration');

      if (routeCountries) {
        const valid = [
          ...Object.keys(series),
          'Global',
        ];
        setCountries(routeCountries.split(',').map((country) => country.trim()).filter((country) => valid.includes(country)));
      }

      if (routeDuration && !isNaN(+routeDuration)) {
        setPageTime(+routeDuration * 1000);
      }
    }
  }, [series]);

  useEffect(() => {
    (async () => {
      const seriesData = await loadSeries();
      setSeries(seriesData);
      setLoading(false);
    })();
  }, []);

  useInterval(() => {
    setCountryIndex((countryIndex + 1) % countries.length);
  }, countries.length > 1 ? pageTime : null);

  const global = useMemo(() => {
    const result = [];

    if (series) {
      const allCountries = Object.keys(series);

      const timeLength = series[allCountries[0]].length;

      // console.log(timeLength, allCountries);
      for (let i = 0; i < timeLength; i++) {
        const day = {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        };
        allCountries.forEach((country) => {
          day.confirmed += series[country][i].confirmed;
          day.deaths += series[country][i].deaths;
          day.recovered += series[country][i].recovered;
          day.date = series[country][i].date;
        });
        result.push(day);
      }
    }

    return result;
  }, [series]);

  if (loading) {
    return (
      <div>{t('Loading')}...</div>
    );
  }

  const country = countries[countryIndex];
  let data = series[country];

  if (countries.length > 0) {
    data = country === 'Global' ? global : series[country];
  } else {
    data = global;
    // console.log(global);
  }

  return (
    <div className="main-panel">
      <Country
        country={country}
        series={data}
      />
      <div className="credits">
        <p>
          powered by <strong><a href="https://dsplay.tv">dsplay.tv</a></strong> | <a href={`${url.origin}/setup`}>setup</a>
        </p>
      </div>
    </div>
  )
}

export default MainPanel;