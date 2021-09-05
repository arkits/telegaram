import React from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import { makeStyles, createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import Layout, {
  Root,
  getHeader,
  getContent,
  getFullscreen,
  getDrawerSidebar,
  getInsetContainer,
  getInsetSidebar,
  getInsetFooter
} from '@mui-treasury/layout';
import ChatsHeader from './components/ChatsHeader';
import MessengerSearch from './components/MessengerSearch';
import ChatList from './components/ChatList';
import ChatSettings from './components/ChatSettings';
import ChatDialog from './components/ChatDialog';
import ChatBar from './components/ChatBar';
import ConversationHead from './components/ConversationHead';

const Header = getHeader(styled);
const Content = getContent(styled);
const Fullscreen = getFullscreen(styled);
const DrawerSidebar = getDrawerSidebar(styled);
const InsetSidebar = getInsetSidebar(styled);
const InsetFooter = getInsetFooter(styled);
const InsetContainer = getInsetContainer(styled);

const useStyles = makeStyles(() => ({
  header: {
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .10)'
  },
  insetBody: {
    borderLeft: '1px solid #424242',
    overflowY: 'auto',
    backgroundColor: '#111111'
  },
  edit: {
    backgroundColor: 'rgba(0,0,0,0.04)'
  }
}));

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      type: 'dark',
      primary: {
        main: 'rgb(0, 153, 255)'
      },
      background: {
        default: '#111111'
      }
    },
    typography: {
      fontFamily: 'Barlow"',
      body1: {
        fontSize: `${15 / 16}rem`
      },
      fontWeightRegular: '400'
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          'strong, b': {
            fontWeight: 'bold'
          }
        }
      }
    }
  })
);

const Messenger = () => {
  const styles = useStyles();
  const scheme = Layout();

  scheme.configureHeader((builder) => {
    builder.create('appHeader').registerConfig('xs', {
      position: 'relative',
      initialHeight: 60
    });
  });

  scheme.configureEdgeSidebar((builder) => {
    builder.create('primarySidebar', { anchor: 'left' }).registerPermanentConfig('xs', {
      width: '25%',
      collapsible: true,
      collapsedWidth: 80
    });
  });

  scheme.enableAutoCollapse('primarySidebar', 'sm');

  scheme.configureInsetSidebar((builder) => {
    builder.create('secondarySidebar', { anchor: 'right' }).registerAbsoluteConfig('sm', {
      width: '33%'
    });
  });

  return (
    <Fullscreen>
      <Root theme={theme} scheme={scheme}>
        {({ state: { sidebar } }) => (
          <>
            <CssBaseline />
            <Header className={styles.header}>
              <Toolbar disableGutters>
                <ConversationHead />
              </Toolbar>
            </Header>
            <DrawerSidebar sidebarId={'primarySidebar'}>
              {sidebar.primarySidebar.collapsed ? (
                <Box textAlign={'center'} my={1}>
                  <IconButton className={styles.edit}>
                    <Edit />
                  </IconButton>
                </Box>
              ) : (
                <div>
                  <ChatsHeader />
                  <Box p={'4px 16px 12px'}>
                    <MessengerSearch />
                  </Box>
                </div>
              )}
              <ChatList concise={sidebar.primarySidebar.collapsed} />
            </DrawerSidebar>
            <Content>
              <InsetContainer
                disableGutters
                rightSidebar={
                  <InsetSidebar
                    sidebarId={'secondarySidebar'}
                    classes={{ paper: styles.insetBody }}
                  >
                    <ChatSettings />
                  </InsetSidebar>
                }
              >
                <ChatDialog />
              </InsetContainer>
            </Content>
            <InsetFooter ContainerProps={{ disableGutters: true }}>
              <Box display={'flex'} alignItems={'center'} p={1}>
                <ChatBar concise={sidebar.primarySidebar.collapsed} />
              </Box>
            </InsetFooter>
          </>
        )}
      </Root>
    </Fullscreen>
  );
};

export default Messenger;
