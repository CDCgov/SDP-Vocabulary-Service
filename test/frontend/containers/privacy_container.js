import {
  expect,
  renderComponent
} from '../test_helper';
import Privacy from '../../../webpack/containers/Privacy';

describe('Privacy ', () => {
  it('will show the privacy page', () => {
    const component = renderComponent(Privacy);
    expect(component.find("div[class='container']").length).to.exist;
    expect(component.find("p")).to.exist;
  });
});
