import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Grid, TextField, Button
} from '@material-ui/core';

const ZeroPlusSevenBible = (props) => {
  return <Container style={{ marginTop: '16px' }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="B站ID或空间地址"
          placeholder="支持B站的用户ID、个人主页空间的地址"
        />
      </Grid>
      <Grid item xs={12}>
        <Button color="primary" variant="contained">读取信息</Button>
      </Grid>
    </Grid>
  </Container>;
};

export default ZeroPlusSevenBible;
