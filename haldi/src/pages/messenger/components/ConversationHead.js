import React, { useContext } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Phone from '@material-ui/icons/Phone';
import Videocam from '@material-ui/icons/Videocam';
import Info from '@material-ui/icons/Info';
import { StoreContext } from '../../../store';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%'
  },
  root: {
    padding: '8px 8px 8px 16px'
  },
  primary: {
    fontWeight: 'bold'
  },
  secondary: {
    fontSize: 12
  },
  iconBtn: {
    '& svg': {
      color: 'rgb(0, 153, 255)'
    }
  }
}));

const ConversationHead = observer(() => {
  const store = useContext(StoreContext);

  let chat = store?.chats[store?.selectedChatIdx];

  const styles = useStyles();
  return (
    <ListItem
      ContainerComponent={'div'}
      ContainerProps={{ className: styles.container }}
      className={styles.root}
    >
      <ListItemAvatar>
        <Avatar
          alt={chat?.title}
          src={chat?.minithumbnail ? `data:image/jpg;base64,${chat?.minithumbnail}` : '/'}
        />
      </ListItemAvatar>
      <ListItemText
        primary={chat?.title}
        secondary={chat?.id}
        classes={{ primary: styles.primary, secondary: styles.secondary }}
      />
      <ListItemSecondaryAction>
        <IconButton className={styles.iconBtn}>
          <Phone />
        </IconButton>
        <IconButton className={styles.iconBtn}>
          <Videocam />
        </IconButton>
        <IconButton className={styles.iconBtn}>
          <Info />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
});

export default ConversationHead;
