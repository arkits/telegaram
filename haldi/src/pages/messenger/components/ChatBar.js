import React, { useContext, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import InputBase from '@material-ui/core/InputBase';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../store';
import { Image, AddCircle, ThumbUp } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  icon: {
    color: 'rgb(0, 153, 255)',
    width: 44,
    height: 44,
    padding: 6,
    '&:not(:first-child)': {
      marginLeft: 4
    }
  },
  input: {
    flex: 'auto',
    borderRadius: 40,
    paddingLeft: 16,
    margin: '0 8px',
    height: 36,
    fontSize: 13,
    backgroundColor: '#212121'
  }
}));

const ChatBar = observer(({ concise }) => {
  const store = useContext(StoreContext);
  const [textFieldValue, setTextFieldValue] = useState('');

  const emitSendMessage = () => {
    store.socket.emit('req_sendMessage', {
      text: textFieldValue,
      chatId: store.selectedChatIdx
    });
    setTextFieldValue('');
  };

  const styles = useStyles();
  return (
    <>
      <AddCircle className={styles.icon} />
      {!concise && (
        <>
          <Image className={styles.icon} />
        </>
      )}
      <InputBase
        className={styles.input}
        placeholder={'Namaskar Mandali...'}
        value={textFieldValue}
        onChange={(e) => setTextFieldValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            emitSendMessage();
          }
        }}
      />
      <ThumbUp className={styles.icon} />
    </>
  );
});

export default ChatBar;
