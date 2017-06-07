import {
  SET_LAST_SEARCH
} from '../actions/types';

export default function lastSearch(state = {}, action) {
  if (action.type === SET_LAST_SEARCH) {
    return action.payload;
  }
  return state;
}
