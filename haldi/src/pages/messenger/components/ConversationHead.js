import React, { useContext } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import Info from '@material-ui/icons/Info';
import { StoreContext } from '../../../store';
import { observer } from 'mobx-react-lite';
import { getChatAvatarSrc } from '../../../utils';

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
        <Avatar alt={chat?.title} src={getChatAvatarSrc(chat)}>
          {chat?.title?.slice(0, 3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={chat?.title}
        secondary={chat?.id}
        classes={{ primary: styles.primary, secondary: styles.secondary }}
      />
      <ListItemSecondaryAction>
        <IconButton className={styles.iconBtn}>
          <StarIcon />
        </IconButton>
        <IconButton className={styles.iconBtn}>
          <Info />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
});

export default ConversationHead;
