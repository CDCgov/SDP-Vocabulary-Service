import {
  FETCH_DUPLICATES_FULFILLED,
  MARK_AS_DUPLICATE_FULFILLED,
  LINK_TO_DUPLICATE_FULFILLED
} from '../actions/types';

export default function potentialDupes(state = [], action) {
  if (action.type === FETCH_DUPLICATES_FULFILLED || action.type === MARK_AS_DUPLICATE_FULFILLED || action.type === LINK_TO_DUPLICATE_FULFILLED) {
    return action.payload.data;
  }
  return state;
}
