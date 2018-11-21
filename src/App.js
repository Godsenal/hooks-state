import React from 'react';
import { Provider } from './hooks-state';
import { Counter } from './components';
import store from './store';

const App = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);

export default App;
