import React from "react";
import { connect } from "react-redux";
import {
  Typography,
  withStyles,
  makeStyles,
  List,
  CircularProgress,
} from "@material-ui/core";

import Task from "../task/task.comp";
import { getTasks } from "../../../firebase/firebase.utils";

const styles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(10),
  },
}));

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      completed: [],
      unfinished: [],
    };
  }

  async componentDidMount() {
    let docs = await getTasks(this.props.user.id);

    this.props.updateTasks(await docs);
    this.setState({ tasks: docs });
  }
  render() {
    const { classes, tasks } = this.props;
    let completedTasks;
    let n_completedTasks;

    if (tasks) {
      completedTasks = tasks.filter((el) => {
        return el.completed;
      });
      n_completedTasks = tasks.filter((el) => {
        return !el.completed;
      });
    }

    return (
      <>
        <Typography variant="h6" align="center" className={classes.title}>
          {this.props.user.displayName.replace(
            /\b[a-z]|['_][a-z]|\B[A-Z]/g,
            function (x) {
              return x[0] === "'" || x[0] === "_"
                ? x
                : String.fromCharCode(x.charCodeAt(0) ^ 32);
            }
          )}
          's Tasks
        </Typography>
        {tasks ? (
          <>
            <List>
              {n_completedTasks.map((doc) => (
                <Task
                  key={doc.id}
                  taskId={doc.id}
                  title={doc.title}
                  checked={doc.completed}
                  date={doc.dueDate}
                />
              ))}
              {completedTasks.map((doc) => (
                <Task
                  key={doc.id}
                  taskId={doc.id}
                  title={doc.title}
                  checked={doc.completed}
                  date={doc.dueDate}
                />
              ))}
            </List>
          </>
        ) : (
          <CircularProgress
            color="secondary"
            variant="determinate"
            size={20}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-60%, -50%)",
            }}
          />
        )}
      </>
    );
  }
}
const mstp = (state) => ({
  user: state.user.user,
  tasks: state.tasks.tasks,
});
const mdtp = (dispatch) => ({
  updateTasks: (data) => dispatch({ type: "UPDATE_TASKS", payload: data }),
});
export default connect(mstp, mdtp)(withStyles(styles)(Tasks));
