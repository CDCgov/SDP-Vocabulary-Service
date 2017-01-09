import { expect, renderComponent } from '../test_helper';
import FormList from '../../../webpack/components/FormList';
import routes from '../mock_routes';

describe('FormList', () => {
  let component;

  beforeEach(() => {
    const forms = [{id:1,name:"Bleep",createdBy:{email: "test_author@gmail.com"},createdAt:"2016-12-27T23:40:54.505Z",updatedAt:"2016-12-28T23:40:54.505Z",versionIndependentId:"F-1",version:1,controlNumber:"","questions":[]},
                 {id:2,name:"Bloop",createdBy:{email: "test_author@gmail.com"},createdAt:"2016-12-28T23:40:54.505Z",updatedAt:"2016-12-29T23:40:54.505Z",versionIndependentId:"F-1",version:1,controlNumber:"","questions":[]},
                 {id:3,name:"I am a robot",createdBy:{email: "test_author@gmail.com"},createdAt:"2016-12-29T23:40:54.505Z",updatedAt:"2016-12-30T23:40:54.505Z",versionIndependentId:"F-1",version:1,controlNumber:"","questions":[]}];
    component = renderComponent(FormList, {forms, routes});
  });

  it('should create a list of forms', () => {
    expect(component.find("div[class='form']").length).to.equal(3);
  });

});
