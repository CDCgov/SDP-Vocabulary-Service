import _ from 'lodash';
import {
  FETCH_CONCEPT_SYSTEMS_FULFILLED,
  FETCH_CONCEPT_SYSTEMS_REJECTED
} from '../actions/types';

export default function conceptSystems(state = {}, action) {
  switch (action.type) {
    case FETCH_CONCEPT_SYSTEMS_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    case FETCH_CONCEPT_SYSTEMS_REJECTED:
      return {error: 'Concept Service could not be reached, please try again later.'};
    default:
      return state;
  }
}
