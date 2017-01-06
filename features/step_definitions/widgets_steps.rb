Then(/^I should see a Form widget with the name "([^"]*)"$/) do |_name_value|
  page.find('.form-group')
end

Then(/^I should see a Question widget with the content "([^"]*)"$/) do |content_value|
  object_id = attribute_to_id('Question', :content, content_value)
  page.find("#question_#{object_id}_menu")
end

Then(/^I should see a Response Set widget with the name "([^"]*)"$/) do |_name_value|
  page.find('.response-set-list')
end
