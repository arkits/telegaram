import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SioClient from './api/sio';
import Messenger from './pages/messenger';
import { CssBaseline } from '@material-ui/core';

function App() {
  return (
    <>
      <CssBaseline />
      <SioClient />
      <Router>
        <div>
          <Switch>
            <Route path="/">
              <Messenger />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
