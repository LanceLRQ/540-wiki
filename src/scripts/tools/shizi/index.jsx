import { get } from 'lodash';
import React, { useState } from 'react';
import axios  from 'axios';
import {
  Container, Grid, TextField, Button,
  RadioGroup, FormControlLabel, Radio
} from '@material-ui/core';
import { ZeroPlusSevenBibleTheOldTestament } from '../../common/constant/bible';

const ZeroPlusSevenBible = (props) => {
  const [memberId, setMemberId] = useState('');
  const [xiaoxianruo, setXiaoxianruo] = useState('小仙若');
  const [bible, setBible] = useState('');
  const [type, setType] = useState('宅舞');
  const [video, setVideo] = useState('av5551881');
  const [videoName, setVideoName] = useState('神的随波逐流');
  const [biaobai, setBiaobai] = useState('做我女朋友吧');
  const [videoType, setVideoType] = useState('av');
  const [loading, setLoading] = useState(false);
  const req = () => {
    const regex = /https?:\/\/space\.bilibili\.com\/(\d+)/;
    const match = memberId.match(regex);
    let mid = memberId;
    if (match) {
      mid = match[1];
    }
    setLoading(true);
    axios({
      url: 'http://localhost:52540/api/first_video',
      params: {
        mid,
      },
      method: 'get',
    }).then((resp) => {
      setLoading(false);
      const res = resp.data;
      if (get(res, 'status', false)) {
        if (videoType === 'bv') {
          setVideo(get(res, 'data.bvid'));
        } else {
          setVideo(`av${get(res, 'data.aid')}`);
        }
        setXiaoxianruo(get(res, 'data.author'));
        setVideoName(get(res, 'data.title'));
      }
    });
  };
  const gen = () => {
    const rel = ZeroPlusSevenBibleTheOldTestament
      .replace(/\$1/g, xiaoxianruo)
      .replace('$2', type)
      .replace('$3', videoName)
      .replace('$4', video)
      .replace('$5', biaobai);
    setBible(rel);
  };
  return <Container style={{ marginTop: '16px' }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          value={memberId}
          onChange={(e) => { setMemberId(e.target.value); }}
          fullWidth
          label="B站ID或空间地址"
          placeholder="支持B站的用户ID、个人主页空间的地址，示例：16539048"
        />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup row value={videoType} onChange={(e) => setVideoType(e.target.value)}>
          <FormControlLabel value="av" control={<Radio />} label="AV号" />
          <FormControlLabel value="bv" control={<Radio />} label="BV号" />
        </RadioGroup>
      </Grid>
      <Grid item xs={12}>
        <Button color="primary" variant="contained" onClick={req} loading={loading}>读取信息</Button>
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={xiaoxianruo}
          onChange={(e) => { setMemberId(e.target.value); }}
          fullWidth
          label="CP"
          placeholder="示例：小仙若"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={type}
          onChange={(e) => { setType(e.target.value); }}
          fullWidth
          label="分区"
          placeholder="示例：宅舞"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={videoName}
          onChange={(e) => { setVideoName(e.target.value); }}
          fullWidth
          label="视频"
          placeholder="示例：神的随波逐流"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={video}
          onChange={(e) => { setVideo(e.target.value); }}
          fullWidth
          label="AV号"
          placeholder="示例：av5551881"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={biaobai}
          onChange={(e) => { setBiaobai(e.target.value); }}
          fullWidth
          label="表白"
          placeholder="示例：做我女朋友吧"
        />
      </Grid>
      <Grid item xs={12}>
        <Button color="primary" variant="contained" onClick={gen}>生成</Button>
      </Grid>
      <Grid item xs={12}>
        <pre dangerouslySetInnerHTML={{ __html: bible }} />
      </Grid>
    </Grid>
  </Container>;
};

export default ZeroPlusSevenBible;
