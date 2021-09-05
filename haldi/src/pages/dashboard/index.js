import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core/';
import useStyles from './style';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import About from './components/About';
import AppDrawer from './components/AppDrawer';
import Settings from './components/Settings';
import Chats from './components/chats';
import { StoreContext } from '../../store';
import { observer } from 'mobx-react-lite';

const Dashboard = observer(() => {
  const classes = useStyles();
  const store = useContext(StoreContext);

  return (
    <div className={classes.root}>
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
            <Button variant="outlined" style={{ fontWeight: '700', marginRight: '10px' }}>
              TDLIB: {store.tdlibConnectionState}
            </Button>

            <Button variant="outlined" style={{ fontWeight: '700' }}>
              SIO: {store.sioConnected ? 'connected' : 'disconnected'}
            </Button>
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
});

export default Dashboard;
