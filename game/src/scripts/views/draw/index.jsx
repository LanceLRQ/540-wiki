import '@/styles/draw/draw.scss';
import React, { useEffect, useState } from 'react';
import { GamePanel } from './game';
import { LoginPanel } from './login';
import Utils from './utils';

export const DrawSomethingIndex = () => {
  const [userInfo, setUserInfo] = useState(null);
  const checkLogin = () => {
    Utils.API.LoginCheck().then((resp) => {
      setUserInfo(resp);
      console.log(resp);
    });
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return userInfo ? <GamePanel /> : <LoginPanel onLogined={checkLogin} />;
};
