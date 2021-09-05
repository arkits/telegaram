import { Card, CardContent, Typography, Divider, Grid } from '@material-ui/core';
import { Fragment, useContext } from 'react';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../store';

const AuthorSignature = observer(({ authorId }) => {
  const store = useContext(StoreContext);

  let author = store.users[authorId];

  return (
    <Typography style={{ paddingLeft: '15px', paddingTop: '10px' }} variant="h6">
      {author?.username || author?.firstName || author?.id}
    </Typography>
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
            <Grid container spacing={3}>
              <Grid item xs={2} style={{ backgroundColor: '#37474f' }}>
                <AuthorSignature authorId={message?.authorId} />
                <Typography variant="body2" style={{ paddingLeft: '15px', paddingBottom: '15px' }}>
                  {format(new Date(message?.createdAt), 'MM/dd/yyyy HH:mm:ss aaa')}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <pre style={{ fontFamily: 'Barlow', fontSize: '1.2em' }}>
                  {message?.content?.text?.text || message?.content?._}
                </pre>
              </Grid>
            </Grid>
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
