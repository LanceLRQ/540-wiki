import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import ToolsAppComponent from './tools';
import { BirthdayAppComponent } from './birthday';
import { MainRoutes } from './common/constant/routes';

export const RootApp = () => {
  return <React.Fragment>
    <CssBaseline />
    <Router>
      <Route path={MainRoutes.Tools} component={ToolsAppComponent} />
      <Route path={MainRoutes.Birthday} component={BirthdayAppComponent} />
      <Route path="/" exact render={() => <Redirect to="/tools" />} />
    </Router>
  </React.Fragment>;
};

export default RootApp;
