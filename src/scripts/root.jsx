import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import ToolsAppComponent from './tools';

export const RootApp = () => {
  return <React.Fragment>
    <CssBaseline />
    <Router>
      <Route path="/tools" component={ToolsAppComponent} />
      <Route path="/" exact render={() => <Redirect to="/tools" />} />
    </Router>
  </React.Fragment>;
};

export default RootApp;
