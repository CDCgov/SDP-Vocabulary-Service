import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {expect, renderComponent} from '../test_helper';
import CodedSetTableEditContainer from '../../../webpack/containers/CodedSetTableEditContainer';

const $ = _$(window);

describe('CodedSetTableEditContainer', () => {
  let component, componentInstance;

  beforeEach(() => {
    const props = {initialItems: [{value: "Code1", displayName: "Display Name 1", codeSystem:"Test system 1"},
                    {value: "Code2", displayName: "Display Name 2", codeSystem:"Test system 2"},
                    {value: "Code3", displayName: "Display Name 3", codeSystem:"Test system 3"}],
                    parentName:'question',
                    childName:'concept'
    }
    component = renderComponent(CodedSetTableEditContainer, props);
  });

  it('should create the table', () => {
    expect(component.find("tr").length).to.equal(4);
  });
});
