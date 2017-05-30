import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_QUESTION_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const questionsFromSearchResult = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      const results = action.payload.data.hits.hits;
      results.forEach((hit) => {
        if (hit.Type === 'question') {
          const question = {id: hit.Source.id, content: hit.Source.name,
            createdAt: hit.Source.createdAt, createdById: hit.Source.createdBy.id,
            description: hit.Source.description, updatedAt: hit.Source.updatedAt,
            status: hit.Source.status, responseType: hit.Source.responseType,
            version: hit.Source.version, versionIndependentId: hit.Source.versionIndependentId
          };
          dispatchIfNotPresent(store, 'questions', question, FETCH_QUESTION_FULFILLED);
        }
      });
  }

  next(action);
};

export default questionsFromSearchResult;
