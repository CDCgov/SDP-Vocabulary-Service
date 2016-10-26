Feature: Manage Concepts
  As an author
  I want to create and manage Concepts
  Scenario: Concept List View
    Given I have a Concept with the value "Gender"
    And I am logged in as test_author@gmail.com
    When I go to the list of Concepts
    Then I should see "Gender"
    And I should see the option to Destroy the Concept with the value "Gender"
    And I should see the option to Details the Concept with the value "Gender"
    And I should see the option to Edit the Concept with the value "Gender"

  Scenario: Show Concept in Detail
    Given I have a Concept with the value "Gender"
    And I am logged in as test_author@gmail.com
    When I go to the list of Concepts
    And I click on the option to Details the Concept with the value "Gender"
    Then I should see "Value: Gender"

  Scenario: Edit Concept
    Given I have a Concept with the value "Gender"
    And I have a Response Set with the name "Temperature Status"
    And I am logged in as test_author@gmail.com
    When I go to the list of Concepts
    And I click on the option to Edit the Concept with the value "Gender"
    And I fill in the "Value" field with "Temperature"
    And I select the "Temperature Status" option in the "Linked response sets" list
    And I click on the "Update Concept" button
    Then I should see "Concept was successfully updated."
    And I should see "Temperature"
  
  Scenario: Create New Concept from List
    Given I have a Response Set with the name "Gender Full"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Concepts
    And I click on the "New Concept" link
    And I fill in the "Value" field with "Gender"
    And I select the "Gender Full" option in the "Linked response sets" list
    And I select the "Gender Partial" option in the "Linked response sets" list
    And I click on the "Create Concept" button
    Then I should see "Concept was successfully created."
    And I should see "Gender Full"
    And I should see "Gender Partial"

  Scenario: Destroy Concept
    Given I have a Concept with the value "Gender"
    And I am logged in as test_author@gmail.com
    When I go to the list of Concepts
    And I click on the option to Destroy the Concept with the value "Gender"
    And I confirm my action
    Then I should see "Concept was successfully destroyed."
    And I should not see "Gender"
