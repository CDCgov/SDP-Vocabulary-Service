Given(/^I have a Notification with the message "([^"]*)" and the url "([^"]*)"$/) do |message, url|
  user = get_user('test_author@gmail.com')
  Notification.create!(user_id: user.id, url: url, message: message)
end

When(/^I click on the "([^"]*)" notification$/) do |message|
  page.find('.notification-menu-item', text: message).trigger('click')
end

Then(/^I should see "([^"]*)" new notifications$/) do |value|
  page.find('.alerts-badge').assert_text(value, minimum: 1)
end

Then(/^I should see no new notifications$/) do
  assert page.has_no_css?('.alerts-badge')
end
