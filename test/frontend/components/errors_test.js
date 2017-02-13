import {
  expect,
  renderComponent
} from '../test_helper';
import Errors from '../../../webpack/components/Errors';

describe('Errors', () => {
  let component;

  beforeEach(() => {
    const errors = {
      oid: ['must be unique'],
      name: ['too short', 'not jazzy enough']
    };
    component = renderComponent(Errors, {errors});
  });

  it('should display the correct number of errors', () => {
    expect(component.find('h2')).to.contain('3 error(s) prohibited this form from being saved');
  });

  it('should an error message with the key and error', () => {
    expect(component.find('li')).to.contain('oid - must be unique');
    expect(component.find('li')).to.contain('name - too short');
    expect(component.find('li')).to.contain('name - not jazzy enough');
  });
});
