import { expect, renderComponent } from '../test_helper';
import CodedSetTable from '../../../webpack/components/CodedSetTable';

describe('CodedSetTable', () => {
  let component;

  beforeEach(() => {
    const items = [{value: "Bravo", display: "Display Name 1", codeSystem: "Test system B"},
                   {value: "Alpha", display: "Display Name 2", codeSystem: "Test system B"},
                   {value: "Charlie", display: "Display Name 3", codeSystem: "Test system A"}];
    component = renderComponent(CodedSetTable, {items});
  });

  it('should create a list of vocab concepts', () => {
    expect(component.find("tr").length).to.equal(4);
  });

  it('should create a list of vocab concepts in order', () => {
    expect(component.find("tbody tr:nth-child(1) td:nth-child(1)")).to.have.text("Charlie");
    expect(component.find("tbody tr:nth-child(2) td:nth-child(1)")).to.have.text("Alpha");
    expect(component.find("tbody tr:nth-child(3) td:nth-child(1)")).to.have.text("Bravo");
  });
});
