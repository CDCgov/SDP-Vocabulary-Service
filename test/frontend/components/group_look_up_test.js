import { expect, renderComponent } from '../test_helper';
import GroupLookUp from '../../../webpack/components/shared_show/GroupLookUp';

describe('GroupLookUp', () => {
  let component;

  beforeEach(() => {
    const item = {id: 1, name: "Test", groups: [
      {id: 1, name: 'TestGroup1', description: 'Test1'},
      {id: 2, name: 'TestGroup2', description: 'Test2'}
    ]};
    const currentUser = {id: 1, email: "fake@gmail.com", name: "Fake Test", groups: [
      {id: 1, name: 'TestGroup1', description: 'Test1'},
      {id: 3, name: 'TestGroup3', description: 'Test3'}
    ]};
    component = renderComponent(GroupLookUp, { addFunc: ()=>{}, item, currentUser });
  });

  it('create a list of groups', () => {
    expect(component.find("li[class='current-group-menu-item']").length).to.equal(2);
  });
});
