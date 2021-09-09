import React, { useContext } from 'react';
import cx from 'clsx';
import makeStyles from '@material-ui/styles/makeStyles';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import { grey } from '@material-ui/core/colors';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../store';
import { getChatAvatarSrc } from '../../../utils';

const useStyles = makeStyles(({ palette }) => ({
  root: ({ active }) => ({
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
    ...(active && {
      backgroundColor: 'rgba(0, 0, 0, .40)'
    })
  }),
  rootHover: {
    '&:hover': {
      backgroundColor: grey[900],
      '& $dot': {
        display: 'none'
      },
      '& $responded': {
        display: 'none'
      },
      '& $more': {
        visibility: 'visible'
      }
    }
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 12
  },
  primary: ({ bold }) => ({
    ...(bold && { fontWeight: 'bold' })
  }),
  secondary: ({ bold }) => ({
    fontSize: 13,
    color: '#999',
    ...(bold && { fontWeight: 'bold', color: palette.text.primary })
  }),
  float: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#09f',
    borderRadius: '50%'
  },
  more: {
    visibility: 'hidden',
    fontSize: 20
  },
  responded: {
    width: 16,
    height: 16
  }
}));

const ChatListItem = observer(({ chat, concise }) => {
  const store = useContext(StoreContext);
  const styles = useStyles({
    bold: chat?.bold
  });

  return (
    <Box px={1}>
      <ListItem
        className={cx(styles.root, styles.rootHover)}
        onClick={() => {
          store.setSelectedChatIdx(chat?.id);
          store.socket.emit('req_chatRefresh', {
            chatId: chat?.id
          });
        }}
      >
        <Avatar alt={chat.title} src={getChatAvatarSrc(chat)} className={styles.avatar} />
        {!concise && (
          <>
            <ListItemText
              primary={chat?.title}
              secondary={chat?.subtitle}
              primaryTypographyProps={{ noWrap: true }}
              secondaryTypographyProps={{ noWrap: true }}
              classes={{ primary: styles.primary, secondary: styles.secondary }}
            />
            <Box position={'relative'}>
              <MoreHoriz className={styles.more} />
              {chat?.bold && <div className={cx(styles.float, styles.dot)} />}
              {chat?.responded && (
                <Avatar
                  className={cx(styles.float, styles.responded)}
                  src={getChatAvatarSrc(chat)}
                />
              )}
            </Box>
          </>
        )}
      </ListItem>
    </Box>
  );
});

export default ChatListItem;
