import AddIcon from '@material-ui/icons/Add';
import { TextField, Card, CardContent, Fab } from '@material-ui/core';
import { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../store';

const Composer = observer(() => {
  const store = useContext(StoreContext);
  const [textFieldValue, setTextFieldValue] = useState('');
  return (
    <Card
      elevation={0}
      style={{
        backgroundColor: '#111111',
        width: '80%',
        margin: 'auto'
      }}
    >
      <CardContent style={{ display: 'flex' }}>
        <TextField
          id="outlined-basic"
          label="Namaskar Mandali"
          variant="outlined"
          style={{ flexGrow: '1', marginRight: '15px' }}
          value={textFieldValue}
          onChange={(e) => setTextFieldValue(e.target.value)}
        />

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            store.socket.emit('req_sendMessage', {
              text: textFieldValue,
              chatId: store.selectedChatIdx
            });
            setTextFieldValue('');
          }}
        >
          <AddIcon />
        </Fab>
        <br />
      </CardContent>
    </Card>
  );
});

export default Composer;
