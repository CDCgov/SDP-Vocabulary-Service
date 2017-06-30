import {
  FETCH_SURVEY_FULFILLED,
  SAVE_DRAFT_SURVEY_FULFILLED,
  FETCH_FORMS_FROM_MIDDLE_FULFILLED,
  FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED
} from '../actions/types';

import { dispatchCollectionMembersIfNotPresent } from './store_helper';

const stuffFromSurveys = store => next => action => {
  switch (action.type) {
    case SAVE_DRAFT_SURVEY_FULFILLED:
    case FETCH_SURVEY_FULFILLED:
      if (action.payload.data.questions) {
        dispatchCollectionMembersIfNotPresent(store, 'questions', action.payload.data.questions, FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED);
      }
      if (action.payload.data.forms) {
        dispatchCollectionMembersIfNotPresent(store, 'forms', action.payload.data.forms, FETCH_FORMS_FROM_MIDDLE_FULFILLED);
      }
      break;
  }
  next(action);
};
export default stuffFromSurveys;
