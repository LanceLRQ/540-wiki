import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import MoyateAppComponent from './moyate';

export const RootApp = () => {
  return <Router>
    <Route path="/moyate" component={MoyateAppComponent} />
    <Route path="/" render={() => <Redirect to="/moyate" />} />
  </Router>;
};

export default RootApp;
