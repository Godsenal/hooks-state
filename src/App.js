import React, { useState } from 'react';
import { Provider } from './hooks-state';
import { Counter } from './components';
import store from './store';

const App = () => {
  const [defaultCount, setState] = useState(0);
  return (
    <Provider store={store}>
      <Counter defaultCount={defaultCount} />
      <button onClick={() => setState(defaultCount + 1)}>change Props</button>
    </Provider>
  );
};

export default App;
