Feature: Manage Usage
  As an author associated with a program and system
  I want usage information to display for my questions and response sets

  Scenario: Refresh Question Usage without refreshing application
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance System with the name "National Vital Statistics System"
    And I have a Surveillance Program with the name "FoodNet"
    And I am working the program "FoodNet" and system "National Vital Statistics System" logged in as test_author@gmail.com
    And I am the publisher test_author@gmail.com
    And I have a Question with the content "What is your gender?" linked to Surveillance System "National Violent Death Reporting System"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Surveillance Programs: 0"
    And I should see "Surveillance Systems: 1"
    When I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I click on the "Save" button
    Then I should see "Test Form"
    When I click on the "Publish" button
    And I click on the create "Surveys" dropdown item
    And I fill in the "name" field with "Test Survey"
    And I set search filter to "form"
    And I click on the "search-btn" button
    And I use the form search to select "Test Form"
    And I click on the "Save" button
    Then I should see "Test Survey"
    When I click on the "Publish" button
    And I should see "Surveillance Program: FoodNet"
    And I click on the "CDC Vocabulary Service" link
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Surveillance Programs: 1"
    And I should see "Surveillance Systems: 2"

  Scenario: Refresh Response Set Usage without refreshing application
    Given I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC" and the concept "New Concept Name"
    And I have a Response Set with the name "Gender Full" and the description "Example RS"
    And I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance System with the name "National Vital Statistics System"
    And I have a Surveillance Program with the name "FoodNet"
    And I am working the program "FoodNet" and system "National Vital Statistics System" logged in as test_author@gmail.com
    And I am the publisher test_author@gmail.com
    And I have a Response Set with the name "Gender Full" linked to Surveillance System "National Violent Death Reporting System"
    When I go to the list of Response Sets
    And I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Surveillance Programs: 0"
    And I should see "Surveillance Systems: 1"
    When I click on the create "Forms" dropdown item
    And I fill in the "name" field with "Test Form"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Full"
    And I click on the "Save" button
    Then I should see "Test Form"
    When I click on the "Publish" button
    And I click on the create "Surveys" dropdown item
    And I fill in the "name" field with "Test Survey"
    And I set search filter to "form"
    And I click on the "search-btn" button
    And I use the form search to select "Test Form"
    And I click on the "Save" button
    Then I should see "Test Survey"
    When I click on the "Publish" button
    And I should see "Surveillance Program: FoodNet"
    And I click on the "CDC Vocabulary Service" link
    And I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Surveillance Programs: 1"
    And I should see "Surveillance Systems: 2"
