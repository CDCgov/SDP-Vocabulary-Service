Given(/^I have a Response Set with the name "([^"]*)" linked to Surveillance System "([^"]*)"$/) do |set_name, system_name|
  user = get_user 'test_author@gmail.com'
  ss = SurveillanceSystem.where(name: system_name).first
  rs = ResponseSet.where(name: set_name).first
  rs.update_attribute(:status, 'published')
  rt = ResponseType.where(code: 'choice').first
  q = Question.new(content: 'test', response_type_id: rt.id, created_by: user)
  q.response_sets << rs
  q.save!
  f = Section.new(name: 'test', created_by: user)
  f.section_questions << SectionQuestion.new(question: q, response_set: rs, position: 1)
  f.save!
  survey = Survey.new(name: 'test', surveillance_system: ss, created_by: user)
  survey.survey_sections << SurveySection.new(section: f, position: 1)
  survey.save!
end

Given(/^I have a Response Set with the name "([^"]*)" and the description "([^"]*)" and\
 the response "([^"]*)"$/) do |set_name, desc, response|
  user = get_user 'test_author@gmail.com'
  ResponseSet.create!(name: set_name, description: desc, version: 1, created_by: user,\
                      responses_attributes: [{ value: '', display_name: response, code_system: '' }])
end

Given(/^I have a Response Set with the name "([^"]*)" and the description "([^"]*)" and \
with the Responses (.+)$/) do |set_name, desc, response_values|
  user = get_user 'test_author@gmail.com'
  set = ResponseSet.create!(name: set_name, description: desc, version: 1, created_by: user)
  response_values.split(', ').each do |value|
    Response.create!(value: value, response_set_id: set['id'])
  end
end

Given(/^I have a Response Set with the name "([^"]*)" and the description "([^"]*)"$/) do |set_name, desc|
  user = get_user 'test_author@gmail.com'
  ResponseSet.create!(name: set_name, description: desc, version: 1, created_by: user)
end

When(/^I go to the list of Response Sets$/) do
  Elastictest.fake_rs_search_results
  visit '/'
  page.find('button[id="response-sets-analytics-item"]').click
end

Given(/^I have a Response Set with the name "([^"]*)"$/) do |set_name|
  user = get_user 'test_author@gmail.com'
  ResponseSet.create!(name: set_name, version: 1, created_by: user)
end

When(/^I click on the link to remove the Response "([^"]*)" in row number (.+)$/) do |response_name, row|
  node = find('input[value="' + response_name + '"]')
  tr = node.find(:xpath, '../../..')
  tr.click_on('Delete row number ' + row)
end
When(/^I click on the menu link for the Response Set with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Response Set', attribute, attribute_value)
  page.find("#response_set_#{object_id}_menu").click
end
