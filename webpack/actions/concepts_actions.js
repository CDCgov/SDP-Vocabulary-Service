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
  return {
    type: FETCH_CONCEPTS,
    payload: axios.get(routes.conceptServiceSearchPath(), {
      headers: {
        'Accept': 'application/json'
      },
      params: {
        system:  system,
        version: version,
        search:  searchTerm
      }
    })
  };
}
