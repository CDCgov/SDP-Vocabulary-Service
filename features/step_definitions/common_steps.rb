# Given clauses
Given(/^I am logged in as (.+)$/) do |user_name|
  user = User.create!(email: user_name, password: 'password')
  Ability.new(user)

  visit '/users/sign_in'
  fill_in('user_email', with: user_name)
  fill_in('user_password', with: 'password')
  click_on('Log in')
end

# When clauses
When(/^I click on the option to (.*) the (.+) with the (.+) "([^"]*)"$/) do |action, object_type, attribute, attribute_value|
  object_id = attribute_to_id(object_type, attribute, attribute_value)
  within('#id_' + object_id) do
    click_on(action)
  end
end

When(/^I fill in the "([^"]*)" field with "([^"]*)"$/) do |field_name, new_value|
  fill_in(field_name, with: new_value)
end

When(/^I click on the "([^"]*)" (button|link)$/) do |button_name, _button_or_link|
  # drop buttonorlink on floor because I don't care which it is
  click_on(button_name)
end

When(/^I confirm my action$/) do
  # So, apparently the poltergeist driver automatically accept/confirm/okays all alerts
  # Additionally, it doesn't support the code below, which is required when using selenium.
  # I'm torn on removing the step entirely, so I'm leaving it and this explanation for posterity.
  # page.driver.browser.switch_to.alert.accept
end

# Then clauses
Then(/^I should not see "([^"]*)"$/) do |value|
  page.assert_no_text(value)
end

Then(/^I should see "([^"]*)"$/) do |value|
  page.assert_text(value, minimum: 1)
end

Then(/^I should see the option to (.*) the (.+) with the (.+) "([^"]*)"$/) do |action, object_type, attribute, attribute_value|
  object_id = attribute_to_id(object_type, attribute, attribute_value)
  within('#id_' + object_id) do
    find_link(action)
  end
end

# Helper functions
def attribute_to_id(object_type, attribute, attribute_value)
  obj = nil
  if object_type == 'Response'
    obj = Response.find_by(attribute => attribute_value)
  elsif object_type == 'Response Set'
    obj = ResponseSet.find_by(attribute => attribute_value)
  elsif object_type == 'Question'
    obj = Question.find_by(attribute => attribute_value)
  elsif object_type == 'Question Type'
    obj = QuestionType.find_by(attribute => attribute_value)
  elsif object_type == 'Concept'
    obj = Concept.find_by(attribute => attribute_value)
  end
  obj.id.to_s
end
