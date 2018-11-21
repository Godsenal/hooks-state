import { useContext } from 'react';
import { DispatchContext, StateContext } from '../Context';

const isFunc = func => typeof func === 'function';

export const useHookState = (mapState = null) => {
  const state = useContext(mapState ? StateContext : {});
  if (isFunc(mapState)) {
    return {
      ...mapState(state),
    };
  }
  return { state };
};

export const useHookDispatch = (mapDispatch = null) => {
  const dispatch = useContext(DispatchContext);
  if (mapDispatch) {
    return {
      ...mapDispatch(dispatch),
    };
  }
  return { dispatch };
};

export const useConnect = (
  mapStateToProps = null,
  mapDispatchToProps = null,
) => {
  return {
    ...useHookState(mapStateToProps),
    ...useHookDispatch(mapDispatchToProps),
  };
};
