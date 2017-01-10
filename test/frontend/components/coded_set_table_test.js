import { expect, renderComponent } from '../test_helper';
import CodedSetTable from '../../../webpack/components/CodedSetTable';

describe('CodedSetTable', () => {
  let component;

  beforeEach(() => {
    const items = [{code:"Code 1",display:" Display Name 1",system:"Test system 1"},
                   {code:"Code 2",display:" Display Name 2",system:"Test system 2"},
                   {code:"Code 3",display:" Display Name 3",system:"Test system 3"}];
    component = renderComponent(CodedSetTable, {items});
  });

  it('should create a list of vocab concepts', () => {
    expect(component.find("tr").length).to.equal(4);
  });
});
