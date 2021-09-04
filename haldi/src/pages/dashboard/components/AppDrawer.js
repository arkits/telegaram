import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import IconButton from '@material-ui/core/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import { StoreContext } from '../../../store';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles({
  drawer: {
    width: 250
  }
});

const AppDrawer = observer(() => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(false);

  const store = useContext(StoreContext);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <div>
      <React.Fragment>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          edge="start"
          style={{ color: 'white' }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
          <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <div className={classes.drawer}></div>
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '100vh',
                flexDirection: 'column'
              }}
            >
              <div style={{ flexGrow: '1' }}>
                <center>
                  <Typography
                    variant="h4"
                    style={{
                      fontFamily: 'Barlow',
                      fontWeight: 'bold',
                      marginTop: '20px',
                      marginBottom: '20px'
                    }}
                  >
                    Telegaram
                  </Typography>
                </center>
                <Divider />
                <List>
                  <ListItem button component={RouterLink} to="/">
                    <ListItemIcon>
                      <DashboardRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Dashboard'} />
                  </ListItem>
                  <ListItem button component={RouterLink} to="/chats">
                    <ListItemIcon>
                      <TimelineRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Chats'} />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem button component={RouterLink} to="/settings">
                    <ListItemIcon>
                      <SettingsRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Settings'} />
                  </ListItem>
                </List>
                <Divider />
              </div>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    </div>
  );
});

export default AppDrawer;
