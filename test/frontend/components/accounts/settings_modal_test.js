import { expect } from '../../test_helper';
import React from 'react';
import SettingsModal from '../../../../webpack/components/accounts/SettingsModal';
import chai from 'chai';
import spies from 'chai-spies';
import { mount } from 'enzyme';
chai.use(spies);
describe('SettingsModal', () => {




  it('should display the user update fields for email, first and last names', () => {
    let props  = {  update: function(){},
      disableUserUpdate: "false",
      show: true,
      closer: function(){},
      currentUser:{email: "test@test.com", firstName: "Testy", lastName: "Testington",id: 1},
      surveillanceSystems: [],
      surveillancePrograms: [],
    };

    let wrapper = mount(
      <SettingsModal {...props}/>
    );
    // Get the component instance
    let instance = wrapper.instance();
    instance.renderUserInfo = chai.spy(instance.renderUserInfo);
    instance.render();
    expect(instance.renderUserInfo).to.have.been.called();
  });

  it('should not display the user update fields for email, first and last names when disableUserUpdate is true', () => {
    let props  = {  update: function(){},
      disableUserUpdate: "true",
      show: true,
      closer: function(){},
      currentUser:{email: "test@test.com", firstName: "Testy", lastName: "Testington",id: 1},
      surveillanceSystems: [],
      surveillancePrograms: [],
    };
    let wrapper = mount(
      <SettingsModal {...props}/>
    );
    // Get the component instance
    let instance = wrapper.instance();
    instance.renderUserInfo = chai.spy(instance.renderUserInfo);
    instance.render();
    expect(instance.renderUserInfo).to.not.have.been.called();

  });
});
