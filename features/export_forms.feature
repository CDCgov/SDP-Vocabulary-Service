Feature: Export Forms
  As an author
  I want to export Forms from the application
  Scenario: Export Form
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial" and the description "Gender example" and with the Responses Male, Female
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I fill in the "search" field with "What"
    And I click on the "Add to Form" drop-down option for "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    And I click on the "Save" button

  Scenario: Export Form to Redcap
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial" and the description "Gender example" and with the Responses Male, Female
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I fill in the "search" field with "What"
    And I click on the "Add to Form" drop-down option for "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    And I click on the "Save" button
    Then I should see the "Export to Redcap" link
