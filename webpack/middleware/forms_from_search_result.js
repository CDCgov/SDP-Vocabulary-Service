import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_FORM_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const formsFromSearchResult = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      const results = action.payload.data.hits.hits;
      results.forEach((hit) => {
        if (hit.Type === 'form') {
          const form = {id: hit.Source.id, name: hit.Source.name,
            createdAt: hit.Source.createdAt, createdById: hit.Source.createdBy.id,
            description: hit.Source.description, updatedAt: hit.Source.updatedAt,
            status: hit.Source.status, questions: hit.Source.questions,
            version: hit.Source.version, versionIndependentId: hit.Source.versionIndependentId
          };
          dispatchIfNotPresent(store, 'forms', form, FETCH_FORM_FULFILLED);
        }
      });
  }

  next(action);
};

export default formsFromSearchResult;
