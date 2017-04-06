import {
  LOG_OUT,
} from '../actions/types';
import { hashHistory } from 'react-router';

const errorResponses = store => next => action => {
  let {payload} = action;
  if(payload && payload.response) {
    switch (payload.response.status) {
      case 401:
        // If we are getting 401s we know the session on the server is expired
        store.dispatch({
          type: LOG_OUT
        });
        break;
      case 403:
        hashHistory.push(`/errors/${payload.response.status}`);
    }

  }
  next(action);
};

export default errorResponses;
