import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography,
  Drawer, List, ListItem, ListItemText, ListSubheader,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import MoyatingGenerator from './myt';
import ZeroPlusSevenBible from './shizi';
import { RoutePropTypes } from '../common/prop-types/common';

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
          <ListItemText>狮林圣经</ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText>磨牙特生成器</ListItemText>
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
      <Router>
        <Route path="/tools/myt" exact component={MoyatingGenerator} />
        <Route path="/tools/shizi" exact component={ZeroPlusSevenBible} />
        <Route path="/tools" exact render={() => <ToolsIndex />} />
      </Router>
    </section>
  </main>;
});

ToolsApp.propTypes = {
  ...RoutePropTypes,
};

export default ToolsApp;
