import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_FORM_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const createQuestion = (source) => {
  const q = {id: source.id, content: source.name,
    createdAt: source.createdAt, description: source.description,
    updatedAt: source.updatedAt, status: source.status,
    responseType: source.responseType, version: source.version,
    versionIndependentId: source.versionIndependentId
  };
  if (source.createdBy) {
    q.createdById = source.createdBy.id;
  }
  return q;
};

const extractFromSearchResults = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      const results = action.payload.data.hits.hits;
      results.forEach((hit) => {
        switch (hit.Type) {
          case 'question':
            const question = createQuestion(hit.Source);
            dispatchIfNotPresent(store, 'questions', question, FETCH_QUESTION_FULFILLED);
            break;
          case 'form':
            const form = {id: hit.Source.id, name: hit.Source.name,
              createdAt: hit.Source.createdAt, createdById: hit.Source.createdBy.id,
              description: hit.Source.description, updatedAt: hit.Source.updatedAt,
              status: hit.Source.status,
              version: hit.Source.version, versionIndependentId: hit.Source.versionIndependentId
            };
            if (hit.Source.questions) {
              form.questions = hit.Source.questions.map((q) => createQuestion(q));
            }
            dispatchIfNotPresent(store, 'forms', form, FETCH_FORM_FULFILLED);
            break;
          case 'response_set':
            let responseSet = Object.assign({}, hit.Source);
            responseSet.responses = responseSet.codes;
            delete responseSet["codes"];
            dispatchIfNotPresent(store, 'response_sets', responseSet, FETCH_RESPONSE_SET_FULFILLED);
            break;
        }
      });
  }

  next(action);
};

export default extractFromSearchResults;
