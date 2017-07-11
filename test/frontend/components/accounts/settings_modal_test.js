import { expect } from '../../test_helper';
import React from 'react';
import SettingsModal from '../../../../webpack/components/accounts/SettingsModal';
import sinon from 'sinon';
import { mount } from 'enzyme';
describe('SettingsModal', () => {
  let component, router, inputNode, props;

  beforeEach(() => {
    props  = {  update: function(){},
      disableUserUpdate: "false",
      show: true,
      closer: function(){},
      currentUser:{email: "test@test.com", firstName: "Testy", lastName: "Testington",id: 1},
      surveillanceSystems: [],
      surveillancePrograms: [],
    };
  });

  it('should display the user update fields for email, first and last names', () => {
    props["disableUserUpdate"] = 'false'

    const wrapper = mount(
      <SettingsModal {...props}/>
    );
    // Get the component instance
    const instance = wrapper.instance();
    instance.renderUserInfo = sinon.spy(instance.renderUserInfo);
    instance.render();
    expect(expect(instance.renderUserInfo).to.not.have.been.called);
  });

  it('should not display the user update fields for email, first and last names when disableUserUpdate is true', () => {
    const wrapper = mount(
      <SettingsModal {...props}/>
    );
    // Get the component instance
    const instance = wrapper.instance();
    instance.renderUserInfo = sinon.spy(instance.renderUserInfo);
    instance.render();
    expect(expect(instance.renderUserInfo).to.have.been.calledOnce);

  });
});
