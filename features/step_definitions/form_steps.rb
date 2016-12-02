Given(/^I have a Form with the name "([^"]*)"$/) do |name|
  Form.create!(name: name)
end

When(/^I go to the list of Forms$/) do
  visit '/forms'
end

When(/^I click on the link to add the Question "([^"]*)"$/) do |question_content|
  local_id = Question.search(question_content).first.id.to_s
  node = find('div[data-question-id="' + local_id + '"]')
  tr = node.find('.btn')
  # Not sure how to get this last bit working:
  tr.click_button('.')
end
