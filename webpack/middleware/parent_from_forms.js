import {
  FETCH_FORMS_FULFILLED,
  FETCH_FORM_FULFILLED
} from '../actions/types';

const parentFromForms = store => next => action => {
  if (store == null) return;
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      const forms = action.payload.data;
      forms.forEach((form) => {
        if (form.parent) {
          form.parent = ({id: form.parent.id, name: form.parent.name});
        }
      });
      break;
    case FETCH_FORM_FULFILLED:
      if(action.payload.data.parent){
        action.payload.data.parent = ({id: action.payload.data.parent.id, name: action.payload.data.parent.name});
      }
  }

  next(action);
};

export default parentFromForms;
