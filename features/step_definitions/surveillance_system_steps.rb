Given(/^I have a Surveillance System with the name "([^"]*)"$/) do |name|
  SurveillanceSystem.create!(name: name)
end
