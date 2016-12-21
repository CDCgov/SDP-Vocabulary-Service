import {
  combineReducers
} from 'redux';

import questions from './questions';
import comments from './comments';

const rootReducer = combineReducers({
  questions: questions,
  comments: comments
});

export default rootReducer;
