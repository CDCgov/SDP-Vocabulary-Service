import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from '../test_helper';
import QuestionList from '../../../webpack/components/QuestionList';

const $ = _$(window);

describe('QuestionList', () => {
  let component, componentInstance;

  beforeEach(() => {
    const questions = [{id: 1, content: "Is this a question?", question_type: ""},
                      {id: 2, content: "Whats your name", question_type: ""},
                      {id: 3, content: "What is a question?", question_type: ""}]
    componentInstance =  TestUtils.renderIntoDocument(<QuestionList questions={questions}/>);
    component = $(ReactDOM.findDOMNode(componentInstance));
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='question-group']").length).to.equal(3);
  });

});
