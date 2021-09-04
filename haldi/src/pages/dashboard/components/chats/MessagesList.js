import { Card, CardContent, Typography, Divider } from '@material-ui/core';
import { Fragment } from 'react';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

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
          <Card style={{ backgroundColor: '#263238' }}>
            <CardContent>
              <Typography variant="body2">
                {formatDistance(new Date(message?.createdAt), new Date(), { addSuffix: true })} |
                Type: {message?.content?._}
              </Typography>
              <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
              <Typography variant="body1">{message?.content?.text?.text}</Typography>
            </CardContent>
          </Card>
          <br /> <br />
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
