import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: '20px'
  }
}));

function About() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={12} sm={4}>
          <br />
          <br />
          <Typography variant="h4" style={{ fontFamily: 'Barlow', fontWeight: '700' }}>
            Telegaram
          </Typography>
          <br />
          <Typography variant="h3" style={{ fontFamily: 'Barlow' }}>
            Your Telegram Client... <br /> with Super Powers!
          </Typography>
          <br />
          <br />
          <Button variant="contained" component={RouterLink} to="/chats">
            Chats
          </Button>
          <br />
          <br />
          <Button variant="contained" component={RouterLink} to="/settings">
            Settings
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default About;
