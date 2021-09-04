import { Grid } from '@material-ui/core';
import { useState } from 'react';
import GroupList from './GroupList';
import MessagesList from './MessagesList';

function Chats() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <>
      <Grid container>
        <Grid item xs={3}>
          <GroupList setSelectedChat={setSelectedChat} />
        </Grid>
        <Grid item xs={9} style={{ padding: '20px' }}>
          <MessagesList selectedChat={selectedChat} />
        </Grid>
      </Grid>
    </>
  );
}

export default Chats;
