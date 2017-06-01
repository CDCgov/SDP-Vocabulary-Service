import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_FORM_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const extractFromSearchResults = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      const results = action.payload.data.hits.hits;
      results.forEach((hit) => {
        switch (hit.Type) {
          case 'question':
            const question = {id: hit.Source.id, content: hit.Source.name,
              createdAt: hit.Source.createdAt, createdById: hit.Source.createdBy.id,
              description: hit.Source.description, updatedAt: hit.Source.updatedAt,
              status: hit.Source.status, responseType: hit.Source.responseType,
              version: hit.Source.version, versionIndependentId: hit.Source.versionIndependentId
            };
            dispatchIfNotPresent(store, 'questions', question, FETCH_QUESTION_FULFILLED);
            break;
          case 'form':
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

export default extractFromSearchResults;
