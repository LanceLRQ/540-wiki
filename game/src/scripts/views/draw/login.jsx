import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Utils from '@/scripts/views/draw/utils';

export const LoginPanel = () => {
  const [nickname, setNickname] = useState('');
  const doLogin = () => {
    Utils.API.DoLogin(nickname).then((resp) => {
      console.log(resp);
    });
  };

  return <div className="app-guess460-login">
    <h1>460猜猜猜</h1>
    <div className="login-layout">
      <Input
        prefix={<UserOutlined />}
        size="large"
        placeholder="请输入游戏昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button type="primary" block size="large" style={{ marginTop: 16 }} onClick={doLogin}>进入游戏</Button>
    </div>
  </div>;
};
