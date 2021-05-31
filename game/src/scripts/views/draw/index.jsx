import '@/styles/draw/draw.scss';
import React from 'react';
import { Input, Button, Row, Col } from 'antd';
import CatImg from '@/images/cat.jpg';
import { SketchingBoard } from './sketching';

export const DrawSomethingIndex = () => {
  return <div className="app-draw-something">
    <div className="sketch-layout">
      <SketchingBoard width={960} height={540} targetImage={CatImg} />
    </div>
    <div className="chat-layout">
      <div className="chat-list">

      </div>
      <div className="input-area">
        <Row gutter={8}>
          <Col flex={1}>
            <Input />
          </Col>
          <Col flex={0}>
            <Button type="primary">发送</Button>
          </Col>
        </Row>
      </div>
    </div>
  </div>;
};
