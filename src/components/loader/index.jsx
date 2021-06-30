import React from 'react';
import './style.sass';
import logo from '../../images/covid-cases-logo.png';

function Loader({
  children,
}) {
  return (
    <div className="loader">
      <img className="logo bounce" src={logo} alt="Covid Cases" />
      {children}
    </div>
  );
}

export default Loader;
