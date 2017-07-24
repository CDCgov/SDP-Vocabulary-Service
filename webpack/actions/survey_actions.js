import axios from 'axios';
import { normalize } from 'normalizr';
import { surveySchema, surveysSchema } from '../schema';
import routes from '../routes';
import { deleteObject } from './action_helpers';
import { getCSRFToken } from './index';
import {
  FETCH_SURVEYS,
  FETCH_SURVEY,
  SAVE_SURVEY,
  SAVE_DRAFT_SURVEY,
  CREATE_SURVEY,
  PUBLISH_SURVEY,
  DELETE_SURVEY,
  ADD_ENTITIES
} from './types';


export function newSurvey() {
  return {
    type: CREATE_SURVEY
  };
}

export function deleteSurvey(id, callback=null) {
  return {
    type: DELETE_SURVEY,
    payload: deleteObject(routes.surveyPath(id), callback)
  };
}

export function fetchMySurveys(searchTerms) {
  return {
    type: FETCH_SURVEYS,
    payload: axios.get(routes.mySurveysPath(), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      },
      params: { search: searchTerms }
    })
  };
}

// Possibly not used anymore along with fetchMy*
export function fetchSurveys(searchTerms) {
  return {
    type: ADD_ENTITIES,
    payload: axios.get(routes.surveysPath(), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      },
      params: { search: searchTerms }
    }).then((response) => {
      const normalizedData = normalize(response.data, surveysSchema);
      return normalizedData.entities;
    })
  };
}

export function fetchSurvey(id) {
  return {
    type: ADD_ENTITIES,
    payload: axios.get(routes.surveyPath(id), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
    }).then((surveyResponse) => {
      const normalizedData = normalize(surveyResponse.data, surveySchema);
      return normalizedData.entities;
    })
  };
}

export function publishSurvey(id) {
  const authenticityToken = getCSRFToken();
  return {
    type: PUBLISH_SURVEY,
    payload: axios.put(routes.publishSurveyPath(id),
     {authenticityToken}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function saveSurvey(survey, successHandler=null, failureHandler=null) {
  const fn = axios.post;
  const postPromise = createPostPromise(survey, routes.surveysPath(), fn, successHandler, failureHandler);
  return {
    type: SAVE_SURVEY,
    payload: postPromise
  };
}

export function saveDraftSurvey(survey, successHandler=null, failureHandler=null) {
  const fn = axios.put;
  const postPromise = createPostPromise(survey, routes.surveyPath(survey.id), fn, successHandler, failureHandler);
  return {
    type: SAVE_DRAFT_SURVEY,
    payload: postPromise
  };
}

function createPostPromise(survey, url, fn, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  survey.questionsAttributes = survey.questions;
  const postPromise = fn(url,
                      {survey, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }

  return postPromise;
}
