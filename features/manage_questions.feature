Feature: Manage Questions
  As an author
  I want to create and manage Questions
  Scenario: Question List View
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    Then I should see "What is your gender?"
    When I click on the menu link for the Question with the content "What is your gender?"
    Then I should see the option to Details the Question with the content "What is your gender?"
    And I should see the option to Edit the Question with the content "What is your gender?"
    And I should not see the option to Edit the Question with the content "What is your gender?"

  Scenario: Show Question in Detail
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    Then I should see "Description: This is a question"
    Then I should see "New Concept Name"

  Scenario: Show Question in Detail No Concepts
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    Then I should see "Description: This is a question"
    Then I should see "No Concepts Selected"

  Scenario: Comment on a Question in Detail
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    And I fill in the "Your Comment" field with "Is This a Comment?"
    And I click on the "Post" button
    Then I should see "Is This a Comment?"

  Scenario: Revise Question
    Given I have a published Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I have a Response Set with the name "Gender Partial"
    And I have a Response Type with the name "Response Set"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Revise the Question with the content "What is your gender?"
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a revised description"
    And I check the harmonized box
    And I drag the "Gender Partial" option to the "Selected Response Sets" list
    And I select the "Response Set" option in the "Primary Response Type" list
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    And I click on the "Save" button
    And I should see "What is your favorite color?"
    And I should see "This is a revised description"
    And I should see "Harmonized: Yes"
    And I should not see "New Concept Name"
    And I should see "Test Concept 2"

  Scenario: Extend Question
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I am logged in as test_author@gmail.com
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

  Scenario: Create New Question from List and Create a Response Set using New Response Set Modal
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a description"
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    Then I click on the "Add New Response Set" button
    Then I fill in the "response_set_name" field with "New Response Set"
    And I click on the "Add Response Set" button
    Then I should see "New Response Set"
    And I click on the "Save" button
    And I should see "What is your favorite color?"
    And I should see "New Response Set"

  Scenario: Create New Question from List with Warning Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite animal?"
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Category" list
    And I select the "Integer" option in the "Primary Response Type" list
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Concept 1"
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    Then I go to the dashboard
    When I go to the list of Questions
    And I should see "What is your favorite animal?"

  Scenario: Abandon New Question with Warning Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite animal?"
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Category" list
    And I select the "Integer" option in the "Primary Response Type" list
    And I fill in the "value_0" field with "Test Concept 1"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Continue Without Saving" button
    When I go to the list of Questions
    And I should not see "What is your favorite animal?"

  Scenario: Reject Blank Question
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the create "Questions" dropdown item
    And I click on the "Save" button
    And I should see "content - can't be blank"

  Scenario: Search for a Question on Dashboard
    Given I have a Question with the content "Why?" and the type "MC"
    And I have a Question with the content "What?" and the type "MC"
    And I have a Response Set with the name "Reasons why"
    When I go to the dashboard
    And I fill in the "search" field with "why"
    And I click on the "search-btn" button
    Then I should see "Why"
    And I should see "Reasons"

   Scenario: Delete a Question
    Given I have a Question with the content "Test Question" and the description "Question description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "Test Question"
    And I click on the option to Details the Question with the content "Test Question"
    When I click on the "Delete" link
    When I confirm my action
    Then I go to the dashboard
    When I go to the list of Questions
    Then I should not see "Test Question"
