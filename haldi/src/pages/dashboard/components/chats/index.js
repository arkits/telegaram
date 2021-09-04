import {
  Grid,
  AppBar,
  Tabs,
  TabsPanel,
  Box,
  Typography,
  Tab,
  Card,
  CardContent
} from '@material-ui/core';
import { useContext, useState } from 'react';
import React from 'react';
import GroupList from './GroupList';
import MessagesList from './MessagesList';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../../store';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const Chats = observer(() => {
  const store = useContext(StoreContext);

  let selectedChat = store.chats[store.selectedChatIdx];

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={3}>
          <GroupList />
        </Grid>
        <Grid item xs={9} style={{ padding: '20px' }}>
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
              <Typography
                variant="h4"
                style={{ fontFamily: 'Barlow', fontWeight: '700', paddingBottom: '20px' }}
              >
                {selectedChat?.title}
              </Typography>
            </CardContent>

            <AppBar position="static" style={{ margin: '0px' }}>
              <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Messages" {...a11yProps(0)} />
                <Tab label="Details" {...a11yProps(1)} />
              </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
              <MessagesList selectedChat={selectedChat} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <pre>{JSON.stringify(selectedChat, null, 4)}</pre>
            </TabPanel>

            <Card style={{ backgroundColor: '#b22a00' }}>
              <CardContent>Actions</CardContent>
            </Card>
          </Card>
        </Grid>
      </Grid>
    </>
  );
});

export default Chats;
