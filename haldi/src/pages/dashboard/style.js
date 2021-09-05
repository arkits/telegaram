import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%'
  },
  appBar: {
    backgroundColor: 'rgb(131,58,180)',
    backgroundImage:
      'radial-gradient( circle farthest-corner at 10% 20%,  rgba(131,58,180,1) 0%, rgba(253,29,29,1) 100% );',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  content: {
    flex: '1',
    height: '100vh',
    display: 'flex',
    paddingTop: theme.spacing(8),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  mainContent: {
    height: '100%',
    width: '100%'
  }
}));

export default useStyles;
