import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { expect } from '../test_helper';
import QuestionForm from '../../../webpack/components/QuestionForm';
import reducers from '../../../webpack/reducers';

describe('QuestionForm', () => {
  it('should show the others allowed when choice selected', () => {
    const props = {
      question: {id: 1, content: "Is this a question?", questionType: "", responseSets: [1], concepts: [{code:"Code 1", display:" Display Name 1", system:"Test system 1"}]},
      action: 'new',
      questionSubmitter: ()=>{},
      draftSubmitter: ()=>{},
      questionTypes: {},
      responseSets:  {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}},
      responseTypes: {1: {id: 1, name: "Integer", description: "A number", code: "integer"},
        2: {id: 2, name: "Choice", description: "A choice", code: "choice"}}
    };
    const c = TestUtils.renderIntoDocument(<Provider store={createStore(reducers, {})}>
          <QuestionForm {...props} />
    </Provider>);
    const qf = TestUtils.findRenderedComponentWithType(c, QuestionForm);
    expect(qf.otherAllowedBox()).to.equal('');
    qf.setState({responseTypeId: 2});
    expect(qf.otherAllowedBox().type).to.equal('div');
  });
});
