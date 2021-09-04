import { Card, CardContent, Typography } from '@material-ui/core';
function MessagesList({ selectedChat }) {
  const RenderMessages = () => {
    let messages = selectedChat?.messages;
    if (!messages) {
      return null;
    }

    let els = [];

    messages.forEach((element, idx) => {
      els.push(
        <div key={idx}>
          {JSON.stringify(element)}
          <br />  <br />
        </div>
      );
    });

    return els;
  };

  return (
    <>
      <Card
        style={{
          height: '90vh',
          maxHeight: '90vh',
          width: '100%',
          maxWidth: '75vw',
          overflow: 'scroll'
        }}
      >
        <CardContent>
          <Typography variant="h4" style={{ fontFamily: 'Barlow', fontWeight: '700' }}>
            {selectedChat?.title}
          </Typography>
          <RenderMessages />
        </CardContent>
      </Card>
    </>
  );
}

export default MessagesList;
