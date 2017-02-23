import axios from 'axios';
import { getCSRFToken } from './index';
import {
  FETCH_CONCEPT_SYSTEMS,
  FETCH_CONCEPTS,
  FETCH_CONCEPT_SYSTEMS_FULFILLED,
  FETCH_CONCEPTS_FULFILLED
} from './types';

//const BASE_URI = 'http://concept-manager.129.83.185.216.xip.io'
const SYSTEMS_URL  = CONCEPT_SERVICE_URL + '/systems';
const CONCEPTS_URL = CONCEPT_SERVICE_URL + '/concepts';

export function fetchConceptSystems() {
  // return {
  //   type: FETCH_CONCEPT_SYSTEMS,
  //   payload: axios.get(SYSTEMS_URL, {
  //     headers: {
  //       'Accept': 'application/json'
  //     }
  //   })
  // };  
  return {
    type: FETCH_CONCEPT_SYSTEMS_FULFILLED,
    payload: {data:[{"url":"","version":"1","name":"TestSystem","status":"","publisher":"","copyright":"","caseSensitive":false,"hierarchyMeaning":"","compositional":false,"content":"","count":0},
            {"url":"","version":"1","name":"TestSystem Short","status":"","publisher":"","copyright":"","caseSensitive":false,"hierarchyMeaning":"","compositional":false,"content":"","count":0}]}
  };
}

export function fetchConcepts(system, searchTerm, version) {
  return {
    type: FETCH_CONCEPTS,
    payload: axios.get(CONCEPTS_URL, {
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
  // var systems ={'TestSystem':{"url":"","identifier":null,"version":"","name":"","status":"","description":"","expansion":{"identifier":"","timestamp":"","contains":[{"system":"TestSystem","version":"","code":"1","display":"Excision eye lesion NOS"},{"system":"TestSystem","version":"","code":"2","display":"Dx aspirat-ant chamber"},{"system":"TestSystem","version":"","code":"3","display":"C \u0026 s-op wound"},{"system":"TestSystem","version":"","code":"4","display":"Nonmechan resuscitation"},{"system":"TestSystem","version":"","code":"5","display":"Referral for drug rehab"},{"system":"TestSystem","version":"","code":"6","display":"Renal diagnost proc NEC"},{"system":"TestSystem","version":"","code":"7","display":"Opn mitral valvuloplasty"},{"system":"TestSystem","version":"","code":"8","display":"Remov large bowel tube"},{"system":"TestSystem","version":"","code":"9","display":"Total body scan"},{"system":"TestSystem","version":"","code":"10","display":"Perc abltn liver les/tis"},{"system":"TestSystem","version":"","code":"11","display":"Lap sigmoidectomy"},{"system":"TestSystem","version":"","code":"12","display":"Nonoperative exams NEC"},{"system":"TestSystem","version":"","code":"13","display":"Periren/vesicle excision"},{"system":"TestSystem","version":"","code":"14","display":"High forceps w episiot"},{"system":"TestSystem","version":"","code":"15","display":"Urinary manometry"},{"system":"TestSystem","version":"","code":"16","display":"Occlude leg artery NEC"},{"system":"TestSystem","version":"","code":"17","display":"Adrenal nerve division"},{"system":"TestSystem","version":"","code":"18","display":"Endo transmyo revascular"}]}},
  //               'TestSystem Short': {"url":"","identifier":null,"version":"","name":"","status":"","description":"","expansion":{"identifier":"","timestamp":"","contains":[{"system":"TestSystem","version":"","code":"1","display":"Excision eye lesion NOS this is a really long name for a concept to test stuff"},{"system":"TestSystem","version":"","code":"2","display":"Dx aspirat-ant chamber"}]}}}

  // return {
  //   type: FETCH_CONCEPTS_FULFILLED,
  //   payload: {config: {params: {system: system} }, data: systems[system]}
  // };
}
