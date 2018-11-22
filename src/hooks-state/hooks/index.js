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
  const [prevStore, setPrevStore] = useState(store);
  // 함수를 저장할 경우, useState는 lazy initial state로 생각하여 그 함수의 반환 값을 저장한다.
  // 이를 막기 위해 mapState의 initialState를 함수로 준다.
  const [prevMapState, setPrevMapState] = useState(() => mapState);
  // subscribe 안에서 사용되는 mappedState는 클로져를 통해 위에있는 mappedState와 같은 값을 갖지 않음.
  // 같은 변수에 할당하는게 아니라 아예 새 변수가 생기기 때문.
  currMappedState.current = mappedState;
  currStore.current = store;
  // store나 mapState가 바뀌었을 경우, useEffect로 가기전에 setState 호출을 해준다.
  if (prevStore !== store || prevMapState !== mapState) {
    setMappedState(mapState(store.getState()));
    setPrevStore(store);
    // mapState는 함수이기 때문에, 바로 주면 prevState를 받아오는 함수로 생각한다.
    // 이를 막기위해 여기서도 함수로 준다.
    setPrevMapState(() => mapState);
  }
  useEffect(
    () => {
      // mapState가 바뀌면, useEffect가 재호출되니 현재 등록된 subscribe를 지운다.
      if (unSubscribeRef.current) {
        unSubscribeRef.current();
      }
      unSubscribeRef.current = currStore.current.subscribe(() => {
        const newMappedState = mapState(currStore.current.getState());
        if (!shallowEqual(currMappedState.current, newMappedState)) {
          setMappedState(newMappedState);
        }
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
