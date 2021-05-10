import '@/styles/index.scss';

import React from 'react';
import {
  Link, withRouter
} from 'react-router-dom';
import classnames from 'classnames';
import { renderRoutes } from 'react-router-config';

export const IndexApp = withRouter((props) => {
  const { pathname } = props.location;
  const { route } = props;
  return <div>
    <div className="title">
      Congratulation, Your ReactJS application is Running.
    </div>
    <div className="navigator">
      <Link className={classnames('link', { current: pathname === '/' })} to="/">Index</Link>
      <Link className={classnames('link', { current: pathname === '/page1' })} to="/page1">Counter</Link>
      <Link className={classnames('link', { current: pathname === '/page2' })} to="/page2">Page 2</Link>
      <Link className={classnames('link', { current: pathname === '/typescript' })} to="/typescript">Typescript</Link>
    </div>
    <div className="container">
      {renderRoutes(route.routes)}
    </div>
  </div>;
});
