import { useEffect, useContext } from 'react';
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

function ChatListing({ chat, setSelectedChat }) {
  return (
    <>
      <ListItem
        alignItems="flex-start"
        onClick={() => {
          setSelectedChat(chat);
        }}
      >
        <ListItemAvatar>
          <Avatar alt={chat.title} src="/" />
        </ListItemAvatar>
        <ListItemText primary={chat.title} secondary={chat?.lastMessage} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}

const GroupList = observer(({ setSelectedChat }) => {
  const classes = useStyles();

  const store = useContext(StoreContext);

  useEffect(() => {
    getChats()
      .then((res) => res.json())
      .then((resJson) => {
        resJson.forEach((chat) => {
          store.addChat(chat);

          getMessages(chat.id)
            .then((res) => res.json())
            .then((resJson) => {
              let lastMessage = resJson?.[0];
              if (!lastMessage) {
                return;
              }

              let lastMessageText = lastMessage?.content?.text?.text;
              if (!lastMessageText) {
                lastMessageText = lastMessage?.content?._;
              }

              let chatToUpdate = chat;
              chatToUpdate['lastMessage'] = lastMessageText;
              chatToUpdate['messages'] = resJson;

              store.addChat(chatToUpdate);
            });
        });
      });
  }, []);

  return (
    <List className={classes.root}>
      {Object.values(store.chats).map(function (chat, idx) {
        return <ChatListing key={idx} chat={chat} setSelectedChat={setSelectedChat} />;
      })}
    </List>
  );
});

export default GroupList;
