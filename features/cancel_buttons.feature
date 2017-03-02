Feature: Cancel buttons
  As an author
  I want to be able to cancel out of what im doing and be warned appropriately
  Scenario: Cancel out of editing a draft question
    Given I am logged in as test_author@gmail.com
    And I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    And I click on the "Edit" button
    And I click on the "Cancel" button
    Then I should see "Question Details"
    And I should see "Name: What is your gender?"
    And I should see "Version: 1"
    And I should see "History"
    And I should see "Comments:"
    And I should not see "Revise Question"

  # Scenario: Cancel out of editing a draft form
  # Given I am logged in as test_author@gmail.com
  # Scenario: Cancel out of editing a draft response set
  # Given I am logged in as test_author@gmail.com

  Scenario: Cancel out of revising a question
    Given I am logged in as test_author@gmail.com
    And I have a published Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    And I click on the "Revise" button
    And I click on the "Cancel" button
    Then I should see "Question Details"
    And I should see "Name: What is your gender?"
    And I should see "Version: 1"
    And I should see "History"
    And I should see "Comments:"

  # Scenario: Cancel out of revising a form
  # Given I am logged in as test_author@gmail.com
  # Scenario: Cancel out of revising a response set
  # Given I am logged in as test_author@gmail.com

  Scenario: Cancel out of creating a new question
    Given I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" button  
    And I click on the "Cancel" button
    Then I should see "New Question"
    And I should see "Go!"

  # Scenario: Cancel out of creating a new form
  # Given I am logged in as test_author@gmail.com
  # Scenario: Cancel out of creating a new response set
  # Given I am logged in as test_author@gmail.com

  Scenario: Cancel out of editing a draft question with modal warning
    Given I am logged in as test_author@gmail.com
    Given I am logged in as test_author@gmail.com
    And I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    And I click on the "Edit" button
    And I fill in the "Description" field with "New description"
    And I click on the "Cancel" button
    Then I should see "Warning"
    And I should see "Unsaved Changes"
    When I click on the "Continue Without Saving" button
    Then I should see "Question Details"
    And I should see "Name: What is your gender?"
    And I should see "Version: 1"
    And I should see "History"
    And I should see "Comments:"

  # Scenario: Cancel out of editing a draft form with modal warning
  # Given I am logged in as test_author@gmail.com
  # Scenario: Cancel out of editing a draft response set with modal warning
  # Given I am logged in as test_author@gmail.com

  Scenario: Cancel out of revising a question with modal warning
    Given I am logged in as test_author@gmail.com
    Given I am logged in as test_author@gmail.com
    And I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    And I click on the "Edit" button
    And I fill in the "Description" field with "New description"
    And I click on the "Cancel" button
    Then I should see "Warning"
    And I should see "Unsaved Changes"
    When I click on the "Continue Without Saving" button
    Then I should see "Question Details"
    And I should see "Name: What is your gender?"
    And I should see "Version: 1"
    And I should see "History"
    And I should see "Comments:"

  # Scenario: Cancel out of revising a form with modal warning
  # Given I am logged in as test_author@gmail.com
  # Scenario: Cancel out of revising a response set with modal warning
  # Given I am logged in as test_author@gmail.com

  Scenario: Cancel out of creating a new question with modal warning
    Given I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the "New Question" button  
    And I fill in the "Description" field with "New description"
    And I click on the "Cancel" button
    Then I should see "Warning"
    And I should see "Unsaved Changes"
    When I click on the "Continue Without Saving" button
    Then I should see "New Question"
    And I should see "Go!"
 
  # Scenario: Cancel out of creating a new form with modal warning
  # Given I am logged in as test_author@gmail.com
  # Scenario: Cancel out of creating a new response set with modal warning
  # Given I am logged in as test_author@gmail.com
