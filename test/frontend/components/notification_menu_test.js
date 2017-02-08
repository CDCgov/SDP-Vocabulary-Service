import { expect, renderComponent } from '../test_helper';
import NotificationMenu from '../../../webpack/components/NotificationMenu';

describe('NotificationMenu', () => {
  let component;

  beforeEach(() => {
    const notifications = [{id: 1, message: "X commented on your question", url: "/question/1", read: false},
                            {id: 2, message: "Y replyed to your comment", url: "/question/2", read: false},
                            {id: 3, message: "X liked your photo", url: "/question/3", read: false}];
    component = renderComponent(NotificationMenu, {notifications});
  });

  it('should create list of notifications', () => {
    expect(component.find("li[class='notification-menu-item']").length).to.equal(3);
  });

});
