
# Given clauses
Given(/^I am logged in as (.+?)$/) do |user_name|
  user = User.create_with(password: 'password').find_or_create_by(email: user_name)
  Ability.new(user)
  group = Group.find_or_create_by(name: 'Group1')
  group.add_user(user)
  login_as(user, scope: :user)
end

Given(/^I am the publisher (.+)$/) do |user_name|
  user = User.create_with(password: 'password').find_or_create_by(email: user_name)
  Ability.new(user)
  user.add_role :publisher
  user.save
  user.reload
  login_as(user, scope: :user)
end

Given(/^I am the admin (.+)$/) do |user_name|
  user = User.create_with(password: 'password').find_or_create_by(email: user_name)
  Ability.new(user)
  user.add_role :admin
  user.save
  user.reload
  login_as(user, scope: :user)
end

Given(/^there is an admin with the email (.+)$/) do |user_name|
  user = User.create_with(password: 'password').find_or_create_by(email: user_name)
  Ability.new(user)
  user.add_role :admin
  user.save
  user.reload
end

Given(/^I have a publisher "(.+)" with the first name "(.+)" and last name "(.+)"$/) do |user_name, first_name, last_name|
  user = User.create_with(password: 'password').find_or_create_by(email: user_name, first_name: first_name, last_name: last_name)
  Ability.new(user)
  user.add_role :publisher
  user.save
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

Given(/^Disable user registration is "(.+)" and display login is "(.+)"/) do |dur, dl|
  Settings.display_login = dl == 'true'
  Settings.disable_user_registration = dur == 'true'
end

Given(/^User registration is "(.+)"/) do |dur|
  Settings.disable_user_registration = dur == 'disabled'
end

When(/^I go to the dashboard$/) do
  Elastictest.fake_all_search_results
  visit '/'
end

When(/^I expect an alert$/) do
  page.driver.browser.switch_to.alert.accept
end

When(/^I set search filter to "([^"]*)"$/) do |type|
  case type
  when 'question'
    Elastictest.fake_question_search_results
  when 'response_set'
    Elastictest.fake_rs_search_results
  when 'sections'
    Elastictest.fake_section_search_results
  when 'survey'
    Elastictest.fake_survey_search_results
  else
    Elastictest.fake_all_search_results
  end
end

When(/^I set search filter to "([^"]*)" without "([^"]*)"$/) do |type, name_filter|
  case type
  when 'question'
    Elastictest.fake_question_search_results
  when 'response_set'
    Elastictest.fake_rs_search_results
  when 'sections'
    Elastictest.fake_section_search_results_except(name_filter)
  when 'survey'
    Elastictest.fake_survey_search_results
  else
    Elastictest.fake_all_search_results
  end
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

When(/^I check the "([^"]*)" checkbox$/) do |name|
  check(name)
end

When(/^I fill in the "([^"]*)" field with "([^"]*)"$/) do |field_name, new_value|
  fill_in(field_name, with: new_value)
end

When(/^I click on the "([^"]*)" (button|link)$/) do |button_name, _button_or_link|
  # drop buttonorlink on floor because I don't care which it is
  click_on(button_name)
end

When(/^I click on the "([^"]*)" (button|link) and confirm my action$/) do |button_name, _button_or_link|
  # This step is meant to supplement the standard "click" step above and replace the combination
  # of it and the previous "I confirm my action" step, which did not work in a headless test.

  if !ENV['HEADLESS']
    click_on(button_name)
    page.driver.browser.switch_to.alert.accept
  else
    begin
      click_on(button_name)
    rescue Selenium::WebDriver::Error::UnhandledAlertError
      page.driver.browser.switch_to.alert.accept
    end
  end

end

When(/^I click on the create "([^"]*)" dropdown item$/) do |object_type|
  page.find('#create-menu').click
  page.find('.nav-dropdown-item', text: object_type).click
end

When(/^I select the "([^"]*)" option in the "([^"]*)" list$/) do |option, list|
  select(option, from: list)
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

Then(/^I should not see the "([^"]*)" link$/) do |value|
  begin
    find('a', text: value)
    raise "Should not have found #{value} link"
  rescue
    true
  end
end

Then(/^I should see the link "(.*?)" to "(.*?)"$/) do |link, url|
  find_link(link, href: url)
end

Then(/^I should get a download with the filename "([^\"]*)"$/) do |filename|
  page.response_headers['Content-Disposition'].index("filename=\"#{filename}\"")
end

# Quick little helper for popping a debugger, will cause tests to fail if left in
Then(/^debugger$/) do
  assert false
end

When(/^I drag the "([^"]*)" option to the "([^"]*)" list$/) do |option, target|
  drag = find('div', class: 'unlinked-result-name', text: option)
  target = '.' + target.downcase.tr(' ', '_')
  drop = find(target)
  drag.drag_to(drop)
end

Then(/^I press the key (.*)$/) do |key|
  key = key.to_sym if key.length > 1
  find('.body').send_keys(key)
end

Then(/^I select tag "([^"]*)" in the tag dropdown$/) do |tag|
  page.find('.tag-item', text: tag).click
end

Then(/^I press the (.*) key (.*) times$/) do |key, iterations|
  key = key.to_sym if key.length > 1
  iterations.to_i.times do
    find('.body').send_keys(key)
  end
end

Then(/^I press the keys (.*) and (.*)$/) do |key_one, key_two|
  key_one = key_one.to_sym if key_one.length > 1
  key_two = key_two.to_sym if key_two.length > 1
  find('.body').send_keys([key_one, key_two])
end

Then(/^"(.*)" should be my focus$/) do |element|
  page.evaluate_script('document.activeElement.id') == element
end

Then(/^I take a screenshot named (.*)$/) do |name|
  page.save_screenshot('/tmp/' + name + '.png')
end

Given(/^the user (.*) is a (.*)$/) do |user_email, role|
  user = User.find_by(email: user_email)
  user.add_role role.to_sym
  user.save
end

Then(/^the list "([^"]*)" should contain the option "([^"]*)"$/) do |list_name, option_text|
  assert page.has_select?(list_name, with_options: [option_text])
end

Then(/^the list "([^"]*)" should not contain the option "([^"]*)"$/) do |list_name, option_text|
  assert_not page.has_select?(list_name, with_options: [option_text])
end

def create_path(object_type, object_id)
  if object_type == 'Question'
    '//ul[@id="question_id_' + object_id + '"]'
  elsif object_type == 'Response Set'
    '//ul[@id="response_set_id_' + object_id + '"]'
  elsif object_type == 'Section'
    '//ul[@id="section_id_' + object_id + '"]'
  elsif object_type == 'Survey'
    '//ul[@id="survey_id_' + object_id + '"]'
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
  elsif object_type == 'Category'
    obj = Category.find_by(attribute => attribute_value)
  elsif object_type == 'Section'
    obj = Section.find_by(attribute => attribute_value)
  elsif object_type == 'Survey'
    obj = Survey.find_by(attribute => attribute_value)
  end
  obj.id.to_s
end
