import axios from 'axios';
import routes from '../routes';
import {
  FETCH_CONCEPT_SYSTEMS,
  FETCH_CONCEPTS
} from './types';

export function fetchConceptSystems() {
  return {
    type: FETCH_CONCEPT_SYSTEMS,
    payload: axios.get(routes.conceptServiceSystemsPath(), {
      headers: {
        'Accept': 'application/json'
      }
    })
  };
}

export function fetchConcepts(system, searchTerm, version) {
  var params  = {search:  searchTerm};
  if (system && system !== ''){
    params.version = version;
    params.system  = system;
  }
  return {
    type: FETCH_CONCEPTS,
    payload: axios.get(routes.conceptServiceSearchPath(), {
      headers: {
        'Accept': 'application/json'
      },
      params: params
    })
  };
}
