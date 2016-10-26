Feature: Manage Question Types
  As an author
  I want to create and manage Question Types
  Scenario: Question Type List View
    Given I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Question Types
    Then I should see "Multiple Choice"
    And I should see the option to Destroy the Question Type with the name "Multiple Choice"
    And I should see the option to Details the Question Type with the name "Multiple Choice"
    And I should see the option to Edit the Question Type with the name "Multiple Choice"

  Scenario: Show Question Type in Detail
    Given I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Question Types
    And I click on the option to Details the Question Type with the name "Multiple Choice"
    Then I should see "Name: Multiple Choice"

  Scenario: Edit Question Type
    Given I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Question Types
    And I click on the option to Edit the Question Type with the name "Multiple Choice"
    And I fill in the "Name" field with "M/C"
    And I click on the "Update Question type" button
    Then I should see "Question Type was successfully updated"
    And I should see "M/C"
  
  Scenario: Create New Question Type from List
    Given I am logged in as test_author@gmail.com
    When I go to the list of Question Types
    And I click on the "New Question Type" link
    And I fill in the "Name" field with "True/False"
    And I click on the "Create Question type" button
    Then I should see "Question Type was successfully created"
    And I should see "True/False"
  
  Scenario: Destroy Question Type
    Given I have a Question Type with the name "Multiple Choice"
    And I am logged in as test_author@gmail.com
    When I go to the list of Question Types
    And I click on the option to Destroy the Question Type with the name "Multiple Choice"
    And I confirm my action
    Then I should see "Question Type was successfully destroyed"
    And I should not see "Multiple Choice"
