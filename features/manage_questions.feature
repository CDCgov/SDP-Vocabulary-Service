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
    And I should see the option to Revise the Question with the content "What is your gender?"

  Scenario: Show Question in Detail
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Content: What is your gender?"
    Then I should see "Description: This is a question"

  Scenario: Comment on a Question in Detail
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Content: What is your gender?"
    And I fill in the "Your Comment" field with "Is This a Comment?"
    And I click on the "Post" button
    Then I should see "Is This a Comment?"

  Scenario: Revise Question
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I have a Response Type with the name "Response Set"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Revise the Question with the content "What is your gender?"
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a revised description"
    And I drag the "Gender Partial" option to the "Selected Response Sets" list
    And I select the "Response Set" option in the "Primary Response Type" list
    And I click on the "Revise Question" button
    And I should see "What is your favorite color?"
    And I should see "This is a revised description"

  Scenario: Create New Question from List
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" link
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a description"
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Type" list
    And I select the "Integer" option in the "Primary Response Type" list
    And I click on the "Create Question" button
    And I should see "What is your favorite color?"
    And I should see "This is a description"

  Scenario: Create New Question from List with Warning Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" link
    And I fill in the "Question" field with "What is your favorite animal?"
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Type" list
    And I select the "Integer" option in the "Primary Response Type" list
    When I go to the list of Questions
    And I click on the "Save & Leave" button
    And I should see "What is your favorite animal?"

  Scenario: Abandon New Question with Warning Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" link
    And I fill in the "Question" field with "What is your favorite animal?"
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Type" list
    And I select the "Integer" option in the "Primary Response Type" list
    When I go to the list of Questions
    And I click on the "Continue Without Saving" button
    And I should not see "What is your favorite animal?"

  Scenario: Reject Blank Question
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I have a Response Type with the name "Integer"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" link
    And I click on the "Create Question" button
    And I should see "content - can't be blank"

  Scenario: Delete Question
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Delete the Question with the content "What is your gender?"
    And I confirm my action
    #Then I should see "Question was successfully destroyed."
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
