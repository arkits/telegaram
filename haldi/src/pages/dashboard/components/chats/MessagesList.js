import { Typography, Grid } from '@material-ui/core';
import { Fragment, useContext } from 'react';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../store';
import './style.css';
import UserInfoModal from './UserInfoModal';
import { getPrettyUserName } from '../../../../utils';

const AuthorSignature = observer(({ authorId }) => {
  const store = useContext(StoreContext);

  let author = store.users[authorId];

  return (
    <div>
      <UserInfoModal userId={authorId} />
      <Typography
        style={{ paddingLeft: '15px', float: 'right', fontWeight: 'bold' }}
        variant="body1"
      >
        {getPrettyUserName(author)}
      </Typography>
    </div>
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
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <AuthorSignature authorId={message?.authorId} />
            </Grid>
            <Grid item xs={10}>
              <div className="talk-bubble tri-right left-top">
                <pre
                  style={{ fontFamily: 'Barlow', fontSize: '1.2em', padding: '0px 20px 0px 20px' }}
                >
                  {message?.content?.text?.text || message?.content?._}
                </pre>
                <Typography
                  variant="overline"
                  style={{
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    paddingBottom: '5px',
                    fontStyle: 'italic',
                    color: '#78909c'
                  }}
                >
                  {format(new Date(message?.createdAt), 'MM/dd/yyyy hh:mm:ss aaa')}
                </Typography>
              </div>
            </Grid>
          </Grid>
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
