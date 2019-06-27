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
    And I fill in the "Tags" field with "TagTest1"
    And I tab out of the "Tags" field
    And I click on the "select-Gender Partial" link
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    And I click on the "Add Row" link
    And I fill in the "displayName_1" field with "New"
    And I select tag "New Concept Name" in the tag dropdown
    And I click on the "Save" button
    And I should see "What is your favorite color?"
    And I should see "This is a revised description"
    And I should see "New Concept Name"
    And I should see "Test Concept 2"
    And I should see "TagTest1"

  Scenario: Extend Question
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I am the publisher test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    When I click on the "Change History" link
    And I wait 1 seconds
    Then I should see "No changes have been made to this version."
    And I should not see "Changes by"
    When I click on the "Publish" button
    Then I should see "This action cannot be undone"
    When I click on the "Confirm Publish" link
    And I wait 1 seconds
    Then I click on the "Change History" link
    And I wait 1 seconds
    Then I should see "Changes by test_author@gmail.com"
    And I should see "field changed from"
    And I should not see "No changes have been made to this version."
    And I click on the "Extend" button
    And I fill in the "Description" field with "This is an extended description"
    And I click on the "Save" button
    And I wait 1 seconds
  # Then I should see "Version: 1"
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
    When I click on the "Author Recommended Response Sets" link
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
    Then I should not see "select-More colors"
    And I should see "Result Already Added"
    Then I should only see 1 copy of the "More colors" response set associated

  Scenario: Create New Question from List with Warning Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Category with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite animal?"
    And I select the "Open Choice" option in the "Response Type" list
    And I select the "Record review" option in the "Data Collection Method" list
    And I click on the "select-Gender Full" link
    And I select the "Multiple Choice" option in the "Category" list
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Concept 1"
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    And I wait 2 seconds
    Then I go to the dashboard
    When I go to the list of Questions
    And I should see "What is your favorite animal?"
    When I click on the menu link for the Question with the content "What is your favorite animal?"
    And I click on the option to Details the Question with the content "What is your favorite animal?"
    And I should see "Data Collection Methods"
    And I should see "Record review"

  Scenario: Create New Question that does not use a response set
    And I have a Category with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What time is it?"
    And I select the "Instant" option in the "Response Type" list
    And I click on the "Save" button
    And I wait 2 seconds
    Then I go to the dashboard
    When I go to the list of Questions
    And I should see "What time is it?"

  Scenario: Should toggle ability to see response sets based on response type selection
    And I have a Category with the name "Multiple Choice"
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
    And I have a Category with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite animal?"
    And I select the "Open Choice" option in the "Response Type" list
    And I click on the "select-Gender Full" link
    And I select the "Multiple Choice" option in the "Category" list
    And I fill in the "value_0" field with "Test Concept 1"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Continue Without Saving" button
    When I go to the list of Questions
    And I should not see "What is your favorite animal?"

  Scenario: Reject Blank Question
    Given I have a Response Set with the name "Gender Full"
    And I have a Category with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the create "Questions" dropdown item
    And I click on the "Save" button
    And I should see "content - can't be blank"

  Scenario: Suggest Duplicate Questions
    Given I have a Question with the content "What is your favorite color?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    Then I should see "Create Question"
    And I should not see "Suggested Existing Questions for Reuse"
    Then I fill in the "Question" field with "What is your favorite animal?"
    Then I should see "What is your favorite color?"

  Scenario: Question added to group should show up in version history
    Given I have a published Question with the content "What is your gender?"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Revise the Question with the content "What is your gender?"
    And I fill in the "Question" field with "What is your gender? (revised)"
    And I click on the "Save" button
    Then I should see "What is your gender? (revised)"
    When I click on the "Groups" button
    Then I should see "Group1"
    And I should see "None"
    When I click on the "Click to add content to the Group1 group" button
    And I click on the "Groups" button
    Then I should see "Group1"
    When I click on the "Version 1" link
  # Then I should see "Version 2"
    When I am logged in as new_user_in_group1@gmail.com
    And I go to the dashboard
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
  # Then I should see "Version 2"
