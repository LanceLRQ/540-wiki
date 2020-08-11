import { get } from 'lodash';
import React, { useEffect, useState } from 'react';import {
  Container, Grid, TextField, Button,
  RadioGroup, FormControlLabel, Radio
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import copy from 'copy-to-clipboard';
import { ServerApi } from '../../common/utils/api_client';
import { ZeroPlusSevenBibleTheOldTestament, ZeroPlusSevenBibleTheNewTestament } from '../../common/constant/bible';

const ZeroPlusSevenBible = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [memberId, setMemberId] = useState('');
  const [xiaoxianruo, setXiaoxianruo] = useState('小仙若');
  const [cucu, setCucu] = useState('醋醋');
  const [linjiaqi, setLinjiaqi] = useState('林佳奇');
  const [wenxiaoyi, setWenxiaoyi] = useState('文晓依');
  const [shizi, setShizi] = useState('狮子');
  const [bible, setBible] = useState('');
  const [type, setType] = useState('宅舞');
  const [video, setVideo] = useState('av5551881');
  const [videoName, setVideoName] = useState('神的随波逐流');
  const [biaobai, setBiaobai] = useState('做我女朋友吧');
  const [videoType, setVideoType] = useState('av');
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState('1');
  const req = () => {
    const regex = /https?:\/\/space\.bilibili\.com\/(\d+)/;
    const match = memberId.match(regex);
    let mid = memberId;
    if (match) {
      mid = match[1];
    }
    setLoading(true);
    const req = ServerApi({
      url: '/api/first_video',
      params: {
        mid,
      },
      method: 'get',
    });
    req.result.then((resp) => {
      const res = resp.data;
      setLoading(false);
      if (res.status) {
        if (get(res, 'status', false)) {
          if (videoType === 'bv') {
            setVideo(get(res, 'data.bvid'));
          } else {
            setVideo(`av${get(res, 'data.aid')}`);
          }
          setXiaoxianruo(get(res, 'data.author'));
          setVideoName(get(res, 'data.title'));
        }
      } else {
        enqueueSnackbar(`请求接口错误：${res.message}`, { variant: 'error' });
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
  const gen2 = () => {
    const rel = ZeroPlusSevenBibleTheNewTestament
      .replace(/\$1/g, cucu)
      .replace(/\$2/g, shizi)
      .replace(/\$4/g, wenxiaoyi)
      .replace(/\$3/g, linjiaqi);
    setBible(rel);
  };
  const copyBible = () => {
    copy(bible);
    enqueueSnackbar('复制成功', { variant: 'success' });
  };
  useEffect(() => {
    gen();
  }, []);
  return <Container style={{ marginTop: '16px' }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <RadioGroup
          row
          value={version}
          onChange={(e) => {
            setVersion(e.target.value);
            console.log(e.target.value);
            if (e.target.value === '2') {
              gen2();
            } else {
              gen();
            }
          }}
        >
          <FormControlLabel value="1" control={<Radio />} label="旧约" />
          <FormControlLabel value="2" control={<Radio />} label="新约" />
        </RadioGroup>
      </Grid>
      {version === '1' ? <React.Fragment>
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
          <Button color="primary" variant="contained" onClick={req} disabled={loading}>读取信息</Button>
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
      </React.Fragment> : <React.Fragment>
        <Grid item xs={6}>
          <TextField
            value={cucu}
            onChange={(e) => { setCucu(e.target.value); }}
            fullWidth
            label="醋醋"
            placeholder=""
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={shizi}
            onChange={(e) => { setShizi(e.target.value); }}
            fullWidth
            label="狮子"
            placeholder=""
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={wenxiaoyi}
            onChange={(e) => { setWenxiaoyi(e.target.value); }}
            fullWidth
            label="文晓依"
            placeholder=""
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={linjiaqi}
            onChange={(e) => { setLinjiaqi(e.target.value); }}
            fullWidth
            label="林佳奇"
            placeholder=""
          />
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" onClick={gen2}>生成</Button>
        </Grid>
      </React.Fragment>}
      <Grid item xs={12}>
        <pre
          style={{ fontSize: '16px', whiteSpace: 'pre-wrap', display: 'block' }}
          dangerouslySetInnerHTML={{ __html: bible }}
          onClick={copyBible}
        />
      </Grid>
    </Grid>
  </Container>;
};

export default ZeroPlusSevenBible;
