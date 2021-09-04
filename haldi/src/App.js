import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

function App() {
  const theme = createTheme({
    palette: {
      type: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E'
      }
    },
    typography: {
      fontFamily: ['Barlow'].join(',')
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        <div>
          <Switch>
            <Route path="/">
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
