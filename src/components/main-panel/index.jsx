import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Country from '../country';
import { useInterval } from '../../util/use-interval';
import { loadSeries } from '../../services/series';
import Loader from '../loader';

import './style.sass'
import { detectUserLocation } from '../../services/location';

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
      (async () => {
        const url = new URL(window.location.href);
        const routeCountries = url.searchParams.get('countries');
        const routeDuration = url.searchParams.get('duration');

        const valid = [
          ...Object.keys(series),
          'Global',
        ];
        if (routeCountries) {
          setCountries(routeCountries.split(',').map((country) => country.trim()).filter((country) => valid.includes(country)));
        } else {
          const location = await detectUserLocation();
          if (valid.includes(location)) {
            setCountries([location]);
          }
        }

        if (routeDuration && !isNaN(+routeDuration)) {
          setPageTime(+routeDuration * 1000);
        }
        setLoading(false);
      })();
    }
  }, [series]);

  useEffect(() => {
    (async () => {
      const wait = (delay) => new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
      const [seriesData] = await Promise.all([
        loadSeries(),
        wait(1000),
      ]);

      setSeries(seriesData);
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
          day.confirmed += (series[country][i] && series[country][i].confirmed) || 0;
          day.deaths += (series[country][i] && series[country][i].deaths) || 0;
          day.recovered += (series[country][i] && series[country][i].recovered) || 0;
          day.date = day.date || series[country][i].date;
        });
        result.push(day);
      }
    }

    return result;
  }, [series]);

  if (loading) {
    return (
      <Loader>{t('Loading')}...</Loader>
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