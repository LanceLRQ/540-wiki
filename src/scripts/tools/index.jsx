import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import MoyatingGenerator from './myt';
import ZeroPlusSevenBible from './shizi';

const ToolsIndex = (props) => {
  return <div>hello12</div>;
}

const ToolsApp = (props) => {
  return <Router>
    <Route path="/tools/myt" exact component={MoyatingGenerator} />
    <Route path="/tools/shizi" exact component={ZeroPlusSevenBible} />
    <Route path="/tools" exact render={() => <ToolsIndex />} />
  </Router>;
};

export default ToolsApp;
