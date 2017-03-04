import {
  expect,
  renderComponent
} from '../test_helper';
import MyStuffContainer from '../../../webpack/containers/MyStuffContainer';

describe('MyStuffContainer ', () => {
  it('will show my stuff', () => {
    const component = renderComponent(MyStuffContainer);
    expect(component.find("div[class='my-stuff']").length).to.exist;
  });
});
