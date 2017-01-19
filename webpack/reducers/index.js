import {
  combineReducers
} from 'redux';

import questions from './questions';
import comments from './comments';
import stats from './stats';
import responseSets from './response_sets_reducer';

const rootReducer = combineReducers({
  questions, comments, stats, responseSets
});

export default rootReducer;
