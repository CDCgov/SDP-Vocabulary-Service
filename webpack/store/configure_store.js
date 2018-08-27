import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';

import unauthenticatedResponse from '../middleware/unauthenticated_response';

import rootReducer from '../reducers';

export function configureStore(initialState) {
  let middleware = applyMiddleware(
    promiseMiddleware(),
    createLogger(),
    unauthenticatedResponse
  );

  // Sets up http://zalmoxisus.github.io/redux-devtools-extension/
  const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let store = createStore(rootReducer, initialState, composeEnhancers(middleware));

  return store;
}

export default configureStore();
