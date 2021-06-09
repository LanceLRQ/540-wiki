import React from 'react';
import T from 'prop-types';
import {
  Avatar, Button, Input, Space, Typography
} from 'antd';
import { buildAvatarPath } from '@/scripts/views/guess460/avatars';

export const RoomView = (props) => {
  const { userInfo } = props;
  return <div className="app-guess460-room">
    <h1>460猜猜猜 - 选择房间</h1>
    <Space direction="vertical" size="large">
      <div className="user-info">
        <Space direction="vertical" align="center">
          <Avatar
            size={80}
            src={buildAvatarPath(userInfo.avatar)}
          />
          <Typography.Text>
            {userInfo.nickname}
          </Typography.Text>
        </Space>
      </div>
      <Button type="primary" size="large" block>创建房间</Button>
      <Input.Search size="large" enterButton="加入房间" />
    </Space>

    {/*<Button size="large" block>加入房间</Button>*/}
  </div>;
};

RoomView.propTypes = {
  userInfo: T.shape({
    avatar: T.string,
    nickname: T.string,
  }).isRequired,
};
