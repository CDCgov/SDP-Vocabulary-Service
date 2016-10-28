Feature: Manage Forms
  As an author
  I want to create and manage Forms
  Scenario: Form List View
    Given I have a Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    Then I should see "Test Form"
    And I should see the option to Destroy the Form with the name "Test Form"
    And I should see the option to Show the Form with the name "Test Form"
    And I should see the option to Edit the Form with the name "Test Form"

  Scenario: Show Form in Detail
    Given I have a Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the option to Show the Form with the name "Test Form"
    Then I should see "Name: Test Form"

  Scenario: Edit Form
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the option to Edit the Form with the name "Test Form"
    And I fill in the "Name" field with "Gender Form"
    And I click on the "What is your gender?" link
    Then I select the "Gender Partial" option in the "Response Set" list
    And I click on the "Update Form" button
    Then I should see "Form was successfully updated."
    And I should see "Name: Gender Form"
    And I should see "What is your gender?"
    And I should see "Gender Partial"
  
  Scenario: Create New Form from List
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the "New Form" link
    And I fill in the "Name" field with "Test Form"
    And I click on the "What is your gender?" link
    And I select the "Gender Full" option in the "Response Set" list
    And I click on the "Create Form" button
    Then I should see "Form was successfully created."
    And I should see "What is your favorite color?"
  
  Scenario: Destroy Form
    Given I have a Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the option to Destroy the Form with the name "Test Form"
    And I confirm my action
    Then I should see "Form was successfully destroyed."
    And I should not see "Test Form"