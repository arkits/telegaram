import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../store';
import { getPrettyUserName } from '../../../../utils';
import { Typography } from '@material-ui/core';

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

const ChatListing = observer(({ chat, idx }) => {
  const store = useContext(StoreContext);

  const chatSubtitle = () => {
    let lastMessageText = chat?.lastMessage?.content?.text?.text;
    if (!lastMessageText) {
      lastMessageText = chat?.lastMessage?.content?._;
    }

    let lastMessageAuthorId = chat?.lastMessage?.authorId;
    let prettyLastMessageAuthor = null;

    let lastMessageAuthor = store.users[String(lastMessageAuthorId)];
    if (lastMessageAuthor) {
      prettyLastMessageAuthor = getPrettyUserName(lastMessageAuthor);
    }

    return (
      <>
        <Typography variant="caption">
          <b>{prettyLastMessageAuthor}: </b> {lastMessageText}
        </Typography>
      </>
    );
  };

  return (
    <>
      <ListItem
        alignItems="flex-start"
        onClick={() => {
          store.setSelectedChatIdx(chat.id);
        }}
      >
        <ListItemAvatar>
          <Avatar
            alt={chat.title}
            src={chat?.minithumbnail ? `data:image/png;base64,${chat.minithumbnail}` : '/'}
          />
        </ListItemAvatar>
        <ListItemText primary={chat.title} secondary={chatSubtitle()} />
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
        .filter((v) => v?.messages?.length > 0)
        .sort((a, b) => {
          return new Date(b?.lastMessage?.createdAt) - new Date(a?.lastMessage?.createdAt);
        })
        .map((chat, idx) => {
          return <ChatListing key={chat.id} chat={chat} idx={idx} />;
        })}
    </List>
  );
});

export default GroupList;
