import 'fontsource-roboto';
import 'styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';

const render = (Component) => {
  ReactDOM.render(
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>,
    document.getElementById('root')
  );
};

render(require('./root.jsx').default);

if (module.hot) {
  module.hot.accept('./root.jsx', () => {
    render(require('./root.jsx').default);
  });
}
