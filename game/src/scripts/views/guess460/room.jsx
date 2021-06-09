import React from 'react';
import { Button, Input, Space } from 'antd';

export const RoomView = () => {
  return <div className="app-guess460-login">
    <h1>460猜猜猜 - 选择房间</h1>
    <Space direction="vertical" size="large">
      <Button type="primary" size="large" block>创建房间</Button>
      <Input.Search size="large" enterButton="加入房间" />
    </Space>

    {/*<Button size="large" block>加入房间</Button>*/}
  </div>;
};
