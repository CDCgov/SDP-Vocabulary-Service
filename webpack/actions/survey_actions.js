import axios from 'axios';
import { normalize } from 'normalizr';
import { surveySchema } from '../schema';
import routes from '../routes';
import { deleteObject } from './action_helpers';
import { getCSRFToken } from './index';
import {
  SAVE_SURVEY,
  SAVE_DRAFT_SURVEY,
  CREATE_SURVEY,
  PUBLISH_SURVEY,
  RETIRE_SURVEY,
  ADD_SURVEY_TO_GROUP,
  REMOVE_SURVEY_FROM_GROUP,
  DELETE_SURVEY,
  ADD_ENTITIES,
  UPDATE_SURVEY_TAGS,
  CREATE_IMPORT_SESSION,
  UPDATE_IMPORT_SESSION,
  ATTEMPT_IMPORT_FILE,
  FETCH_DUPLICATES
} from './types';


export function newSurvey() {
  return {
    type: CREATE_SURVEY
  };
}

export function deleteSurvey(id, cascade, callback=null) {
  return {
    type: DELETE_SURVEY,
    payload: deleteObject(routes.surveyPath(id), cascade, callback)
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

export function fetchDuplicates(id) {
  return {
    type: FETCH_DUPLICATES,
    payload: axios.get(routes.duplicatesSurveyPath(id), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
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

export function retireSurvey(id) {
  const authenticityToken = getCSRFToken();
  return {
    type: RETIRE_SURVEY,
    payload: axios.put(routes.retireSurveyPath(id),
     {authenticityToken}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function addSurveyToGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: ADD_SURVEY_TO_GROUP,
    payload: axios.put(routes.addToGroupSurveyPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function removeSurveyFromGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: REMOVE_SURVEY_FROM_GROUP,
    payload: axios.put(routes.removeFromGroupSurveyPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function saveSurvey(survey, comment, successHandler=null, failureHandler=null) {
  const fn = axios.post;
  const postPromise = createPostPromise(survey, comment, routes.surveysPath(), fn, successHandler, failureHandler);
  return {
    type: SAVE_SURVEY,
    payload: postPromise
  };
}

export function saveDraftSurvey(survey, comment, successHandler=null, failureHandler=null) {
  const fn = axios.put;
  const postPromise = createPostPromise(survey, comment, routes.surveyPath(survey.id), fn, successHandler, failureHandler);
  return {
    type: SAVE_DRAFT_SURVEY,
    payload: postPromise
  };
}

export function createImportSession(file, importType, successHandler=null, failureHandler=null) {
  const authenticityToken  = getCSRFToken();
  const formData = new FormData();
  formData.append('authenticity_token', authenticityToken);
  formData.append('file', file);
  formData.append('import_type', importType);
  const postPromise = axios.post(routes.importSessionsPath(),
                        formData,
                        {headers: {'X-Key-Inflection': 'camel', 'content-type': 'multipart/form-data'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }
  return {
    type: CREATE_IMPORT_SESSION,
    payload: postPromise
  };
}

export function updateImportSession(id, file,  importType, successHandler=null, failureHandler=null) {
  const authenticityToken  = getCSRFToken();
  const formData = new FormData();
  formData.append('authenticity_token', authenticityToken);
  formData.append('file', file);
  formData.append('import_type', importType);
  formData.append('request_survey_creation', false);
  const putPromise = axios.put(routes.importSessionPath(id),
                      formData,
                      {headers: {'X-Key-Inflection': 'camel', 'content-type': 'multipart/form-data'}});
  if (successHandler) {
    putPromise.then(successHandler);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: UPDATE_IMPORT_SESSION,
    payload: putPromise
  };
}

export function attemptImportFile(id, importType, successHandler=null, failureHandler=null) {
  const authenticityToken  = getCSRFToken();
  const requestSurveyCreation = true;
  const formData = new FormData();

  formData.append('authenticity_token', authenticityToken);
  formData.append('import_type', importType);
  formData.append('request_survey_creation', requestSurveyCreation);

  const putPromise = axios.put(routes.importSessionPath(id),
                      formData,
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    putPromise.then(successHandler);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: ATTEMPT_IMPORT_FILE,
    payload: putPromise
  };
}

export function updateSurveyTags(id, conceptsAttributes) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.update_tags_survey_path(id),
                      {id, authenticityToken, conceptsAttributes},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  return {
    type: UPDATE_SURVEY_TAGS,
    payload: putPromise
  };
}

function createPostPromise(survey, comment, url, fn, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  survey.questionsAttributes = survey.questions;
  delete survey.showModal;
  delete survey.progSysModalOpen;
  const postPromise = fn(url,
                      {survey, comment, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }

  return postPromise;
}
