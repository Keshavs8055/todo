import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Grid,
} from '@material-ui/core';
import LoginBtn from './login/loginBtncomp';
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/user/user.action';

import { auth } from '../../firebase/firebase.utils';

const styles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 'lighter',
  },
  name: {
    fontSize: theme.spacing(2),
  },
}));

const Header = ({ user, logoutUser }) => {
  const classes = styles();

  return (
    <Grid container justify="center">
      <Grid item xs={12} lg={8}>
        <AppBar className={classes.root} color="secondary" position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h5">
              ToDo <span className={classes.name}>By Keshav</span>
            </Typography>
            {user ? (
              <Button
                onClick={() => {
                  auth.signOut();
                  logoutUser(null);
                }}
              >
                Sign-Out
              </Button>
            ) : (
              <>
                <LoginBtn />
              </>
            )}
          </Toolbar>
        </AppBar>
      </Grid>
    </Grid>
  );
};
const mstp = (state) => ({
  user: state.user.user,
});
const mdtp = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(mstp, mdtp)(Header);
