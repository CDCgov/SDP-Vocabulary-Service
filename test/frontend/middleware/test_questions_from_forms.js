import { expect } from '../test_helper';
import MockStore from '../mock_store';

import questionsFromForms from '../../../webpack/middleware/questions_from_forms';

import {
  FETCH_FORMS_FULFILLED,
  FETCH_QUESTION_FULFILLED
} from '../../../webpack/actions/types';

describe('questionsFromForms middleware', () => {
  let store;
  let action;

  const twoQuestions = [{id:1,content:"M?",questionTypeId:1},{id:2,content:"F?",questionTypeId:1}];
  const transformedQs = [{id:1,content:"M?"},{id:2,content:"F?"}];
  const twoForms = [
                    {id: 1, name: "Red Form",  userId: "testAuthor@gmail.com", questions: twoQuestions},
                    {id: 3, name: "Blue Form", userId: "testAuthor@gmail.com", questions: twoQuestions}
  ];

  const next = () => {
    1 + 1; //do nothing
  };

  beforeEach(() => {
    store = new MockStore();
    action = {
      type: FETCH_FORMS_FULFILLED,
      payload: {data: twoForms}
    };
  });

  it('will dispatch actions for questions in forms', () => {
    questionsFromForms(store)(next)(action);
    let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_QUESTION_FULFILLED);
    expect(dispatchedAction).to.exist;
    expect(dispatchedAction.payload.data.content).to.equal('M?');
  });

  it('will transform the form payload', () => {
    questionsFromForms(store)(next)(action);
    const form = action.payload.data[0];
    expect(form.questions).to.eql(transformedQs);
  });
});
