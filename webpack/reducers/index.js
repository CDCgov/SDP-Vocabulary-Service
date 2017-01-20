import {
  combineReducers
} from 'redux';

import questions from './questions';
import comments from './comments';
import stats from './stats';
import responseSets from './response_sets_reducer';
import currentUser from './current_user_reducer';

const rootReducer = combineReducers({
  questions, comments, stats, currentUser, responseSets
});

export default rootReducer;
