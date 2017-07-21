import { expect, renderComponent } from '../test_helper';
import NotificationDropdown from '../../../webpack/containers/NotificationDropdown';

describe('NotificationDropdown', () => {
  let component;

  beforeEach(() => {
    const notifications = [{id: 1, message: "X commented on your question", url: "/question/1", read: false},
                            {id: 2, message: "Y replyed to your comment", url: "/question/2", read: false},
                            {id: 3, message: "X liked your photo", url: "/question/3", read: false}];
    const notificationCount = 3;
    component = renderComponent(NotificationDropdown, {notifications, notificationCount});
  });

  it('should create a notification dropdown with a badge', () => {
    expect(component.find("span[class='alerts-badge']")).to.contain('3');
  });

});
