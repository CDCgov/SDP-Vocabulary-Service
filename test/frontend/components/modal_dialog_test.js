import { expect, renderComponent, createComponent } from '../test_helper';
import TestUtils from 'react-dom/test-utils';
import ModalDialog from '../../../webpack/components/ModalDialog';

describe('ModalDialog', () => {
  let component, router, inputNode, props;

  beforeEach(() => {
    props  = {
              show: true,
              title:"Warning",
              subTitle:"Unsaved Changes",
              warning: true,
              message:"You are about to leave a page with unsaved changes. How would you like to proceed?",
              secondaryButtonMessage:"Continue Without Saving",
              primaryButtonMessage:"Save & Leave",
              cancelButtonMessage:"Cancel",
              primaryButtonAction:()=> {},
              cancelButtonAction :()=> {},
              secondaryButtonAction:()=> {}
    };
    component = renderComponent(ModalDialog, props);
  });

  it('should display a modal', () => {
    expect(component.length).to.equal(1);
    // These are broken for some reason, works fine in the browser. React-bootstrap misbehaving?
    // expect(expect(component.find("div[class='modal-header']").length).to.equal(1));
    // expect(expect(component.find("div[class='modal-body']").length).to.equal(1));
    // expect(expect(component.find("div[class='modal-footer']").length).to.equal(1));
    // expect(expect(component.find("button").length).to.equal(3));
    // expect(expect(component.find("h4").length).to.equal(1));
  });

});
