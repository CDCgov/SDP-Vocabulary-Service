import {
  combineReducers
} from 'redux';

import {
  FETCH_QUESTION_TYPE_FULFILLED,
  FETCH_QUESTION_TYPES_FULFILLED,
  FETCH_RESPONSE_TYPES_FULFILLED,
  FETCH_RESPONSE_TYPE_FULFILLED,
  FETCH_SURVEILLANCE_SYSTEMS_FULFILLED,
  FETCH_SURVEILLANCE_PROGRAMS_FULFILLED,
  FETCH_PUBLISHERS_FULFILLED,
  GRANT_PUBLISHER_FULFILLED,
  REVOKE_PUBLISHER_FULFILLED,
  FETCH_ADMINS_FULFILLED,
  GRANT_ADMIN_FULFILLED,
  REVOKE_ADMIN_FULFILLED,
  ADD_PROGRAM_FULFILLED,
  ADD_SYSTEM_FULFILLED
} from '../actions/types';


import { byIdReducer, byIdWithIndividualReducer } from './reducer_generator';

import questions from './questions_reducer';
import sections from './sections_reducer';
import comments from './comments';
import stats from './stats';
import responseSets from './response_sets_reducer';
import currentUser from './current_user_reducer';
import notifications from './notifications';
import searchResults from './search_results_reducer';
import concepts from './concepts_reducer';
import tags from './tags_reducer';
import conceptSystems from './concept_systems_reducer';
import surveys from './surveys_reducer';
import tutorialSteps from './tutorial_reducer';
import lastSearch from './last_search_reducer';

const questionTypes = byIdWithIndividualReducer(FETCH_QUESTION_TYPES_FULFILLED,
  FETCH_QUESTION_TYPE_FULFILLED, 'questionTypes');
const responseTypes = byIdWithIndividualReducer(FETCH_RESPONSE_TYPES_FULFILLED,
  FETCH_RESPONSE_TYPE_FULFILLED, 'responseTypes');
const surveillanceSystems  = byIdReducer(FETCH_SURVEILLANCE_SYSTEMS_FULFILLED, ADD_SYSTEM_FULFILLED);
const surveillancePrograms = byIdReducer(FETCH_SURVEILLANCE_PROGRAMS_FULFILLED, ADD_PROGRAM_FULFILLED);
const publishers = byIdReducer(FETCH_PUBLISHERS_FULFILLED, GRANT_PUBLISHER_FULFILLED, REVOKE_PUBLISHER_FULFILLED);
const admins = byIdReducer(FETCH_ADMINS_FULFILLED, GRANT_ADMIN_FULFILLED, REVOKE_ADMIN_FULFILLED);

const rootReducer = combineReducers({
  questions, comments, stats, currentUser, responseSets, sections, questionTypes, admins,
  responseTypes, notifications, searchResults, concepts, conceptSystems, lastSearch,
  surveillancePrograms, surveillanceSystems, surveys, publishers, tutorialSteps, tags
});

export default rootReducer;
