import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from '../test_helper';
import ResponseSetTable from '../../../webpack/components/ResponseSetTable';

const $ = _$(window);

describe('ResponseSetTable', () => {
  let component, componentInstance;

  beforeEach(() => {
    const initialResponses = [{code: 'M', system: 'Gender', display: 'Male'},
                              {code: 'F', system: 'Gender', display: 'Female'}];
    componentInstance =  TestUtils.renderIntoDocument(<ResponseSetTable initialResponses={initialResponses}/>);
    component = $(ReactDOM.findDOMNode(componentInstance));
  });

  it('should create the table', () => {
    expect(component.find("tr").length).to.equal(4);
  });

  it('should update the state when a value is changed', () => {
    const input = component.find("input[value=M]")[0];
    TestUtils.Simulate.change(input, {target: {value: 'different'}});
    expect(componentInstance.state.responses[0].code).to.equal('different');
  });

  it('should remove a row', () => {
    TestUtils.Simulate.click(component.find("a")[0]); // Remove first row
    expect(component.find("tr").length).to.equal(3);
    expect(component.find("input[value=M]").length).to.equal(0);
    expect(component.find("input[value=F]").length).to.equal(1);
  });
});
