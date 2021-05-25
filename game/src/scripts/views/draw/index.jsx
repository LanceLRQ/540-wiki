import '@/styles/draw_sth.scss';
import React, { useEffect, useRef, useState } from 'react';
import { GithubPicker } from 'react-color';
import {
  AppBar, Toolbar, Grid, Slider,
  Typography, Button, IconButton
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Create as CreateIcon,
  Brush as BrushIcon,
  Delete as DeleteIcon,
  ClearAllRounded as ClearAllRoundedIcon,
  Undo as UndoIcon,
  ColorLens as ColorLensIcon
} from '@material-ui/icons';
import { DrawBoard } from './utils';

const COLORS_LIST = [
  '#000000', '#FF0000', '#faad14', '#ffff00', '#00FF00', '#006B76', '#1273DE', '#004DCF', '#5300EB',
  '#bfbfbf', '#EB9694', '#fff1b8', '#ffffb8', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'
];

let drawBoard = null;

export const DrawSomethingIndex = () => {
  const canvasRef = useRef();
  const pencilRef = useRef();
  const [pencilWidth, setPencilWidth] = useState(5);
  const [pencilColor, setPencilColor] = useState('#000');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      drawBoard = new DrawBoard(canvasRef.current, pencilRef.current);
      drawBoard.init();
      drawBoard.setPencilStyle(pencilWidth, pencilColor);
    }
    return () => {
      if (drawBoard) {
        drawBoard.destory();
        drawBoard = null;
      }
    };
  }, []);
  useEffect(() => {
    if (drawBoard) {
      drawBoard.setPencilStyle(pencilWidth, pencilColor);
    }
    if (colorPickerVisible) setColorPickerVisible(false);
  }, [pencilWidth, pencilColor]);

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
      <canvas ref={canvasRef} width={960} height={540} style={{ width: 960, height: 540 }} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item>
              <IconButton
                variant="contained"
                color="primary"
                onClick={() => { setColorPickerVisible(!colorPickerVisible); }}
              >
                <ColorLensIcon style={{ color: pencilColor }} />
              </IconButton>
              {colorPickerVisible && <div style={{ position: 'fixed' }}>
                <GithubPicker
                  onChange={(color) => { setPencilColor(color.hex); }}
                  colors={COLORS_LIST}
                  color={pencilColor}
                  width={240}
                />
              </div>}
            </Grid>
            <Grid item xs={3} style={{ lineHeight: '64px' }}>
              <Slider
                value={pencilWidth}
                onChange={(e, v) => { setPencilWidth(v * 1); }}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={2}
                marks
                min={1}
                max={11}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
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
        </Grid>
      </Grid>
    </div>
  </div>;
};
