Feature: Manage Questions
  As an author
  I want to create and manage Questions
  Scenario: Question List View
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    Then I should see "What is your gender?"
    When I click on the menu link for the Question with the content "What is your gender?"
    Then I should see the option to Delete the Question with the content "What is your gender?"
    And I should see the option to Details the Question with the content "What is your gender?"
    And I should see the option to Revise the Question with the content "What is your gender?"

  Scenario: Show Question in Detail
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Content: What is your gender?"

  Scenario: Revise Question
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I have a Response Type with the name "Response Set"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Revise the Question with the content "What is your gender?"
    And I fill in the "Question" field with "What is your favorite color?"
    And I select the "Gender Partial" option in the "Response Set" list
    And I select the "Response Set" option in the "Primary Response Type" list
    And I click on the "Revise Question" button
    Then I should see "Question was successfully revised."
    And I should see "What is your favorite color?"

  Scenario: Create New Question from List
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" link
    And I fill in the "Question" field with "What is your favorite color?"
    And I select the "Gender Full" option in the "Response Set" list
    And I select the "Multiple Choice" option in the "Question Type" list
    And I select the "Integer" option in the "Primary Response Type" list
    And I click on the "Create Question" button
    Then I should see "Question was successfully created."
    And I should see "What is your favorite color?"

  Scenario: Delete Question
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Delete the Question with the content "What is your gender?"
    And I confirm my action
    Then I should see "Question was successfully destroyed."
    And I should not see "Male"

  Scenario: Search for a Question
    Given I have a Question with the content "Cat?" and the type "MC"
    And I have a Question with the content "Hat?" and the type "MC"
    And I have a Question with the content "Fat?" and the type "MC"
    And I have a Question with the content "Cancer?" and the type "MC"
    And I have a Question with the content "Broken Legs?" and the type "MC"
    When I go to the list of Questions
    And I fill in the "search" field with "at"
    And I click on the "Go!" button
    Then I should see "Cat?"
    And I should see "Hat?"
    And I should see "Fat?"
    And I should not see "Cancer?"
    And I should not see "Broken Legs?"

  Scenario: Search for a Question on Dashboard
    Given I have a Question with the content "Why?" and the type "MC"
    And I have a Question with the content "What?" and the type "MC"
    And I have a Response Set with the name "Reasons why"
    When I go to the dashboard
    And I fill in the "search" field with "why"
    And I click on the "search-btn" button
    Then I should see "Why?"
    And I should see "Reasons"
    And I should not see "What?"

  Scenario: Filter for Questions on Dashboard
    Given I have a Question with the content "Why?" and the type "MC"
    And I have a Question with the content "What?" and the type "MC"
    And I have a Response Set with the name "Reasons why"
    When I go to the dashboard
    And I click on the "search-group-btn" button
    And I click on the questions search filter
    And I fill in the "search" field with "why"
    And I click on the "search-btn" button
    Then I should see "Why?"
    And I should not see "Reasons"
    And I should not see "What?"
