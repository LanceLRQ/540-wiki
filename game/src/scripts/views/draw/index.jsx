import '@/styles/draw_sth.scss';
import React, { useEffect, useRef } from 'react';

import {
  AppBar, Toolbar,
  Typography, Button, IconButton
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Create as CreateIcon,
  Brush as BrushIcon,
  Delete as DeleteIcon,
  ClearAllRounded as ClearAllRoundedIcon,
  Undo as UndoIcon
} from '@material-ui/icons';
import { DrawBoard } from './utils';

export const DrawSomethingIndex = () => {
  const canvasRef = useRef();
  const pencilRef = useRef();
  let drawBoard = null;
  useEffect(() => {
    if (canvasRef.current) {
      drawBoard = new DrawBoard(canvasRef.current, pencilRef.current);
      drawBoard.init();
    }
  }, []);

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
    <span id="app-draw-pencil" ref={pencilRef} style={{ position: 'absolute', display: 'none', pointerEvents: 'none' }}><CreateIcon /></span>
    <div className="draw-wrapper">
      <canvas ref={canvasRef} style={{ width: 960, height: 540 }} />
      <div>
        <IconButton
          variant="contained"
          color="primary"
        >
          <BrushIcon />
        </IconButton>
        <IconButton
          variant="contained"
        >
          <ClearAllRoundedIcon />
        </IconButton>
        <IconButton
          variant="contained"
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  </div>;
};
