import React, { useCallback } from 'react';
import { useConnect } from '../hooks-state/hooks';

const actions = {
  increase: () => ({ type: 'INCREASE' }),
  decrease: () => ({ type: 'DECREASE' }),
  asyncIncrease: () => async dispatch => {
    await new Promise(res => setTimeout(res, 1000));
    dispatch(actions.increase());
  },
};

const mapDispatch = dispatch => ({
  increase: () => dispatch(actions.increase()),
  decrease: () => dispatch(actions.decrease()),
  asyncIncrease: () => dispatch(actions.asyncIncrease()),
});
const Counter = ({ defaultCount }) => {
  const mapState = useCallback(
    state => ({ count: state.count + defaultCount }),
    [defaultCount],
  );
  const { count, increase, decrease, asyncIncrease } = useConnect(
    mapState,
    mapDispatch,
  );
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
      <button onClick={asyncIncrease}>+1 after 1 seconds</button>
    </div>
  );
};

export default Counter;
