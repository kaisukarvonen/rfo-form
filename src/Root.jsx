import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import App from './components/App';
import fields from './dux/fields';
import rootSaga from './dux/rootSaga';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  fields,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

const Root = () => (
  <div>
    <Provider store={store}>
      <App />
    </Provider>
  </div>
);
export default Root;
