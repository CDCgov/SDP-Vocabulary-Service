Given(/^a user "(.+)" exists$/) do |user_name|
  user = User.create!(email: user_name, password: 'password')
  Ability.new(user)
end

Then(/^a user "(.+)" should exist$/) do |user_email|
  user = User.find_by_email(user_email)
  assert_not_nil user
end
