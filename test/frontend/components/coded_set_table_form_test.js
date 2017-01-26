import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from '../test_helper';
import CodedSetTableForm from '../../../webpack/components/CodedSetTableForm';

const $ = _$(window);

describe('CodedSetTableForm', () => {
  let component, componentInstance;

  beforeEach(() => {
    const concepts = [{value: "Code1", displayName: "Display Name 1", codeSystem:"Test system 1"},
                      {value: "Code2", displayName: "Display Name 2", codeSystem:"Test system 2"},
                      {value: "Code3", displayName: "Display Name 3", codeSystem:"Test system 3"}];
    componentInstance =  TestUtils.renderIntoDocument(<CodedSetTableForm initialItems={concepts} parentName={'question'} childName={'concept'}/>);
    component = $(ReactDOM.findDOMNode(componentInstance));
  });

  it('should create the table', () => {
    expect(component.find("tr").length).to.equal(5);
  });

  it('should update the state when a value is changed', () => {
    const input = component.find("input[value=Code1]")[0];
    TestUtils.Simulate.change(input, {target: {value: 'different'}});
    expect(componentInstance.state.items[0].value).to.equal('different');
  });

  it('should add a row', () => {
    TestUtils.Simulate.click(component.find("a")[3]); // add button
    expect(component.find("tr").length).to.equal(6);
  });

  it('should remove a row', () => {
    TestUtils.Simulate.click(component.find("a")[0]); // Remove first row
    expect(component.find("tr").length).to.equal(4);
    expect(component.find("input[value=Code1]").length).to.equal(0);
    expect(component.find("input[value=Code2]").length).to.equal(1);
  });
});
