# Given clauses
Given(/^I have Responses with the values (.+)$/) do |values|
  values.split(', ').each do |value|
    Response.create!(value: value)
  end
end

Given(/^I have the Responses: (.+)$/) do |args|
  args.split('; ').each do |response|
    val_and_set = response.split(', ')
    Response.create!(value: val_and_set[0], response_set_id: val_and_set[1])
  end
end

Then(/^I should see a Response with the value "([^"]*)" and a Response Set ID of "([^"]*)"$/) do |value, rsid|
  within('#' + value.delete(' ')) do
    assert_text(rsid)
  end
end

# When clauses
When(/^I go to the list of Responses$/) do
  visit('/responses')
end
