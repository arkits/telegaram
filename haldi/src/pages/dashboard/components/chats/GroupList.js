import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { getChats, getMessages } from '../../../../api/fetches';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../store';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    maxHeight: '94vh',
    overflow: 'auto',
    height: '100%'
  },
  inline: {
    display: 'inline'
  }
}));

const ChatListing = observer(({ chat }) => {
  const store = useContext(StoreContext);

  return (
    <>
      <ListItem
        alignItems="flex-start"
        onClick={() => {
          store.setSelectedChatIdx(chat.id);
        }}
      >
        <ListItemAvatar>
          <Avatar alt={chat.title} src="/" />
        </ListItemAvatar>
        <ListItemText primary={chat.title} secondary={chat.subtitle} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
});

const GroupList = observer(() => {
  const classes = useStyles();

  const store = useContext(StoreContext);

  return (
    <List className={classes.root}>
      {Object.values(store.chats)
        .filter((v) => v?.messages?.length > 1)
        .map((chat, idx) => {
          return <ChatListing key={chat.id} chat={chat} />;
        })}
    </List>
  );
});

export default GroupList;
