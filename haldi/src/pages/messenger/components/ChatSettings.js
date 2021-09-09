import React, { useContext } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../store';
import { getChatAvatarSrc } from '../../../utils';

const useStyles = makeStyles(() => ({
  avatar: {
    width: 100,
    height: 100,
    margin: 'auto',
    marginTop: '30px'
  },
  name: {
    marginTop: 14,
    fontSize: 22,
    paddingBottom: '20px',
    fontWeight: 'bold'
  },
  settingHeader: {
    '&:hover': {
      backgroundColor: '#000000'
    }
  },
  settingHead: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 13,
    '& + *': {
      fontSize: 28
    }
  },
  settingLabel: {
    fontSize: 13
  },
  settingIcon: {
    padding: 6,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.04)',
    width: 32,
    height: 32
  },
  blue: {
    color: 'rgb(0, 153, 255)',
    background: 'none'
  }
}));

const SettingHeader = ({ children, opened }) => {
  const styles = useStyles();
  return (
    <Box
      p={'14px'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      className={styles.settingHeader}
    >
      <Typography className={styles.settingHead}>{children}</Typography>
      {opened ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
    </Box>
  );
};

const DetailListing = ({ label, value }) => {
  return (
    <Box
      height={'44px'}
      pl={'14px'}
      pr={'12px'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Typography variant={'body2'}>{label}</Typography>
      <Typography variant={'body2'}>{value}</Typography>
    </Box>
  );
};

const ChatSettings = observer(() => {
  const store = useContext(StoreContext);
  const chat = store?.chats[store?.selectedChatIdx];
  const styles = useStyles();
  return (
    <div>
      <Box p={'0px 0px 0px 34px'} textAlign={'center'}>
        <Avatar
          className={styles.avatar}
          alt={chat?.title}
          src={getChatAvatarSrc(chat)}
          src={getChatAvatarSrc(chat)}
        />
        <Typography className={styles.name} variant={'h1'} align={'center'}>
          {chat?.title}
        </Typography>
        <Divider />
        <SettingHeader opened>Details</SettingHeader>
        <Box pb={2}>
          <DetailListing label={'Type'} value={chat?.type} />
          <DetailListing label={'Member Count'} value={chat?.memberCount} />
          <DetailListing label={'Time Last Active'} value={chat?.timeLastActive} />{' '}
          <DetailListing label={'Mesages'} value={chat?.messages?.length} />{' '}
          <DetailListing label={'Last Message Received'} value={chat?.lastMessage?.createdAt} />{' '}
        </Box>
        <Divider />
        <SettingHeader>Options</SettingHeader>
        <Divider />
        <SettingHeader>Members</SettingHeader>
        <Divider />
      </Box>
    </div>
  );
});

export default ChatSettings;
