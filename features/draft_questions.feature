Feature: Draft, Publish, and Revise Questions
  As an author
  I want to draft, edit, publish, and revise Questions
  Scenario: Create a draft Question
    Given I have a Response Set with the name "Gender Full"
    And I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the create "Questions" dropdown item
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a description"
    And I drag the "Gender Full" option to the "Selected Response Sets" list
    And I select the "Multiple Choice" option in the "Category" list
    And I click on the "Create Question" button
    Then I should see "What is your favorite color?"
    And I should see "This is a description"
    And I should see "Edit"
    And I should see "Publish"

  Scenario: Edit a draft Question
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "What is your gender?"
    And I should see "Description: This is a question"
    And I should see "Edit"
    When I click on the "Edit" button
    And I fill in the "Description" field with "This is NOT a good description"
    And I click on the "Edit" button
    Then I should see "What is your gender?"
    And I should see "Description: This is NOT a good description"
    And I should see "Version: 1"
    And I should not see "Version: 2"
    And I should see "Edit"
    And I should see "Publish"

  Scenario: Publish a Question via Show
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    Then I should see "What is your gender?"
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Edit"
    And I should see "Publish"
    When I click on the "Publish" button
    # The next few steps are necessary for *only* this test for some reason, the UI responds normally to the redirect
    And I go to the list of Questions
    Then I should see "What is your gender?"
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "What is your gender?"
    And I should see "Revise"
    And I should not see "Edit"
    And I should not see "Publish"

  Scenario: Revise a published question
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    And I click on the "Edit" button
    And I click on the "Publish" button
    Then I should see "What is your gender?"
    And I should see "Revise"
    When I click on the "Revise" button
    And I fill in the "Description" field with "This is a description"
    And I click on the "Revise" button
    Then I should see "What is your gender?"
    And I should see "Description: This is a description"
    And I should see "Version: 2"
    And I should see "Edit"
    And I should see "Publish"
