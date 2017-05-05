Feature: Edit Forms
  As an author
  I want to edit Forms
  Scenario: Edit a Draft Form
    Given I have a Form with the name "Test Form" and the description "Form description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Details the Form with the name "Test Form"
    Then I should see "Test Form"
    Then I should see "Form description"
    When I click on the "Edit" link
    And I fill in the "name" field with "Edited Form"
    And I click on the "Save" button
    Then I should see "Name: Edited Form"
    Then I should see "Form description"
    And I should not see "Publish"
    And I should see "Edit"

  Scenario: Revise Form
    Given I have a published Form with the name "Test Form" and the description "Form description"
    And I have a published Question with the content "What is your gender?" and the type "MC"
    And I have a published Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Revise the Form with the name "Test Form"
    And I fill in the "name" field with "Gender Form"
    And I fill in the "description" field with "Revised Description"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    When I select the modify program variable option for the Question "What is your gender?"
    And I fill in the "program-var" field with "Test Var"
    And I click on the "Done" button
    And I should see "TEST VAR"
    And I click on the "Save" button
    Then I should see "Name: Gender Form"
    Then I should see "Revised Description"
    And I should see "What is your gender?"
    And I should not see "Publish"
    And I should see "Edit"
    And I should see "TEST VAR"

  Scenario: Extend Form
    Given I have a published Form with the name "Test Form" and the description "Description from parent"
    And I have a published Question with the content "What is your gender?" and the type "MC"
    And I have a published Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Extend the Form with the name "Test Form"
    And I fill in the "name" field with "Test Form Extended"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    And I click on the "Save" button
    Then I should see "Name: Test Form Extended"
    And I should see "Description from parent"
    And I should see "Extended from: Test Form"
    And I should see "What is your gender?"
    And I should not see "Publish"
    And I should see "Version: 1"
    And I should see "Edit"

  Scenario: Reorder Questions
    Given I have a published Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Question with the content "What is your name?" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Revise the Form with the name "Test Form"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    When I select the modify program variable option for the Question "What is your gender?"
    And I fill in the "program-var" field with "Test Var"
    And I click on the "Done" button
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your name?"
    And I move the Question "What is your name?" up
    And I should see "TEST VAR"
    And I click on the "Save" button
    And I should see "What is your gender?"
    Then I wait 1 seconds
    And I should see the question "What is your name?" first
    And I should see the response set "Gender Partial" second
    And I should see "TEST VAR"

  Scenario: Create New Form from List and Create a Question using New Question Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I fill in the "controlNumber" field with "1234-1234"
    And I fill in the "description" field with "Form description"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Full"
    And I click on the "Add New Question" button
    And I fill in the "Question" field with "What is your favorite color?"
    And I select the "Open Choice" option in the "Response Type" list
    And I fill in the "question_description" field with "This is a description"
    And I should see "No Response Sets selected"
    Then I select the "Text" option in the "Response Type" list
    And I should not see "No Response Sets selected"
    And I click on the "Add Question" button
    And I click on the "Save" button
    Then I should see "Test Form"
    And I should see "What is your gender?"
    And I should see "What is your favorite color?"

  Scenario: Create New Form from List and Create a Response Set using New Response Set Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I fill in the "controlNumber" field with "1234-1234"
    And I fill in the "description" field with "Form description"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    Then I click on the "Add New Response Set" button
    Then I fill in the "response_set_name" field with "New Response Set"
    And I click on the "Add Response Set" button
    Then I wait 1 seconds
    And I use the response set search modal to select "New Response Set"
    And I click on the "Save" button
    Then I should see "Test Form"
    And I should see "What is your gender?"

  Scenario: Show warning modal after adding question
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Forms" dropdown item
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    When I click on the "CDC Vocabulary Service" link
    Then I should see "Unsaved Changes"

  Scenario: Create New Form from List with warning modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I fill in the "controlNumber" field with "1234-1234"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    And I wait 1 seconds
    And I go to the dashboard
    Then I should see "Test Form"

  Scenario: Abandon New Form from List with warning modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I fill in the "controlNumber" field with "1234-1234"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Continue Without Saving" button
    When I go to the list of Forms
    Then I should not see "Test Form"

  Scenario: An invalid control number should not allow save
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I fill in the "controlNumber" field with "1234"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Full"
    And I click on the "Save" button
    Then I should see "error(s) prohibited this form from being saved"
    And I should see "controlNumber - must be a valid OMB Control Number"
