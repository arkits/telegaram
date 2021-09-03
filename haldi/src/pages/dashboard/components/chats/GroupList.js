import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { getChats } from '../../../../api/fetches';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    maxHeight: '93vh',
    overflow: 'auto',
    height: '100%'
  },
  inline: {
    display: 'inline'
  }
}));

function ChatListing({ chat }) {
  const classes = useStyles();
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={chat.title} src="/" />
        </ListItemAvatar>
        <ListItemText
          primary={chat.title}
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                Sender:
              </Typography>
              {' This is a new message'}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}

function GroupList() {
  const classes = useStyles();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getChats()
      .then((res) => res.json())
      .then((resJson) => {
        setChats(resJson);
      })
      .catch((err) => {
        console.error('Caught Error', err);
      });
  }, []);

  return (
    <List className={classes.root}>
      {chats.map(function (chat, idx) {
        return <ChatListing key={idx} chat={chat} />;
      })}
    </List>
  );
}

export default GroupList;
