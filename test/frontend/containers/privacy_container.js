import {
  expect,
  renderComponent
} from '../test_helper';
import TermsOfService from '../../../webpack/containers/TermsOfService';

describe('TermsOfService ', () => {
  it('will show the TOS page', () => {
    const component = renderComponent(TermsOfService);
    expect(component.find("div[class='container']").length).to.exist;
    expect(component.find("p")).to.exist;
  });
});
