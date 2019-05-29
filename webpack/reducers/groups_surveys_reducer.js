import {
  FETCH_GROUPS_SURVEYS_FULFILLED,
} from '../actions/types';

export default function groups(state = [], action) {
  switch (action.type) {
    case FETCH_GROUPS_SURVEYS_FULFILLED:
      return action.payload.data;
    default:
      return state;
  }
}
