import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { moyatingGenerator } from './util';

const MoyateAppComponent = () => {
  const [zuowen, setZuowen] = useState('');
  const generate = () => {
    setZuowen(`<p>${moyatingGenerator('我还有机会吗').replace(/\n/g, '</p><p>')}</p>`);
  };
  return <div>
    <Button variant="contained" color="primary" onClick={generate}>
      生成
    </Button>
    <div className="paragraph" dangerouslySetInnerHTML={{__html: zuowen}} />
  </div>;
};

export default MoyateAppComponent;
