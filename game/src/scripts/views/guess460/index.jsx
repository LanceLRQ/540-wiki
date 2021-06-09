import '@/styles/draw/draw.scss';
import { get } from 'lodash';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { GamePanel } from './game';
import { LoginPanel } from './login';
import { RoomView } from './room';
import Utils from './utils';

export const DrawSomethingIndex = () => {
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const checkLogin = () => {
    Utils.API.LoginCheck().then((resp) => {
      setLoading(false);
      setUserInfo(get(resp, 'data', null));
    });
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (isLoading) {
    return <div className="app-guess460-loading">
      <Spin tip="载入中" />
    </div>;
  }
  if (userInfo) {
    if (roomInfo) {
      return <GamePanel />;
    }
    return <RoomView />;
  }
  return <LoginPanel onLogined={checkLogin} />;
};
