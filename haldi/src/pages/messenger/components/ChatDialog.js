import React, { Fragment, useContext } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ChatMsg from './ChatMsg';
import { StoreContext } from '../../../store';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { getPrettyUserName } from '../../../utils';

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

  const createNewTransformedMessage = (message) => {
    let side = 'left';
    if (parseInt(message?.authorId) === parseInt(store?.me?.id)) {
      side = 'right';
    }

    return {
      startDate: message?.createdAt,
      authorId: message?.authorId,
      side: side,
      authorName: getPrettyUserName(store?.users[message?.authorId]),
      messages: [message?.content?.text?.text || message?.content?._]
    };
  };

  const GenerateChatMsgs = () => {
    // fast fail if no messages in Chat
    let messages = chat?.messages;
    if (!messages) {
      return null;
    }

    let generatedChatMsgs = [];
    let transformedMessages = [];

    let i = 0;

    while (i < messages.length) {
      let currentMessage = messages[i];

      if (transformedMessages.length === 0) {
        transformedMessages.push(createNewTransformedMessage(currentMessage));
      } else {
        let lastTransformedMessage = transformedMessages[transformedMessages.length - 1];

        if (lastTransformedMessage?.authorId === currentMessage?.authorId) {
          lastTransformedMessage.messages = []
            .concat([currentMessage?.content?.text?.text || currentMessage?.content?._])
            .concat(lastTransformedMessage.messages);
        } else {
          transformedMessages.push(createNewTransformedMessage(currentMessage));
        }
      }

      i++;
    }

    transformedMessages.forEach((transformedMessage, idx) => {
      generatedChatMsgs.push(
        <Fragment key={idx}>
          <Typography className={styles.date}>
            {' '}
            {format(new Date(transformedMessage?.startDate), 'MM/dd/yyyy hh:mm:ss aaa')}
          </Typography>
          <ChatMsg
            messages={transformedMessage?.messages}
            avatarAlt={transformedMessage?.authorName}
            avatarSrc={'/'}
            side={transformedMessage?.side}
          />
        </Fragment>
      );
    });

    return generatedChatMsgs
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .reverse();
  };

  return <Box p={'16px 30px 12px 10px'}>{GenerateChatMsgs()}</Box>;
});

export default ChatDialog;
