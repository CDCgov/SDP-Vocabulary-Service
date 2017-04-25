import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';

import questionsFromResponseSets from '../middleware/questions_from_response_sets';
import questionsFromForms from '../middleware/questions_from_forms';
import responseSetsFromQuestions from '../middleware/response_sets_from_questions';
import parentFromResponseSets from '../middleware/parent_from_response_sets';
import parentFromQuestions from '../middleware/parent_from_questions';
import parentFromForms from '../middleware/parent_from_forms';
import responseTypesFromQuestions from '../middleware/response_types_from_questions';
import questionTypesFromQuestions from '../middleware/question_types_from_questions';
import unauthenticatedResponse from '../middleware/unauthenticated_response';

import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let middleware = applyMiddleware(
    promiseMiddleware(),
    createLogger(),
    unauthenticatedResponse,
    questionsFromResponseSets,
    questionsFromForms,
    responseSetsFromQuestions,
    parentFromResponseSets,
    parentFromQuestions,
    parentFromForms,
    responseTypesFromQuestions,
    questionTypesFromQuestions
  );

  // Sets up http://zalmoxisus.github.io/redux-devtools-extension/
  const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let store = createStore(rootReducer, initialState, composeEnhancers(middleware));

  return store;
}
