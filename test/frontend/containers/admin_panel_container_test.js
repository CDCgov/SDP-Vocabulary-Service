import {expect, renderComponent} from '../test_helper';
import AdminPanel from '../../../webpack/containers/AdminPanel';


describe('AdminPanel', () => {
  let component;

  beforeEach(() => {
    const props = {
      adminList: {1: {id: 1, name: 'Chester Tester', email: 'ctester@mitre.org'}},
      publisherList: {},
      currentUser: {id: 1, admin: true}
    };
    component = renderComponent(AdminPanel, props);
  });

  it('should create AdminPanel', () => {
    expect(component.find("input[name='email']")).to.exist;
  });
});
