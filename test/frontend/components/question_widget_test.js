import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from '../test_helper';
import QuestionWidget from '../../../webpack/components/QuestionWidget';

const $ = _$(window);

describe('QuestionWidget', () => {
  let component, componentInstance;

  beforeEach(() => {
    const question = {id: 1, content: "Is this a question?", question_type: ""}
    componentInstance =  TestUtils.renderIntoDocument(<QuestionWidget question={question}/>);
    component = $(ReactDOM.findDOMNode(componentInstance));
  });

  it('should create question block', () => {
    expect(component.find("div[class='question-container']").length).to.equal(1);
    expect(component.find("div[class='response-set-details']").length).to.equal(1);
  });
});
