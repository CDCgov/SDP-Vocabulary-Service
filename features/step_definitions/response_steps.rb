Given(/^I have responses with the values (.+)$/) do |values|
  values.split(', ').each do |value|
    Response.create!(value: value)
  end
end

Given(/^I am logged in as (.+)$/) do |username|
  user = User.new
  user.email = username
  user.password = 'password'
  user.save
  Ability.new(user)

  visit '/users//sign_in'
  fill_in('user_email', with: username)
  fill_in('user_password', with: 'password')
  click_on('Log in')
end

When(/^I go to the list of responses$/) do
  visit('/responses')
end

Then(/^I should see "([^"]*)"$/) do |value|
  page.assert_text(value, minimum: 1)
end

Then(/^I should see the option to (.*) "([^"]*)"$/) do |action, object|
  within('tr#' + object.delete(' ')) do
    has_link?(action)
  end
end
