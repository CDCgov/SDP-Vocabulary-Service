Given(/^a user "(.+)" exists$/) do |user_name|
  user = User.create!(email: user_name, password: 'password')
  Ability.new(user)
end

Then(/^a user "(.+)" should exist$/) do |user_email|
  user = User.find_by(email: user_email)
  assert_not_nil user
end

Then(/^a user "(.+)" should have a last Surveillance Program named "(.+)"$/) do |user_email, sp_name|
  user = User.find_by(email: user_email)
  assert_not_nil user
  assert_equal sp_name, user.last_program.name
end
