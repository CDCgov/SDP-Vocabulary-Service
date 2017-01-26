import { expect } from '../test_helper';
import forms from '../../../webpack/reducers/forms_reducer';
import _ from 'lodash';
import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED
} from '../../../webpack/actions/types';

describe('forms reducer', () => {
  const twoQuestions = [{id:1,content:"M?",questionTypeId:1},{id:2,content:"F?",questionTypeId:1}];
  const twoForms = [
                    {id: 1, name: "Red Form",  userId: "testAuthor@gmail.com", questions:[]},
                    {id: 3, name: "Blue Form", userId: "testAuthor@gmail.com", questions: twoQuestions}
                   ];

  it('should fetch forms', () => {
    const payloadData = {data: twoForms};
    const action = {type: FETCH_FORMS_FULFILLED, payload: payloadData};
    const startState = {}
    const nextState = forms(startState, action);
    expect(Object.keys(nextState).length).to.equal(2);
  });
});
