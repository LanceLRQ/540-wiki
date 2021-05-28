import '@/styles/draw_sth.scss';
import React from 'react';
import {
  AppBar, Toolbar,
  Typography, Button, IconButton
} from '@material-ui/core';
import {
  Menu as MenuIcon
} from '@material-ui/icons';
import CatImg from '@/images/cat.jpeg';
import { SketchingBoard } from './sketching';

export const DrawSomethingIndex = () => {
  return <div id="app-draw-somethind">
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          你画我猜
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
    <div style={{ width: 960, height: 540, margin: '24px auto' }}>
      <SketchingBoard width={960} height={540} targetImage={CatImg} />
    </div>
  </div>;
};
