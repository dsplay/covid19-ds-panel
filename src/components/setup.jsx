import React, { useState, useEffect, useMemo } from 'react';
import qs from 'query-string';
import { useTranslation } from "react-i18next";
import { loadSeries } from '../util/series';
import countries from '../data/countries.json';
import { GLOBAL } from '../util/consts';
import logo from '../images/dsplay-logo.png';


function CountryOption({
  country,
  selected = [],
  onSelect,
}) {
  const { t } = useTranslation();
  const id = `chk_${country}`;

  return (
    <div className="country-check">
      <input id={id} type="checkbox" onChange={onSelect} checked={selected.includes(country)} />
      <label htmlFor={id}>
        {country !== GLOBAL && <span className="country-title">{countries[country] ? countries[country].flag : '🇧🇱'} {country}</span>}
        {country === GLOBAL && <span className="country-title"><span role="img" aria-label={GLOBAL}>🌎</span> {t(GLOBAL)}</span>}
      </label>
    </div>
  );
}

function Setup() {

  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [duration, setDuration] = useState(15);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const seriesData = await loadSeries();
      setCountries([
        GLOBAL,
        ...Object.keys(seriesData).sort((a, b) => {
          return seriesData[b][seriesData[b].length - 1].confirmed - seriesData[a][seriesData[a].length - 1].confirmed;
        }),
      ]);
      setLoading(false);
    })();
  }, []);

  const url = useMemo(() => {
    const url = new URL(window.location.href);
    let result = `${url.origin}`;
    const query = {};

    if (selectedCountries.length > 0) {
      if (selectedCountries.length > 1) {
        query.duration = duration;
      }
      query.countries = selectedCountries.join(',');
    }

    if (Object.keys(query).length > 0) {
      result += '?' + qs.stringify(query);
    }

    return result;

  }, [selectedCountries, duration]);

  if (loading) {
    return (
      <div>{t('Loading')}...</div>
    )
  }

  const handleSelect = (country) => ({ target: { checked } }) => {
    if (checked) {
      if (!selectedCountries.includes(country)) {
        setSelectedCountries([
          ...selectedCountries,
          country,
        ]);
      }
    } else {
      const array = selectedCountries.slice();
      const index = array.indexOf(country);
      if (index !== -1) array.splice(index, 1);
      setSelectedCountries(array);
    }
  };

  function handleSelectAllCountries() {
    setSelectedCountries(countries.slice());
  }

  function handleSelectNoCountries() {
    setSelectedCountries([]);
  }

  const handleCopy = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
      }, function () {
        alert('Error copying to Clipboard. Try copying it manually!')
      });
    } else {
      alert('Error copying to Clipboard. Try copying it manually!');
    }
  };

  function handleVisit() {
    window.location = url;
  }

  return (
    <div className="setup">
      <div className="line-bg" />
      <header>
        <a href="https://dsplay-tv">
          <img alt="DSPLAY - Digtal Signage" src={logo} style={{ height: 70 }} />
        </a>
         <div> COVID-19<br/>{t('Panel Setup')}</div>
      </header>
      <div className="content">
        <fieldset>
          <legend>{t('Your Digital Signage Panel URL')}</legend>
          <code>{url}</code>
          <button onClick={handleCopy}>{t('Copy to Clipboard')}</button>
          <button onClick={handleVisit}>{t('Open')}</button>
        </fieldset>
        <fieldset>
          <legend>{t('Duration per Country/Place')}</legend>
          <div>
            <input disabled={selectedCountries.length <= 1} className="duration" type="number" value={duration} onChange={({ target: { value } }) => setDuration(value)}></input> {t('Seconds')}
          </div>
          <div className="tip">*{t('this only applies if you select more than 1 country/place')}</div>
        </fieldset>
        <fieldset>
          <legend>{t('Countries/Places')}</legend>
          <button onClick={handleSelectAllCountries}>{t('Select All')}</button>
          <button onClick={handleSelectNoCountries}>{t('Select None')}</button>
          <br /><br />
          <div className="countries">
            {countries.map((country) => <CountryOption key={country} country={country} selected={selectedCountries} onSelect={handleSelect(country)} />)}
          </div>

        </fieldset>
      </div>
      <div className="credits">
        powered by&nbsp;
        <a href="https://dsplay.tv">dsplay.tv</a>
      </div>
    </div>
  );
}

export default Setup;