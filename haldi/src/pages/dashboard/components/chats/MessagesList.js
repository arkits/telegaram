import { Card, CardContent, Typography, Divider, Grid } from '@material-ui/core';
import { Fragment, useContext } from 'react';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../store';

const AuthorSignature = observer(({ authorId }) => {
  const store = useContext(StoreContext);

  let author = store.users[authorId];

  return (
    <Typography variant="h5">{author?.username || author?.firstName || author?.id}</Typography>
  );
});

function MessagesList({ selectedChat }) {
  const RenderMessages = () => {
    let messages = selectedChat?.messages;
    if (!messages) {
      return null;
    }

    let els = [];

    messages.forEach((message, idx) => {
      els.push(
        <Fragment key={idx}>
          <Card elevation={5} style={{ backgroundColor: '#263238', marginBottom: '5px' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={2}>
                  <AuthorSignature authorId={message?.authorId} />
                  <Typography variant="body2">
                    {format(new Date(message?.createdAt), 'MM/dd/yyyy HH:mm:ss aaa')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body1">
                    {message?.content?.text?.text || message?.content?._}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fragment>
      );
    });

    return els.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  return (
    <div style={{ maxHeight: '60vh', overflow: 'scroll' }}>
      <RenderMessages />
    </div>
  );
}

export default MessagesList;
