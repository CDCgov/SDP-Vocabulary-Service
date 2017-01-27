import {
  combineReducers
} from 'redux';

import questions from './questions_reducer';
import forms from './forms_reducer';
import comments from './comments';
import stats from './stats';
import responseSets from './response_sets_reducer';
import currentUser from './current_user_reducer';
import questionTypes from './question_types';
import responseTypes from './response_types';

const rootReducer = combineReducers({
  questions, comments, stats, currentUser, responseSets, forms, questionTypes, responseTypes
});

export default rootReducer;
