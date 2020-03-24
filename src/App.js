import React from 'react';
import { I18nextProvider, Trans } from "react-i18next";
import i18n from "./i18n";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import MainPanel from './components/main-panel';
import Setup from './components/setup';
import './App.sass';
import { screenFormat } from './util/screen';

function App() {
  return (
    <Router>
      <I18nextProvider i18n={i18n}>
        <div className={`App ${screenFormat}`}>
          <Switch>
            <Route path="/setup">
              <Setup />
            </Route>
            <Route path="/">
              <MainPanel />
            </Route>
          </Switch>
        </div>
      </I18nextProvider>
    </Router>
  );
}

export default App;
