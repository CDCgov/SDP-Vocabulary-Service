import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';

import questionsFromResponseSets from '../middleware/questions_from_response_sets';
import questionsFromSearchResult from '../middleware/questions_from_search_result';
import questionsFromForms from '../middleware/questions_from_forms';
import responseSetsFromQuestions from '../middleware/response_sets_from_questions';
import responseSetsFromForms from '../middleware/response_sets_from_forms';
import parentFromResponseSets from '../middleware/parent_from_response_sets';
import parentFromQuestions from '../middleware/parent_from_questions';
import parentFromForms from '../middleware/parent_from_forms';
import parentFromSurveys from '../middleware/parent_from_surveys';
import responseTypesFromQuestions from '../middleware/response_types_from_questions';
import questionTypesFromQuestions from '../middleware/question_types_from_questions';
import unauthenticatedResponse from '../middleware/unauthenticated_response';
import responseSetsFromSearch from '../middleware/response_set_from_search';

import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let middleware = applyMiddleware(
    promiseMiddleware(),
    createLogger(),
    unauthenticatedResponse,
    questionsFromResponseSets,
    questionsFromForms,
    questionsFromSearchResult,
    responseSetsFromQuestions,
    parentFromResponseSets,
    parentFromQuestions,
    parentFromForms,
    parentFromSurveys,
    responseTypesFromQuestions,
    questionTypesFromQuestions,
    responseSetsFromForms,
    responseSetsFromSearch
  );

  // Sets up http://zalmoxisus.github.io/redux-devtools-extension/
  const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let store = createStore(rootReducer, initialState, composeEnhancers(middleware));

  return store;
}
