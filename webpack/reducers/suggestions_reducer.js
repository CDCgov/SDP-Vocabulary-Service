import uniqBy from 'lodash/uniqBy';

import {
  FETCH_SUGGESTIONS_FULFILLED
} from '../actions/types';

export default function suggestions(state = {}, action) {
  if (action.type === FETCH_SUGGESTIONS_FULFILLED) {
    return uniqBy(action.payload.data.suggest.searchSuggest[0].options, 'text');
  }
  return state;
}
