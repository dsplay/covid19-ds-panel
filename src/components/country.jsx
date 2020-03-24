import React from 'react';
import CountriesChart from './countries-chart';
import countries from '../data/countries.json';
import { useTranslation } from "react-i18next";
import { GLOBAL } from '../util/consts';


function Country({
  country = GLOBAL,
  series,
}) {

  const lastest = series[series.length - 1];
  const yesterday = series[series.length - 2];

  const {
    confirmed,
    deaths,
    recovered,
  } = lastest;

  const { confirmed: confirmedYesterday } = yesterday;
  const newCases = confirmed - confirmedYesterday;

  const startIdx = series.findIndex(({
    confirmed,
    deaths,
    recovered,
  }) => confirmed > 0 || deaths > 0 || recovered > 0);

  const confirmedCasesData = [{
    id: 'confirmed',
    data: series.map(({ confirmed, date }) => ({
      x: date,
      y: confirmed,
    })).slice(Math.max(startIdx, 0)),
  }];

  const deathsData = [{
    id: 'deaths',
    data: series.map(({ deaths, date }) => ({
      x: date,
      y: deaths,
    })).slice(Math.max(startIdx, 0)),
  }];

  const recoveredData = [{
    id: 'recovered',
    data: series.map(({ recovered, date }) => ({
      x: date,
      y: recovered,
    })).slice(Math.max(startIdx, 0)),
  }];


  const { t } = useTranslation();

  return (
    <div className="country row full-height">
      <div className="title">
        {country !== GLOBAL && <span className="country-title">{countries[country] ? countries[country].flag : '🇧🇱'} {country}</span>}
        {country === GLOBAL && <span className="country-title"><span role="img" aria-label={t(GLOBAL)}>🌎</span> {t(GLOBAL)}</span>}
        <span className="covid">COVID-19</span>
      </div>

      <div className="detail">
        <div className="country-summary">
          <div className="row new">
            <div className="label"><span role="img" aria-label={t('New Cases')}>🔥</span> {t('New Cases')} <span role="img" aria-label={t('New Cases')}>🤧</span></div>
            <div className="value">{newCases}</div>
          </div>
          <div className="row confirmed">
            <div className="label"><span role="img" aria-label={t('Confirmed Cases')}>🤒</span> {t('Confirmed Cases')} <span role="img" aria-label={t('Confirmed Cases')}>😷</span></div>
            <div className="value">{confirmed}</div>
          </div>
          <div className="row deaths">
            <div className="label"><span role="img" aria-label={t('Deaths')}>😢</span> {t('Deaths')} <span role="img" aria-label={t('Deaths')}>😞</span></div>
            <div className="value">{deaths}</div>
          </div>
          <div className="row recovered">
            <div className="label"><span role="img" aria-label={t('Recovered')}>🕺</span> {t('Recovered')} <span role="img" aria-label={t('Recovered')}>💃</span> </div>
            <div className="value">{recovered}</div>
          </div>
        </div>

        <div className="country-chart-container">
          <div className="confirmed">
            <CountriesChart
              data={confirmedCasesData}
              yLegend={t('Confirmed Cases')}
              colors={['dodgerblue']}
            />
          </div>
          <div className="deaths">
            <CountriesChart
              data={deathsData}
              yLegend={t('Deaths')}
              maxItemsX={5}
              colors={['red']}
            />
          </div>
          <div className="recovered">
            <CountriesChart
              data={recoveredData}
              yLegend={t('Recovered')}
              maxItemsX={5}
              colors={['teal']}
            />
          </div>
        </div>
      </div>

    </div>
  )

}

export default Country;