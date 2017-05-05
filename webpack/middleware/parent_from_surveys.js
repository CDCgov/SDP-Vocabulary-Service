import {
  FETCH_SURVEYS_FULFILLED,
  FETCH_SURVEY_FULFILLED
} from '../actions/types';

const parentFromSurveys = store => next => action => {
  if (store == null) return;
  switch (action.type) {
    case FETCH_SURVEYS_FULFILLED:
      const surveys = action.payload.data;
      surveys.forEach((survey) => {
        if (survey.parent) {
          survey.parent = ({id: survey.parent.id, name: survey.parent.name});
        }
      });
      break;
    case FETCH_SURVEY_FULFILLED:
      if(action.payload.data.parent){
        action.payload.data.parent = ({id: action.payload.data.parent.id, name: action.payload.data.parent.name});
      }
  }

  next(action);
};

export default parentFromSurveys;
