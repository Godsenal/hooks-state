import { useContext, useState, useEffect, useRef } from 'react';
import StoreContext from '../Context';
import shallowEqual from './shallowEqual';

const isFunc = func => typeof func === 'function';
const usePrev = value => {
  const prevRef = useRef();
  useEffect(() => {
    prevRef.current = value;
  });
  return prevRef.current;
};
const useStore = () => useContext(StoreContext);
export const useHookState = (mapState, getStore = useStore) => {
  const store = getStore();
  const currStore = useRef();
  const currMappedState = useRef();
  const unSubscribeRef = useRef();
  const [mappedState, setMappedState] = useState(mapState(store.getState()));
  // subscribe 안에서 사용되는 mappedState는 클로져를 통해 위에있는 mappedState와 같은 값을 갖지 않음.
  // 같은 변수에 할당하는게 아니라 아예 새 변수가 생기기 때문.
  currMappedState.current = mappedState;
  currStore.current = store;
  useEffect(
    () => {
      // checkAndUpdate를 밖에 빼주고, prevMappedState 대신 mappedState를 쓰면 될 것 같지만,
      // 이 checkAndUpdate 자체도 클로져의 대상이 되므로 맨 처음 checkAndUpdate 함수만 가져옴.
      const checkAndUpdate = () => {
        const newMappedState = mapState(currStore.current.getState());
        if (!shallowEqual(currMappedState.current, newMappedState)) {
          setMappedState(newMappedState);
        }
      };
      // mapState가 바뀌면, useEffect가 재호출되니 현재 등록된 subscribe를 지운다.
      if (unSubscribeRef.current) {
        unSubscribeRef.current();
        checkAndUpdate();
      }
      unSubscribeRef.current = currStore.current.subscribe(() => {
        checkAndUpdate();
      });
      return unSubscribeRef.current;
    },
    [store, mapState],
  );
  return mappedState;
};

export const useHookDispatch = (mapDispatch = null, getStore = useStore) => {
  const { dispatch } = getStore();
  if (mapDispatch) {
    return {
      ...mapDispatch(dispatch),
    };
  }
  return { dispatch };
};

export const useConnect = (mapState, mapDispatch) => {
  const store = useContext(StoreContext);
  const getStore = () => {
    return store;
  };
  return {
    ...useHookState(mapState, getStore),
    ...useHookDispatch(mapDispatch, getStore),
  };
};
