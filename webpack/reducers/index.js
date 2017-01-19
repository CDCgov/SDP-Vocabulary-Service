import {
  combineReducers
} from 'redux';

import questions from './questions_reducer';
import comments from './comments';
import stats from './stats';

const rootReducer = combineReducers({
  questions, comments, stats
});

export default rootReducer;
