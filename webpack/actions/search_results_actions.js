import axios from 'axios';
import { normalize } from 'normalizr';
import { searchResultsSchema } from '../schema';
import values from 'lodash/values';
import routes from '../routes';
import store from '../store/configure_store';
import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS,
  SET_LAST_SEARCH,
  FETCH_LAST_SEARCH,
  ADD_ENTITIES_FULFILLED
} from './types';

export function fetchSearchResults(context, searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: FETCH_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
    }).then((response) => {
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

export function fetchLastSearch(context, searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false, pages) {
  let querySize = pages*10;
  return {
    type: FETCH_LAST_SEARCH,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter, size: querySize }
    }).then((response) => {
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

export function fetchMoreSearchResults(context, searchTerms=null, type=null, page, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, page: page, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
    }).then((response) => {
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

export function setLastSearch(searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false, page=1) {
  return {
    type: SET_LAST_SEARCH,
    payload: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter, page: page }
  };
}

export function fetchPotentialDuplicateQuestions(context, content, description) {
  return {
    type: FETCH_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchDuplicateQuestionsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { content, description }
    }).then((response) => {
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

// Everything in elasticsearch has codes, with code and codeSystem. The models
// expect their own thing ResponseSet.responses, Question.concepts with value
// and codeSystem. This function will transform the elasticsearch results into
// the structure expected by the rest of the react application.
function transformConcepts(items) {
  values(items).forEach((i) => {
    if(i.codes) {
      i.concepts = i.codes;
      delete i.codes;
      i.concepts.forEach((c) => {
        c.value = c.code;
        delete c.code;
      });
    }
  });
}

function unelasticsearchResults(results) {
  if (results.responseSets) {
    values(results.responseSets).forEach((rs) => {
      if(rs.codes) {
        rs.responses = rs.codes;
        delete rs.codes;
        rs.responses.forEach((r) => {
          r.value = r.code;
          delete r.code;
        });
      }
    });
  }
  if (results.questions) {
    transformConcepts(results.questions);
  }
  if (results.forms) {
    transformConcepts(results.forms);
  }
  if (results.surveys) {
    transformConcepts(results.questions);
  }
}
