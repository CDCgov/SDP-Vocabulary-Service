import { expect, renderComponent } from '../test_helper';
import FormWidget from '../../../webpack/components/FormWidget';
import routes from '../mock_routes';

describe('FormWidget', () => {
  let component;

  beforeEach(() => {
    const form = {id:1,name:"Bloop",createdByEmail:"test_author@gmail.com",createdAt:"2016-12-27T23:40:54.505Z",updatedAt:"2016-12-27T23:40:54.505Z",versionIndependentId:"F-1",version:1,controlNumber:""};
    component = renderComponent(FormWidget, {form, routes});
  });

  it('should create a form block', () => {
    expect(component.find("div[class='form-container']").length).to.equal(1);
    expect(component.find("li[class='form-title']").length).to.equal(1);
    expect(component.find("li[class='form-list-group-item']").length).to.equal(2);
    expect(component.find("div[class='form-info']").length).to.equal(1);
    expect(component.find("div[class='question-set-details']").length).to.equal(1);
  });
});
