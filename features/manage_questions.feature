Feature: Manage Questions
  As an author
  I want to create and manage Questions
  Scenario: Question List View
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    Then I should see "What is your gender?"
    And I should see the option to Destroy the Question with the content "What is your gender?"
    And I should see the option to Details the Question with the content "What is your gender?"
    And I should see the option to Edit the Question with the content "What is your gender?"

  Scenario: Show Question in Detail
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Content: What is your gender?"

  Scenario: Edit Question
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the option to Edit the Question with the content "What is your gender?"
    And I fill in the "Content" field with "What is your favorite color?"
    And I select the "Gender Partial" option in the "Response Set" list
    And I click on the "Update Question" button
    Then I should see "Question was successfully updated."
    And I should see "What is your favorite color?"
  
  Scenario: Create New Question from List
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" link
    And I fill in the "Content" field with "What is your favorite color?"
    And I select the "Gender Full" option in the "Response Set" list
    And I select the "Multiple Choice" option in the "Question Type" list
    And I click on the "Create Question" button
    Then I should see "Question was successfully created."
    And I should see "What is your favorite color?"
  
  Scenario: Destroy Question
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the option to Destroy the Question with the content "What is your gender?"
    And I confirm my action
    Then I should see "Question was successfully destroyed."
    And I should not see "Male"
