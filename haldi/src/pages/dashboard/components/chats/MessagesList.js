import { Card, CardContent, Typography } from '@material-ui/core';
import { Fragment } from 'react';
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
              <Typography variant="body2">{message?.createdAt}</Typography>
              <Typography variant="body2">Type: {message?.content?._}</Typography>
              <hr />
              <Typography variant="body1">{message?.content?.text?.text}</Typography>
            </CardContent>
          </Card>
          <br /> <br />
        </Fragment>
      );
    });

    return els;
  };

  return (
    <>
      <RenderMessages />
    </>
  );
}

export default MessagesList;
