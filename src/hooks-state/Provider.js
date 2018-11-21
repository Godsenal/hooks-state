import React, { useMemo, useReducer } from 'react';
import { DispatchContext, StateContext } from './Context';

const Provider = ({ children, store }) => {
  const { initialState, reducer, middlewares } = store;
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchWithMiddlewares = useMemo(() => {
    let tempDispatch = dispatch;
    middlewares.forEach(
      middleware => (tempDispatch = middleware(state)(tempDispatch)),
    );
    return tempDispatch;
  }, middlewares);
  console.log(dispatchWithMiddlewares);
  return (
    <DispatchContext.Provider value={dispatchWithMiddlewares}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export default Provider;
