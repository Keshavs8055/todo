const INITIAL_STATE = {
  tasks: null,
};

export const taskReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};
