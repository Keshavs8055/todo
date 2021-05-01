import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import { taskReducer } from './tasks/tasks.reducer';
export default combineReducers({
  user: userReducer,
  tasks: taskReducer,
});
