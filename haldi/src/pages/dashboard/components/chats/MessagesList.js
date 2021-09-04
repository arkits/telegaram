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
          <br /> <br />
        </div>
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
