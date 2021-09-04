import { Card, CardContent, Typography, Divider, Grid } from '@material-ui/core';
import { Fragment } from 'react';
import { formatDistance } from 'date-fns';

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
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {formatDistance(new Date(message?.createdAt), new Date(), { addSuffix: true })}{' '}
                    <br />
                    Author: {message?.authorId}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
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
