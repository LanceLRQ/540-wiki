import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Delete as DeleteIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Undo as UndoIcon
} from '@material-ui/icons';
import {
  Grid, IconButton, Slider
} from '@material-ui/core';
import EraserIcon from '@/svgs/eraser.svg';
import { SvgIcon } from '@/scripts/common/svgicon';
import { DrawBoard } from './utils';

let drawBoard = null;

export const SketchingBoard = (props) => {
  const { width, height, targetImage } = props;
  const canvasRef = useRef();
  const pencilRef = useRef();
  const [pencilWidth, setPencilWidth] = useState(31);
  const [cursorType, setCursorType] = useState('eraser');
  const [targetImg, setTargetImg] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      drawBoard = new DrawBoard(canvasRef.current, pencilRef.current);
      drawBoard.onChange = (msg) => {
        console.log(JSON.stringify(msg));
      };
      drawBoard.readonly = false;
      drawBoard.init();
      // drawBoard.reset();
      window.drawBoard = drawBoard;
      drawBoard.setPencilStyle(pencilWidth);

      const img = new Image();
      img.src = targetImage;
      img.onload = () => {
        setTargetImg(targetImage);
      };
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
      drawBoard.setPencilStyle(pencilWidth);
    }
  }, [pencilWidth]);

  useEffect(() => {
    drawBoard.setCursorType(cursorType);
  }, [cursorType]);

  return <>

    <div className="draw-wrapper" style={{ width, height, backgroundImage: `url(${targetImg})`, display: targetImg ? 'block' : 'none' }}>
      <canvas className="cover-layer" ref={canvasRef} width={width} height={height} style={{ width, height }} />
      <span id="app-draw-pencil" ref={pencilRef} style={{ position: 'absolute', display: 'none', pointerEvents: 'none' }}><RadioButtonUncheckedIcon style={{ fontSize: pencilWidth * 2 + 2 }} /></span>
    </div>
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Grid container spacing={1}>
          <Grid item xs={6} style={{ lineHeight: '64px' }}>
            <Slider
              value={pencilWidth}
              onChange={(e, v) => { setPencilWidth(v * 1); }}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={5}
              marks
              min={11}
              max={51}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'right' }}>
        <IconButton
          variant="contained"
          color={cursorType === 'eraser' ? 'primary' : 'default'}
          onClick={() => setCursorType('eraser')}
        >
          <SvgIcon icon={EraserIcon} />
        </IconButton>
        <IconButton
          variant="contained"
          onClick={() => drawBoard.undo()}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
          onClick={() => drawBoard.reset()}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  </>;
};

SketchingBoard.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  targetImage: PropTypes.string.isRequired,
};

SketchingBoard.defaultProps = {
  width: 960,
  height: 540,
};
