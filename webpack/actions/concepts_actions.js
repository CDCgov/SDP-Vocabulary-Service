import axios from 'axios';
import routes from '../routes';
import {
  FETCH_CONCEPT_SYSTEMS,
  FETCH_CONCEPTS,
  FETCH_TAGS
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

export function fetchTags() {
  return {
    type: FETCH_TAGS,
    payload: axios.get(routes.conceptsPath(), {
      headers: {
        'Accept': 'application/json', 'X-Key-Inflection': 'camel'
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
