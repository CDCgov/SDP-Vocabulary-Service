Then(/^I should see a Form widget with the name "([^"]*)"$/) do |name_value|
  object_id = attribute_to_id('Form', :name, name_value)
  page.find("#form_id_#{object_id}")
end

Then(/^I should see a Question widget with the content "([^"]*)"$/) do |content_value|
  object_id = attribute_to_id('Question', :content, content_value)
  page.find("#question_id_#{object_id}")
end

Then(/^I should see a Response Set widget with the name "([^"]*)"$/) do |name_value|
  object_id = attribute_to_id('Response Set', :name, name_value)
  page.find("#response_set_id_#{object_id}")
end
