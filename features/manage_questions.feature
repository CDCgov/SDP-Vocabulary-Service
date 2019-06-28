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
    And I wait 1 seconds
    When I click on the "add_Group1" button
    When I click on the "Groups" button
    When I click on the "add_Group1" button
    And I wait 1 seconds
    And I click on the "Groups" button
    Then I should see "Group1"
    And I should not see "None"
    And I wait 1 seconds
    When I click on the "Click to remove content from Group1 group" button
    And I click on the "Groups" button
    When I click on the "Click to remove content from Group1 group" button
    And I wait 1 seconds
    And I click on the "Groups" button
    Then I should see "Group1"
    And I should see "None"

  Scenario: Send a Draft Question to a Publisher
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I have a publisher "johnny@test.org" with the first name "Johnny" and last name "Test"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    And I should see "Send"
    When I click on the "Send" button
    And I should see "Johnny Test <johnny@test.org>"

  Scenario: Show Question in Detail No Concepts
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    Then I should see "Description: This is a question"
    Then I should see "No Code System Mappings Selected"

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

   Scenario: Edit with Comment and Delete a Question
    Given I have a Question with the content "Test Question" and the description "Question description"
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Question with the content "Test Question"
    And I click on the option to Edit the Question with the content "Test Question"
    And I select the "Open Choice" option in the "Response Type" list
    And I wait 2 seconds
    And I click on the "select-Gender Full" link
    And I fill in the "save-with-comment" field with "Testing comment functionality on edit"
    And I click on the "Save" button
    Then I should see "Test Question"
    When I click on the "Change History" link
    Then I should see "Notes / Comments: Testing comment functionality on edit"
    Then I should see "Changes by test_author@gmail.com"
    And I should see "field changed from"
    When I click on the "Delete" link
    Then I should see "Are you sure you want to delete this question?"
    When I click on the "Delete Question" link
    Then I go to the dashboard
    When I go to the list of Questions
    Then I should not see "Test Question"
    When I go to the list of Response Sets
    Then I should see "Gender Full"

  Scenario: Delete all for a question
    Given I have a Response Set with the name "Gender Full"
    And I have a Category with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Questions" dropdown item
    And I select the "Open Choice" option in the "Response Type" list
    And I fill in the "Question" field with "What is your favorite color?"
    And I fill in the "Description" field with "This is a description"
    And I click on the "select-Gender Full" link
    And I select the "Multiple Choice" option in the "Category" list
    And I click on the "Save" button
    Then I should see "What is your favorite color?"
    When I click on the "Delete" link
    Then I should see "Are you sure you want to delete this question?"
    When I click on the "Delete All" link
    And I wait 1 seconds
    When I go to the list of Questions
    Then I should not see "Test Question"
    When I go to the list of Response Sets
    Then I should not see "Gender Full"

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

  Scenario: View the info buttons in a Question
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Questions
    When I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    When I click on the "Click for info about this item (Content Stage)" button
    Then I click on the "Close" button
  # When I click on the "Click for info about this item (Public)" button
  # Then I click on the "Close" button
    When I click on the "Click for info about this item (Private)" button
    Then I click on the "Close" button
