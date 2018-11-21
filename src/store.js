const initialState = {
  count: 0,
  other: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREASE':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREASE':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
};

const thunk = state => next => action => {
  if (typeof action === 'function') {
    return action(next);
  }
  return next(action);
};

const logger = state => next => action => {
  console.log(`dispatching ${action}`);
  let result = next(action);
  console.log(`currentState ${state}`);
  return result;
};

const middlewares = [thunk, logger];

export default { initialState, reducer, middlewares };
