import React from 'react';
import {
  TextField,
  Dialog,
  FormControl,
  DialogActions,
  makeStyles,
  Typography,
  DialogContent,
  Button,
  withStyles,
  Grid,
} from '@material-ui/core';
import { firestore, getTasks } from '../../../firebase/firebase.utils';
import { connect } from 'react-redux';

const styles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: '990px',
  },
}));

class TaskModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: '',
      dueDate: '',
    };
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  handleSubmit = (e) => {
    firestore
      .collection('users')
      .doc(this.props.user.id)
      .collection('tasks')
      .doc(`${this.props.user.id}-task-${Date.now()}`)
      .set({
        title: this.state.taskName,
        dueDate: this.state.dueDate,
        completed: false,
      })
      .then(async () => {
        let docs = await getTasks(this.props.user.id);
        this.props.updateTasks(docs);
        this.props.func(false);
        this.setState({ taskName: '', dueDate: '' });
      })
      .catch((err) => alert(err.message));
    this.props.func(false);
  };

  render() {
    const { classes, open, func } = this.props;

    return (
      <>
        <Dialog open={open} fullScreen className={classes.root}>
          <DialogContent>
            <Grid container justify="center">
              <Grid item sm={12} lg={6}>
                <Typography variant="h6">Add A New task</Typography>
                <FormControl fullWidth margin="normal">
                  <TextField
                    color="secondary"
                    label="Task Name"
                    type="text"
                    variant="outlined"
                    autoCapitalize="on"
                    autoComplete="off"
                    autoFocus
                    required
                    value={this.state.taskName}
                    onChange={this.handleChange}
                    name="taskName"
                  ></TextField>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="datetime-local"
                    label="Due Date"
                    name="dueDate"
                    type="datetime-local"
                    color="secondary"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.handleChange}
                  />
                </FormControl>
                <DialogActions>
                  <Button type="submit" onClick={this.handleSubmit}>
                    Add
                  </Button>
                  <Button onClick={() => func(false)}>Close</Button>
                </DialogActions>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

const mstp = (state) => ({
  user: state.user.user,
});
const mdtp = (d) => ({
  updateTasks: (data) => d({ type: 'UPDATE_TASKS', payload: data }),
});
export default connect(mstp, mdtp)(withStyles(styles)(TaskModel));
