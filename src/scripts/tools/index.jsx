import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, withRouter } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography,
  Drawer, List, ListItem, ListItemText, ListSubheader,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import MoyatingGenerator from './myt';
import ZeroPlusSevenBible from './shizi';
import { RoutePropTypes } from '../common/prop-types/common';
import { MainRoutes, ToolsRoutes } from '../common/constant/routes';
import { buildPath, gotoPath } from '../common/utils/location_helper';

const ToolsIndex = (props) => {
  return <div>欢迎使用整活工具箱，请选择你要整的活儿</div>;
};

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const ToolsApp = withRouter((props) => {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    document.title = '整活工具箱';
  }, []);
  return <main>
    <Drawer anchor="left" open={isDrawerOpen} onClose={() => { setDrawerOpen(false); }}>
      <List
        component="nav"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            整活工具箱
          </ListSubheader>
        }
      >
        <ListItem button>
          <ListItemText
            onClick={gotoPath(props, buildPath(ToolsRoutes.shizi))}
          >
            狮林圣经
          </ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText
            onClick={gotoPath(props, buildPath(ToolsRoutes.myt))}
          >
            磨牙特生成器
          </ListItemText>
        </ListItem>
      </List>
    </Drawer>
    <header>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => { setDrawerOpen(true); }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            整活工具箱
          </Typography>
          {/*<Button color="inherit">Login</Button>*/}
        </Toolbar>
      </AppBar>
    </header>
    <section>
      <Switch>
        <Route path={ToolsRoutes.myt} exact component={MoyatingGenerator} />
        <Route path={ToolsRoutes.shizi} exact component={ZeroPlusSevenBible} />
        <Route path={MainRoutes.Tools} exact render={() => <ToolsIndex />} />
      </Switch>
    </section>
  </main>;
});

ToolsApp.propTypes = {
  ...RoutePropTypes,
};

export default ToolsApp;
