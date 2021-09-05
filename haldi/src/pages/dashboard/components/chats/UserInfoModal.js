import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { StoreContext } from '../../../../store';
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getPrettyUserName } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

const UserInfoModal = observer(({ userId }) => {
  const store = useContext(StoreContext);
  const [open, setOpen] = useState(false);

  const user = store.users[userId];

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Avatar
        style={{ float: 'right' }}
        className={classes.large}
        alt={user?.username || user?.firstName || user?.id || 'Unknown User'}
        src="/"
        onClick={handleClickOpen}
      />

      <br />
      <br />
      <br />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{getPrettyUserName(user)}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">User ID: {user?.id}</DialogContentText>
          <pre>{JSON.stringify(user, null, 4)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default UserInfoModal;
