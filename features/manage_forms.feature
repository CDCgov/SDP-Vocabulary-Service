Feature: Manage Forms
  As an author
  I want to manage Forms
  Scenario: Form List Details
    Given I have a published Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    Then I should see "Test Form"
    When I click on the menu link for the Form with the name "Test Form"
    And I should see the option to Details the Form with the name "Test Form"
    And I should see the option to Revise the Form with the name "Test Form"

  Scenario: Show Form in Detail
    Given I have a Form with the name "Test Form" and the description "Form description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Details the Form with the name "Test Form"
    Then I should see "Test Form"
    Then I should see "Form description"

  Scenario: Delete Form
    Given I have a Form with the name "Test Form" and the description "Form description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Details the Form with the name "Test Form"
    When I click on the "Delete" link
    When I confirm my action
    Then I go to the dashboard
    When I go to the list of Forms
    Then I should not see "Test Form"

  Scenario: Publish a Draft Form
    Given I have a Form with the name "Test Form" and the description "Form description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Details the Form with the name "Test Form"
    Then I should see "Test Form"
    Then I should see "Form description"
    When I click on the "Publish" link
    Then I should not see "Publish"
    And I should see "Revise"
    And I should not see "Edit"
