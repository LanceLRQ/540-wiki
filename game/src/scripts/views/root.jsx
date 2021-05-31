import 'antd/dist/antd.less';
import '@/styles/index.scss';
import { Layout, Menu } from 'antd';

import React from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

const { Header, Content, Footer } = Layout;

export const IndexApp = withRouter((props) => {
  const { route } = props;
  return <Layout className="website-main-layout">
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">你画我猜</Menu.Item>
      </Menu>
    </Header>
    <Content className="website-content-layout">
      {renderRoutes(route.routes)}
    </Content>
    <Footer>&copy; 2021 LanceLRQ </Footer>
  </Layout>;
});
