import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import MoyateAppComponent from './moyate';

export const RootApp = () => {
  return <React.Fragment>
    <CssBaseline />
    <Router>
      <Route path="/moyate" component={MoyateAppComponent} />
      <Route path="/" render={() => <Redirect to="/moyate" />} />
    </Router>
  </React.Fragment>;
};

export default RootApp;
