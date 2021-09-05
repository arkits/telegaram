import React, { Fragment, useContext } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ChatMsg from './ChatMsg';
import { StoreContext } from '../../../store';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';

const useStyles = makeStyles(() => ({
  date: {
    fontWeight: 500,
    margin: '12px 0',
    fontSize: 12,
    textAlign: 'center'
  }
}));

const ChatDialog = observer(() => {
  const store = useContext(StoreContext);
  const styles = useStyles();

  const chat = store?.chats[store?.selectedChatIdx];

  const GenerateChatMsg = () => {
    let els = [];
    let messages = chat?.messages;
    if (!messages) {
      return null;
    }

    messages.forEach((message, idx) => {
      els.push(
        <Fragment key={idx}>
          <Typography className={styles.date}>
            {' '}
            {format(new Date(message?.createdAt), 'MM/dd/yyyy hh:mm:ss aaa')}
          </Typography>
          <ChatMsg messages={[message?.content?.text?.text || message?.content?._]} />
        </Fragment>
      );
    });

    return els
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .reverse();
  };

  return (
    <Box p={'16px 30px 12px 10px'}>
      <GenerateChatMsg />
    </Box>
  );
});

export default ChatDialog;
