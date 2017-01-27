import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';

import questionsFromResponseSets from '../middleware/questions_from_response_sets';
import questionsFromForms from '../middleware/questions_from_forms';
import responseSetsFromQuestions from '../middleware/response_sets_from_questions';

import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let middleware = applyMiddleware(
    promiseMiddleware(),
    createLogger(),
    questionsFromResponseSets,
    questionsFromForms,
    responseSetsFromQuestions
  );

  let store = createStore(rootReducer, initialState, middleware);

  return store;
}
