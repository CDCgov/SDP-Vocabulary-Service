import {
  LOG_OUT
} from '../actions/types';

const parentFromQuestions = store => next => action => {
  let {payload} = action;
  if(payload && payload.response && payload.response.status == 401) {
    // If we are getting 401s we know the session on the server is expired
    store.dispatch({
      type: LOG_OUT
    });
  }
  next(action);
};

export default parentFromQuestions;
