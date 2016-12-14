import {
  combineReducers
} from 'redux';

import questionsReducer from './questions';
import commentsReducer from './comments';

const rootReducer = combineReducers({
  questions: questionsReducer,
  comments: commentsReducer
});

export default rootReducer;
