import { IndexApp } from '../views/root';
import { HomePage } from '../views/home';
import { DrawSomethingIndex } from '../views/guess460/index';

export const routes = [
  {
    component: IndexApp,
    routes: [
      {
        path: '/',
        exact: true,
        component: HomePage,
      },
      {
        path: '/guess460',
        component: DrawSomethingIndex,
      }
    ],
  }
];
