import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .40)',
    borderRadius: 40,
    width: '100%'
  },
  input: {
    boxSizing: 'border-box',
    minHeight: 36
  }
}));

const useAdornStyles = makeStyles(() => ({
  root: {
    paddingLeft: 12,
    '& svg': {
      color: 'rgba(0,0,0,0.40)'
    }
  }
}));

const MessengerSearch = () => {
  const styles = useStyles();
  const adornStyles = useAdornStyles();
  return (
    <InputBase
      classes={styles}
      startAdornment={
        <InputAdornment position={'start'} classes={adornStyles}>
          <Search style={{ color: '#ffffff' }} />
        </InputAdornment>
      }
      placeholder={'Search Telegaram'}
    />
  );
};

export default MessengerSearch;
