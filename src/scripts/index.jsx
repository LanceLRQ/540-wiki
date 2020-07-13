import 'fontsource-roboto';
import 'styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { RootApp } from './root';

const render = () => {
  ReactDOM.render(
    <RootApp />,
    document.getElementById('root')
  );
};

render();
// if (module.hot) {
//   module.hot.accept('./root.jsx', () => {
//     render(require('./root.jsx').default);
//   });
// }
