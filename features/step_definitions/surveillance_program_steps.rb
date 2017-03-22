Given(/^I have a Surveillance Program with the name "([^"]*)"$/) do |name|
  SurveillanceProgram.create!(name: name)
end
