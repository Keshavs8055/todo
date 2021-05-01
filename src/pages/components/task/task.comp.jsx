import React from 'react';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { firestore } from '../../../firebase/firebase.utils';
import { getTasks } from '../../../firebase/firebase.utils';
import { connect } from 'react-redux';

const styles = makeStyles((theme) => ({
  itemText: {
    textTransform: 'capitalize',
    background: 'red',
  },
  checked: {
    textDecoration: 'underline',
  },
}));

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked,
      d_updating: false,
      t_updating: false,
    };
  }
  handleChange = (e) => {
    this.setState(
      (s) => ({ checked: !s.checked }),
      () => {
        firestore
          .collection('users')
          .doc(this.props.user.id)
          .collection('tasks')
          .doc(this.props.taskId)
          .update({
            completed: this.state.checked,
          })
          .then(async () => {
            this.setState({ t_updating: true });
            let docs = await getTasks(this.props.user.id);
            this.props.updateTasks(docs);
          })
          .then(this.setState({ t_updating: false }));
      }
    );
  };
  handleDelete = () => {
    this.setState({ d_updating: true });
    firestore
      .collection('users')
      .doc(this.props.user.id)
      .collection('tasks')
      .doc(this.props.taskId)
      .delete()
      .then(async () => {
        let docs = await getTasks(this.props.user.id);

        this.props.updateTasks(docs);
      });
  };
  render() {
    return (
      <>
        <ListItem divider>
          <ListItemIcon>
            {this.state.t_updating ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              <Checkbox
                onChange={this.handleChange}
                edge="start"
                tabIndex={-1}
                disableRipple
                checked={this.state.checked}
              />
            )}
          </ListItemIcon>
          <ListItemText
            primary={`${this.props.title}`}
            secondary={
              this.props.date
                ? `Due on ${this.props.date.replace('T', ' at ')}`
                : null
            }
          />
          <ListItemSecondaryAction>
            {this.state.d_updating ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              <IconButton
                onClick={this.handleDelete}
                edge="end"
                aria-label="comments"
              >
                <Delete />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      </>
    );
  }
}

const mstp = (s) => ({
  user: s.user.user,
  tasks: s.tasks.tasks,
});
const mdtp = (dispatch) => ({
  updateTasks: (data) => dispatch({ type: 'UPDATE_TASKS', payload: data }),
});
export default connect(mstp, mdtp)(withStyles(styles)(Task));
