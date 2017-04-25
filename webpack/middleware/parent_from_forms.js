import {
  FETCH_FORMS_FULFILLED,
  FETCH_FORM_FULFILLED
} from '../actions/types';

import dispatchIfNotPresent from './store_helper';

const parentFromForms = store => next => action => {
  if (store == null) return;
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      const forms = action.payload.data;
      forms.forEach((form) => {
        if (form.parent) {
          dispatchIfNotPresent(store, 'forms', form.parent, FETCH_FORM_FULFILLED);
          form.parent = ({id: form.parent.id, name: form.parent.name});
        }
      });
      break;
    case FETCH_FORM_FULFILLED:
      if(action.payload.data.parent){
        dispatchIfNotPresent(store, 'forms', action.payload.data.parent, FETCH_FORM_FULFILLED);
        action.payload.data.parent = ({id: action.payload.data.parent.id, name: action.payload.data.parent.name});
      }
  }

  next(action);
};

export default parentFromForms;
