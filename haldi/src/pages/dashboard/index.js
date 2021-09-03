import React from 'react';
import { CssBaseline, AppBar, Toolbar, Typography } from '@material-ui/core/';
import useStyles from './style';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import About from './components/About';
import AppDrawer from './components/AppDrawer';
import Settings from './components/Settings';
import Chats from './components/chats';

function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <AppDrawer />
            <Typography
              variant="h5"
              noWrap
              style={{
                display: 'flex',
                flexGrow: '1',
                fontFamily: 'Barlow',
                fontWeight: 'bold'
              }}
            >
              Telegaram
            </Typography>
            <Typography variant="h6" noWrap></Typography>
          </Toolbar>
        </AppBar>

        <main className={classes.content}>
          <div className={classes.mainContent}>
            <Switch>
              <Route path="/chats">
                <Chats />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/">
                <About />
              </Route>
            </Switch>
          </div>
        </main>
      </Router>
    </div>
  );
}

export default Dashboard;
