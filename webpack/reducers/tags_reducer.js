import assign from 'lodash/assign';
import uniqBy from 'lodash/uniqBy';

import {
  FETCH_TAGS_FULFILLED
} from '../actions/types';

export default function tags(state = {}, action) {
  if (action.type === FETCH_TAGS_FULFILLED) {
    return uniqBy(action.payload.data, 'display_name');
  }
  return state;
}
