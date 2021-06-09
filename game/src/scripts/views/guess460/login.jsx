import React, { useState } from 'react';
import T from 'prop-types';
import {
  Input, Button, Avatar, Modal, Tabs
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Utils from '@/scripts/views/guess460/utils';
import { AvatarFumei, buildAvatarPath } from '@/scripts/views/guess460/avatars';

export const LoginPanel = (props) => {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('p:fumei:07.png');
  const [loading, setLoading] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [avatarType, setAvatarType] = useState('fumei');
  const doLogin = () => {
    setLoading(true);
    Utils.API.DoLogin({
      avatar,
      nick_name: nickname,
    }).then(() => {
      setLoading(false);
      props.onLogined();
    });
  };
  const handlePickAvatar = (key) => () => {
    setAvatar(key);
    setAvatarPickerVisible(false);
  };

  return <div className="app-guess460-login">
    <h1>460猜猜猜</h1>
    <div className="login-layout">
      <div className="user-avatar">
        <Avatar
          size={80}
          src={buildAvatarPath(avatar)}
          onClick={() => setAvatarPickerVisible(true)}
        />
      </div>
      <Input
        prefix={<UserOutlined />}
        size="large"
        placeholder="请输入游戏昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button
        loading={loading}
        type="primary"
        block
        size="large"
        style={{ marginTop: 16 }}
        onClick={doLogin}
      >
        进入游戏
      </Button>
      <Modal
        title="选择头像"
        visible={avatarPickerVisible}
        footer={false}
        width={540}
        onCancel={() => setAvatarPickerVisible(false)}
      >
        <Tabs activeKey={avatarType} onChange={(k) => setAvatarType(k)}>
          <Tabs.TabPane tab="福美酱" key="fumei">
            <div className="avatar-picker">
              {AvatarFumei.map((item) => <div
                key={item}
                className="avatar-picker-item"
                onClick={handlePickAvatar(`p:fumei:${item}`)}
              >
                <Avatar size={80} src={buildAvatarPath(`p:fumei:${item}`)} />
              </div>)}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  </div>;
};

LoginPanel.propTypes = {
  onLogined: T.func.isRequired,
};
