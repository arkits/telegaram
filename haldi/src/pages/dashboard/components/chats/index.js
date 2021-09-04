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
import { useState } from 'react';
import React from 'react';
import GroupList from './GroupList';
import MessagesList from './MessagesList';

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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function Chats() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={3}>
          <GroupList setSelectedChat={setSelectedChat} />
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
                <Tab label="Item Three" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <MessagesList selectedChat={selectedChat} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <pre>{JSON.stringify(selectedChat, null, 4)}</pre>
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Chats;
