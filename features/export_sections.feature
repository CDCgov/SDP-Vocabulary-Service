Feature: Export Sections
  As an author
  I want to export Sections from the application
  Scenario: Export Section
    Given I have a Section with the name "Test Section"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial" and the description "Gender example" and with the Responses Male, Female
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Sections" dropdown item
    And I fill in the "section-name" field with "Test Section"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    And I click on the "Save" button

  Scenario: Export Section Options
    Given I have a Section with the name "Test Section"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial" and the description "Gender example" and with the Responses Male, Female
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Sections" dropdown item
    And I fill in the "section-name" field with "Test Section"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    And I click on the "Save" button
    And I click on the "Export" button
    Then I should see "REDCap (XML)"
    And I should see "Epi Info (XML)"
