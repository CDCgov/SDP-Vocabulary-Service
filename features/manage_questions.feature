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
    And I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Question with the content "What is your gender?" linked to Surveillance System "National Violent Death Reporting System"
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    Then I should see "Description: This is a question"
    Then I should see "New Concept Name"
    And I should see "Surveillance Programs: 0"
    And I should see "Surveillance Systems: 1"
    And I should see "Groups"

  Scenario: Manage groups on a Question
    Given I have a Question with the content "What is your gender?" and the description "This is a question"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    When I click on the "Groups" button
    Then I should see "Group1"
    And I should see "None"
    When I click on the "Group1" link
    And I click on the "Groups" button
    Then I should see "Group1"
    And I should not see "None"

  Scenario: Manage Tags on a Question Show page
    Given I have a published Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    And I should see "Edit"
    When I click on the "Edit" link
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    And I click on the "Add Row" link
    And I fill in the "displayName_1" field with "New"
    And I select tag "New Concept Name" in the tag dropdown
    And I click on the "Save" button
    Then I should see "New Concept Name"
    And I should see "Test Concept 2"

  Scenario: Send a Draft Question to a Publisher
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I have a publisher "johnny@test.org" with the first name "Johnny" and last name "Test"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    And I should see "Send to publisher"
    When I click on the "Send to publisher" button
    And I should see "Johnny Test <johnny@test.org>"

  Scenario: Show Question in Detail No Concepts
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    Then I should see "Description: This is a question"
    Then I should see "No Tags Selected"

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

  Scenario: Published Question should be visible when not logged in
    Given I have a published Question with the content "Why?"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "Why?"
    And I click on the option to Details the Question with the content "Why?"
    Then I should see "Why?"

  Scenario: Published Question should be visible when not logged in
    Given I have a published Question with the content "Why?"
    And I am logged in as "not_test_user@gmail.com"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "Why?"
    And I click on the option to Details the Question with the content "Why?"
    Then I should see "Why?"
