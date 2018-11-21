const createStore = (initialState, reducer) => {
  let currState = initialState;
  let currReducer = reducer;
  let currListeners = [];

  function dispatch(action) {
    if (typeof action === 'function') {
      return action(dispatch);
    }
    currState = currReducer(currState, action);
    currListeners.forEach(listener => listener());
  }
  function getState() {
    return currState;
  }
  function subscribe(listener) {
    currListeners.push(listener);
    return function unsubscribe() {
      currListeners = currListeners.filter(
        currListener => listener !== currListener,
      );
    };
  }
  return {
    dispatch,
    getState,
    subscribe,
  };
};

export default createStore;
