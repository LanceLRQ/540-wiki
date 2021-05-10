import '@/styles/index.scss';

import React from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import CssBaseline from '@material-ui/core/CssBaseline';

export const IndexApp = withRouter((props) => {
  const { route } = props;
  return <div className="app_container">
    <CssBaseline />
    {renderRoutes(route.routes)}
  </div>;
});
