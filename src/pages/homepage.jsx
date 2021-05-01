import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Typography, makeStyles, Grid, Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import TaskModel from './components/taskmodel/taskmodel';
import Tasks from './components/tasks/tasks.comp';

const styles = makeStyles((theme) => ({
  typo: {
    margin: theme.spacing(3),
  },
  addButton: {
    position: 'fixed',
    top: '100%',
    left: '50%',
    transform: 'translate(-50%, -115%)',
  },
}));

const Homepage = (props) => {
  const { user } = props;
  const [open, toggleOpen] = useState(false);
  const classes = styles();

  return (
    <Grid container justify="center">
      <Grid item xs={12} lg={8}>
        {user ? (
          <>
            <Tasks />
            <Fab
              color="secondary"
              onClick={() => toggleOpen(true)}
              disableTouchRipple
              className={classes.addButton}
            >
              <Add />
            </Fab>
          </>
        ) : (
          <Typography variant="h6" align="center" className={classes.typo}>
            Sign In To View Your Tasks
          </Typography>
        )}
      </Grid>
      <TaskModel open={open} func={toggleOpen} />
    </Grid>
  );
};

const mstp = (state) => ({
  user: state.user.user,
});

export default connect(mstp)(Homepage);
