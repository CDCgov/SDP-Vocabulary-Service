import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';

import questionsFromResponseSets from '../middleware/questions_from_response_sets';
import questionsFromForms from '../middleware/questions_from_forms';

import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let middleware = applyMiddleware(
    promiseMiddleware(),
    createLogger(),
    questionsFromResponseSets,
    questionsFromForms
  );

  let store = createStore(rootReducer, initialState, middleware);

  return store;
}
