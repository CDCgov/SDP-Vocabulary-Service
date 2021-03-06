Feature: Edit Sections
  As an author
  I want to edit Sections
  Scenario: Edit a Draft Section
    Given I have a Section with the name "Test Section" and the description "Section description" and the concept "Healthcare Concept"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Details the Section with the name "Test Section"
    Then I should see "Test Section"
    And I should see "Section description"
    And I should see "Healthcare Concept"
    When I click on the "Edit" link
    And I fill in the "section-name" field with "Edited Section"
    And I fill in the "Tags" field with "TagTest1"
    And I tab out of the "Tags" field
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Concept 1"
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    And I fill in the "save-with-comment" field with "Testing comment functionality on edit"
    And I click on the "Save" button
    Then I should see "Name: Edited Section"
    Then I should see "Section description"
    And I should see "TagTest1"
    And I should see "Test Concept 2"
    And I should not see "Test Concept 1"
    When I click on the "Change History" link
    Then I should see "Notes / Comments: Testing comment functionality on edit"
    Then I should see "Changes by test_author@gmail.com"
    And I should see "field changed from"
    And I should not see "Publish"
    And I should see "Edit"

  Scenario: Revise Section
    Given I have a published Section with the name "Test Section" and the description "Section description"
    And I have a published Section with the name "Nested Section" and the description "Nested section description"
    And I have a published Question with the content "What is your gender?" and the type "MC"
    And I have a published Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Revise the Section with the name "Test Section"
    And I fill in the "section-name" field with "Gender Section"
    And I fill in the "section-description" field with "Revised Description"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    When I select the add program variable option for the Question "What is your gender?"
    And I fill in the "program-var" field with "Test Var"
    And I click on the "Done" button
    And I should see "TEST VAR"
    When I select the modify program variable option for the Question "What is your gender?"
    And I fill in the "program-var" field with "Test Var Edit"
    And I click on the "Done" button
    And I should see "TEST VAR EDIT"
    And I set search filter to "sections" without "Test Section"
    And I fill in the "search" field with "Nest"
    And I click on the "search-btn" button
    And I use the section search to select "Nested Section"
    And I click on the "Save" button
    Then I should see "Name: Gender Section"
    Then I should see "Revised Description"
    When I click on the "Questions and Sections" link
    And I should see "What is your gender?"
    And I should see "Nested Section"
    And I should see "Edit"
    And I should see "TEST VAR EDIT"
    When I click on the "Item program defined variable: Test Var Edit" link
    And I fill in the "program-defined-variable" field with "Edit on show page"
    And I click on the "Save" link
    Then I should see "EDIT ON SHOW PAGE"

  Scenario: Extend Section
    Given I have a published Section with the name "Test Section" and the description "Description from parent"
    And I have a published Question with the content "What is your gender?" and the type "MC"
    And I have a published Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Extend the Section with the name "Test Section"
    And I fill in the "section-name" field with "Test Section Extended"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    And I click on the "Save" button
    Then I should see "Name: Test Section Extended"
    And I should see "Description from parent"
    And I should see "Extended from: Test Section"
    And I should not see "Switch to expanded item view"
    When I click on the "Questions" link
    Then I should see "Switch to expanded item view"
    And I should see "What is your gender?"
    And I should see "VERSION 1 OF 1 | ITEM TYPE: QUESTION"
    And I should not see "Publish"
  # And I should see "Version: 1"
    And I should see "Edit"
    When I click on the "Switch to condensed item view" button
    Then I should see "What is your gender?"
    And I should not see "VERSION 1 OF 1 | ITEM TYPE: QUESTION"
    And I should see "v1"

  Scenario: Reorder Questions
    Given I have a published Section with the name "Test Section"
    And I have a published Question with the content "What is your gender?" and the type "MC"
    And I have a published Question with the content "What is your name?" and the type "MC"
    And I have a published Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Revise the Section with the name "Test Section"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I should not see "Result Already Added"
    And I wait 1 seconds
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    When I select the add program variable option for the Question "What is your gender?"
    And I fill in the "program-var" field with "Test Var"
    And I click on the "Done" button
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your name?"
    And I move the Question "What is your name?" up
    And I should see "TEST VAR"
    And I should see "Result Already Added"
    And I click on the "Save" button
    Then I wait 1 seconds
    When I click on the "Questions" link
    And I should see "What is your gender?"
    And I should see the question "What is your name?" first
    And I should see the response set "Gender Partial" second
    And I should see "TEST VAR"

  Scenario: Create New Section from List and Create a Question using New Question Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a published Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Sections" dropdown item
    And I fill in the "section-name" field with "Test Section"
    And I fill in the "section-description" field with "Section description"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Full"
    And I click on the "Add New Question" button
    And I fill in the "Question" field with "What is your favorite color?"
    And I select the "Open Choice" option in the "Response Type" list
    And I fill in the "question-description" field with "This is a description"
    And I should see "No Response Sets selected"
    Then I select the "Text" option in the "Response Type" list
    And I should not see "No Response Sets selected"
    And I click on the "Add Question" button
    And I click on the "Save" button
    Then I should see "Test Section"
    When I click on the "Questions" link
    And I should see "What is your gender?"
    And I should see "What is your favorite color?"

  Scenario: Create New Section from List and Create a Response Set using New Response Set Modal
    Given I have a Response Set with the name "Gender Full"
    And I have a published Question with the content "What is your gender?" and the type "MC"
    And I have a published Question with the content "Do you like apples?" and the description "A simple boolean" and the response type "Boolean"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Sections" dropdown item
    And I fill in the "section-name" field with "Test Section"
    And I fill in the "section-description" field with "Section description"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "Do you like apples?"
    And I use the question search to select "What is your gender?"
    Then I click on the "Add New Response Set" button
    Then I fill in the "response-set-name" field with "New Response Set"
    And I click on the "Add Response Set" button
    Then I wait 1 seconds
    And I use the response set search modal to select "New Response Set"
    And I click on the "Save" button
    Then I should see "Test Section"
    When I click on the "Questions" link
    And I should see "What is your gender?"
    And I should see "Response Type: Boolean"
    When I click on the "What is your gender?" link
    And I click on the "Click link to expand information about (Parent Items)" link
    Then I should see "Test Section"
    Then I wait 1 seconds
    And I click on the "Click for info about this item (Parent Items InfoButton)" link

  Scenario: Show warning modal after adding question
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Sections" dropdown item
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    When I click on the "CDC Vocabulary Service" link
    Then I should see "Unsaved Changes"

  Scenario: Create New Section from List with warning modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Sections" dropdown item
    And I fill in the "section-name" field with "Test Section"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    And I wait 1 seconds
    And I go to the dashboard
    Then I should see "Test Section"

  Scenario: Abandon New Section from List with warning modal
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the create "Sections" dropdown item
    And I fill in the "section-name" field with "Test Section"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Continue Without Saving" button
    When I go to the list of Sections
    Then I should not see "Test Section"
