import { IndexApp } from '../views/root';
import { Page0 } from '../views/page0';
import { Page1 } from '../views/page1';
import { TsApp } from '../views/test';
import TestClassBasedApp from '../views/page2';

export const routes = [
  {
    component: IndexApp,
    routes: [
      {
        path: '/',
        exact: true,
        component: Page0,
      },
      {
        path: '/page1',
        component: Page1,
      },
      {
        path: '/page2',
        component: TestClassBasedApp,
        fetchData: TestClassBasedApp.fetchData,
      },
      {
        path: '/typescript',
        component: TsApp,
      }
    ],
  }
];
