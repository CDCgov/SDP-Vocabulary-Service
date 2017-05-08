Feature: Edit Questions
  As an author
  I want to edit Questions
  Scenario: Revise Question
    Given I have a published Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Revise the Question with the content "What is your gender?"
    And I fill in the "Question" field with "What is your favorite color?"
    And I select the "Open Choice" option in the "Response Type" list
    And I fill in the "Description" field with "This is a revised description"
    And I drag the "Gender Partial" option to the "Selected Response Sets" list
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    And I click on the "Save" button
    And I should see "What is your favorite color?"
    And I should see "This is a revised description"
    And I should not see "New Concept Name"
    And I should see "Test Concept 2"

  Scenario: Extend Question
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I am the publisher test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    And I click on the "Publish" button
    And I click on the "Extend" button
    And I fill in the "Description" field with "This is an extended description"
    And I click on the "Save" button
    Then I should see "Version: 1"
    And I should see "Extended from: What is your gender?"
    And I should see "New Concept"
    And I should see "This is an extended description"
    And I should not see "This is a question"

  Scenario: Create New Question from List, test rs add button, and Create a Response Set using New Response Set Modal
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a description"
    And I select the "Open Choice" option in the "Response Type" list
    And I click on the "select-Gender Full" link
    Then I click on the "Add New Response Set" button
    Then I fill in the "response-set-name" field with "New Response Set"
    And I click on the "Add Response Set" button
    Then I should see "New Response Set"
    And I click on the "Save" button
    And I should see "What is your favorite color?"
    And I should see "New Response Set"

  Scenario: Test rs add button doesn't allow you to add multiple of the same causing errors
    Given I have a Response Set with the name "Colors"
    And I have a Response Set with the name "More colors"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a description"
    And I select the "Open Choice" option in the "Response Type" list
    And I click on the "select-Colors" link
    And I click on the "select-More colors" link
    And I click on the "select-More colors" link
    Then I should only see 1 copy of the "More colors" response set associated

  Scenario: Create New Question from List with Warning Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite animal?"
    And I select the "Open Choice" option in the "Response Type" list
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Category" list
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Concept 1"
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    Then I go to the dashboard
    When I go to the list of Questions
    And I should see "What is your favorite animal?"

  Scenario: Create New Question that does not use a response set
    And I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What time is it?"
    And I select the "Instant" option in the "Response Type" list
    And I click on the "Save" button
    Then I go to the dashboard
    When I go to the list of Questions
    And I should see "What time is it?"

  Scenario: Should toggle ability to see response sets based on response type selection
    And I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What time is it?"
    And I select the "Instant" option in the "Response Type" list
    Then I should not see "Response Sets"
    And I select the "Open Choice" option in the "Response Type" list
    Then I should see "Response Sets"

  Scenario: Abandon New Question with Warning Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite animal?"
    And I select the "Open Choice" option in the "Response Type" list
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Category" list
    And I fill in the "value_0" field with "Test Concept 1"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Continue Without Saving" button
    When I go to the list of Questions
    And I should not see "What is your favorite animal?"

  Scenario: Reject Blank Question
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the create "Questions" dropdown item
    And I click on the "Save" button
    And I should see "content - can't be blank"
