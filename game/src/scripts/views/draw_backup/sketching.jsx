import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ColorLens as ColorLensIcon, Create as CreateIcon, Delete as DeleteIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon, Undo as UndoIcon
} from '@material-ui/icons';
import {
  Grid, IconButton, Slider, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { GithubPicker } from 'react-color';
import EraserIcon from '@/svgs/eraser.svg';
import { SvgIcon } from '@/scripts/common/svgicon';
import CatImg from '@/images/cat.jpeg';
import { DrawBoard } from './utils';

const COLORS_LIST = [
  '#000000', '#FF0000', '#faad14', '#ffff00', '#00FF00', '#006B76', '#1273DE', '#004DCF', '#5300EB',
  '#bfbfbf', '#EB9694', '#fff1b8', '#ffffb8', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'
];

let drawBoard = null;

export const SketchingBoard = (props) => {
  const { width, height } = props;
  const canvasRef = useRef();
  const pencilRef = useRef();
  const [pencilWidth, setPencilWidth] = useState(11);
  const [pencilColor, setPencilColor] = useState('#000');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [cursorType, setCursorType] = useState('pencil');
  const clearBtnRef = useRef();
  const [clearConfirmVisible, setClearConfirmVisible] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      drawBoard = new DrawBoard(canvasRef.current, pencilRef.current);
      drawBoard.onChange = (msg) => {
        console.log(JSON.stringify(msg));
      };
      drawBoard.init();
      window.drawBoard = drawBoard;
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

  useEffect(() => {
    drawBoard.setCursorType(cursorType);
  }, [cursorType]);

  return <>
    <span id="app-draw-pencil" ref={pencilRef} style={{ position: 'absolute', display: 'none', pointerEvents: 'none' }}><RadioButtonUncheckedIcon style={{ fontSize: pencilWidth * 2 + 2 }} /></span>
    <div className="draw-wrapper">
      <canvas ref={canvasRef} width={width} height={height} style={{ width, height }} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item>
              <ClickAwayListener onClickAway={() => { setColorPickerVisible(false); }}>
                <div>
                  {cursorType === 'pencil' && <IconButton
                    variant="contained"
                    color="primary"
                    onClick={() => { setColorPickerVisible(!colorPickerVisible); }}
                  >
                    <ColorLensIcon style={{ color: pencilColor }} />
                  </IconButton>}
                  {colorPickerVisible && <div style={{ position: 'fixed' }}>
                    <GithubPicker
                      onChange={(color) => { setPencilColor(color.hex); }}
                      colors={COLORS_LIST}
                      color={pencilColor}
                      width={240}
                    />
                  </div>}
                </div>
              </ClickAwayListener>
            </Grid>
            <Grid item xs={3} style={{ lineHeight: '64px' }}>
              <Slider
                value={pencilWidth}
                onChange={(e, v) => { setPencilWidth(v * 1); }}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={2}
                marks
                min={3}
                max={20}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <IconButton
            variant="contained"
            color={cursorType === 'pencil' ? 'primary' : 'default'}
            onClick={() => setCursorType('pencil')}
          >
            <CreateIcon />
          </IconButton>
          <IconButton
            variant="contained"
            color={cursorType === 'eraser' ? 'primary' : 'default'}
            onClick={() => setCursorType('eraser')}
          >
            <SvgIcon icon={EraserIcon} />
          </IconButton>
          <IconButton
            variant="contained"
            onClick={() => drawBoard.undo() }
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            ref={clearBtnRef}
            variant="contained"
            color="secondary"
            onClick={() => { setClearConfirmVisible(true); }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Dialog
        open={clearConfirmVisible}
        onClose={() => { setClearConfirmVisible(false); }}
      >
        <DialogTitle>确定要清除画布吗？</DialogTitle>
        <DialogContent>
          <DialogContentText>操作不可撤销</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setClearConfirmVisible(false); }}>取消</Button>
          <Button onClick={() => { setClearConfirmVisible(false); drawBoard.clean(); }} color="primary" autoFocus>确定</Button>
        </DialogActions>
      </Dialog>
    </div>
  </>;
};

SketchingBoard.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

SketchingBoard.defaultProps = {
  width: 960,
  height: 540,
};
