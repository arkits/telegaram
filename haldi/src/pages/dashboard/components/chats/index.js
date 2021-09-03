import { Grid } from '@material-ui/core';
import GroupList from './GroupList';

function Chats() {
  return (
    <>
      <Grid container>
        <Grid item xs={3}>
          <GroupList />
        </Grid>
        <Grid item xs={9}>
          <h1>Chat messages will be here</h1>
        </Grid>
      </Grid>
    </>
  );
}

export default Chats;
