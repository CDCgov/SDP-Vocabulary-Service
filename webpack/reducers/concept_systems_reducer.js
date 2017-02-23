import _ from 'lodash';
import {
  FETCH_CONCEPT_SYSTEMS_FULFILLED
} from '../actions/types';

export default function conceptSystems(state = {}, action) {
  switch (action.type) {
    case FETCH_CONCEPT_SYSTEMS_FULFILLED:
      return Object.assign(_.keyBy(action.payload.data, 'name'), state);
    default:
      return state;
  }
}
