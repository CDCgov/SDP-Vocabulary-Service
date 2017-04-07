Feature: Widget Display
  As a user
  I want to see information about objects in a concise widget

  Scenario: View Question Widget
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    Then I should see "What is your gender?"
    And I should see "This is a question"
    And I should see "DRAFT"
    And I should see "Linked Response Sets: 0"

  Scenario: View response set widget and test collapsable responses
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    Then I should see "Gender Full"
    And I should see "Response set description"
    And I should see "Responses: 1"
    And I should not see "Original Response"
    When I click on the "Responses: 1" link
    Then I should see "Original Response"

  Scenario: View Form Widget
    Given I have a Form with the name "Test Form" and the description "Form description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    Then I should see "Test Form"
    And I should see "Form description"
    And I should see "Questions: 0"
    And I should see "DRAFT"
    And I should not see "PUBLISHED"

  Scenario: View Survey Widget
    Given I have a published Survey with the name "Test Survey" and the description "Survey description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    Then I should see "Test Survey"
    And I should see "Survey description"
    And I should see "Forms: 0"
    And I should see "PUBLISHED"
    And I should not see "DRAFT"
