
# Given clauses
Given(/^I am logged in as (.+)$/) do |user_name|
  user = User.create_with(password: 'password').find_or_create_by(email: user_name)
  Ability.new(user)
  login_as(user, scope: :user)
end

Given(/^I am working the program "(.+)" and system "(.+)" logged in as (.+)$/) do |program_name, system_name, user_name|
  user = User.create_with(password: 'password').find_or_create_by(email: user_name)
  Ability.new(user)
  login_as(user, scope: :user)
  last_program = SurveillanceProgram.where(name: program_name).first
  last_system = SurveillanceSystem.where(name: system_name).first
  user.last_program = last_program
  user.last_system = last_system
  user.save!
end

# TODO: This should really use url helpers so you could say 'sign in' instead of '/users/sign_in'
Given(/^I am on the "(.+)" page$/) do |url|
  visit url
end

When(/^I go to the dashboard$/) do
  Elastictest.fake_all_search_results
  visit '/'
end

When(/^I expect an alert$/) do
  page.driver.browser.switch_to.alert.accept
end

Then(/^I wait (\d+) seconds$/) do |seconds|
  sleep seconds.to_i
end

# When clauses
When(/^I click on the option to (.*) the (.+) with the (.+) "([^"]*)"$/) do |action, object_type, attribute, attribute_value|
  object_id = attribute_to_id(object_type, attribute, attribute_value)
  # '//tr[td="id_' + object_id + '"]/td[a="Destroy"]/a'
  within(:xpath, create_path(object_type, object_id)) do
    click_on(action)
  end
end

When(/^I click on the (.*) search filter$/) do |action|
  page.find("#menu_item_#{action}").click
end

When(/^I fill in the "([^"]*)" field with "([^"]*)"$/) do |field_name, new_value|
  fill_in(field_name, with: new_value)
end

When(/^I click on the "([^"]*)" (button|link)$/) do |button_name, _button_or_link|
  # drop buttonorlink on floor because I don't care which it is
  click_on(button_name)
end

When(/^I click on the create "([^"]*)" dropdown item$/) do |object_type|
  page.find('#create-menu').click
  page.find('.nav-dropdown-item', text: object_type).click
end

When(/^I select the "([^"]*)" option in the "([^"]*)" list$/) do |option, list|
  select(option, from: list)
end

When(/^I confirm my action$/) do
  # So, apparently the poltergeist driver automatically accept/confirm/okays all alerts
  # Additionally, it doesn't support the code below, which is required when using selenium.
  # I'm torn on removing the step entirely, so I'm leaving it and this explanation for posterity.

  page.driver.browser.switch_to.alert.accept unless ENV['HEADLESS']
end

# Then clauses
Then(/^I should not see "([^"]*)"$/) do |value|
  page.assert_no_text(value)
end

Then(/^I should see "([^"]*)"$/) do |value|
  page.assert_text(value, minimum: 1)
end

Then(/^I should not see a "([^"]*)" link$/) do |value|
  assert page.has_no_link?(value)
end

Then(/^I should see the option to (.*) the (.+) with the (.+) "([^"]*)"$/) do |action, object_type, attribute, attribute_value|
  object_id = attribute_to_id(object_type, attribute, attribute_value)
  within(:xpath, create_path(object_type, object_id)) do
    find_link(action)
  end
end

Then(/^I should not see the option to (.*) the (.+) with the (.+) "([^"]*)"$/) do |action, object_type, attribute, attribute_value|
  object_id = attribute_to_id(object_type, attribute, attribute_value)
  within(:xpath, create_path(object_type, object_id)) do
    page.has_no_link?(action)
  end
end

Then(/^I should see the "([^"]*)" link$/) do |value|
  find('a', text: value)
end

Then(/^I should get a download with the filename "([^\"]*)"$/) do |filename|
  page.response_headers['Content-Disposition'].index("filename=\"#{filename}\"")
end

# Quick little helper for popping a debugger, will cause tests to fail if left in
Then(/^debugger$/) do
  assert false
end

When(/^I drag the "([^"]*)" option to the "([^"]*)" list$/) do |option, target|
  drag = find('a', text: option)
  target = '.' + target.downcase.tr(' ', '_')
  drop = find(target)
  drag.drag_to(drop)
end

Then(/^I take a screenshot named (.*)$/) do |name|
  page.save_screenshot('/tmp/' + name + '.png')
end

def create_path(object_type, object_id)
  if object_type == 'Question'
    '//div[@id="question_id_' + object_id + '"]'
  elsif object_type == 'Response Set'
    '//div[@id="response_set_id_' + object_id + '"]'
  elsif object_type == 'Form'
    '//div[@id="form_id_' + object_id + '"]'
  elsif object_type == 'Survey'
    '//div[@id="survey_id_' + object_id + '"]'
  else
    '//tr[td="id_' + object_id + '"]'
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
  elsif object_type == 'Form'
    obj = Form.find_by(attribute => attribute_value)
  elsif object_type == 'Survey'
    obj = Survey.find_by(attribute => attribute_value)
  end
  obj.id.to_s
end
