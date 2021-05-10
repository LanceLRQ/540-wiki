import { IndexApp } from '../views/root';
import { HomePage } from '../views/home';
import { DrawSomethingIndex } from '../views/draw/index';

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
        path: '/draw',
        component: DrawSomethingIndex,
      }
    ],
  }
];
