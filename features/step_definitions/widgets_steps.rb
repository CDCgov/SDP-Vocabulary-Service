Then(/^I should see a Form widget with the name "([^"]*)"$/) do |arg1|
  within(:xpath, '//div[@class="form-group"]') do
    find(:xpath, 'li[a="' + arg1 + '"]')
  end
end

Then(/^I should see a Question widget with the content "([^"]*)"$/) do |_arg1|
  within(:xpath, '//div[@class="question-group"]') do
  end
end

Then(/^I should see a Response Set widget with the name "([^"]*)"$/) do |_arg1|
  within(:xpath, '//div[@class="response-set-list"]') do
    find(:xpath, 'div')
  end
end
