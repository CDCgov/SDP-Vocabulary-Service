Feature: Manage Response Sets
  As an author
  I want to create and manage Response Sets
  Scenario: Response Set List View
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    Then I should see the option to Details the Response Set with the name "Gender Full"
    And I should see the option to Revise the Response Set with the name "Gender Full"
    And I should see the option to Extend the Response Set with the name "Gender Full"
    And I should see the option to Delete the Response Set with the name "Gender Full"

  Scenario: Show Response Set in Detail
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Name: Gender Full"
    And I should see "Response set description"
    And I should see "Original Response"

  Scenario: Show Response Set in Detail No Responses
    Given I have a Response Set with the name "Gender Full" and the description "Response set description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Name: Gender Full"
    And I should see "Response set description"
    And I should see "No Responses Selected"

  Scenario: Revise Response Set
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    And I click on the "Revise Response Set" button
    Then I should see "Version: 2"
    And I should see "Gender Partial"
    And I should see "M / F"
    And I should see "Test Response 2"
    And I should not see "Original Response"

  Scenario: Revise Response Set Removing Response
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Male"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I click on the link to remove the Response "Male"
    And I click on the "Revise Response Set" button
    Then I should see "Version: 2"
    And I should see "Gender Full"
    And I should not see "Male"

  Scenario: Extend Response Set
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Extend the Response Set with the name "Gender Full"
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F / O"
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    And I click on the "Extend Response Set" button
    Then I should see "Version: 1"
    And I should see "Extended from: Gender Full"
    And I should see "Gender Partial"
    And I should see "M / F / O"
    And I should see "Test Response 2"
    And I should not see "Original Response"

  Scenario: Create New Response Set
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the "New Response Set" link
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Response 1"
    And I fill in the "value_1" field with "Test Response 2"
    And I fill in the "value_2" field with "Test Response 3"
    And I fill in the "codeSystem_0" field with "Test System 1"
    And I fill in the "codeSystem_1" field with "Test System 2"
    And I fill in the "codeSystem_2" field with "Test System 3"
    And I fill in the "displayName_0" field with "Test Name 1"
    And I fill in the "displayName_1" field with "Test Name 2"
    And I fill in the "displayName_2" field with "Test Name 3"
    And I click on the "remove_2" link
    And I click on the "Create Response Set" button
    Then I should see "Version: 1"
    And I should see "Gender Partial"
    And I should see "Test Response 1"
    And I should see "Test Response 2"
    And I should not see "Test Response 3"
    And I should see "Test System 1"
    And I should see "Test System 2"
    And I should not see "Test System 3"
    And I should see "Test Name 1"
    And I should see "Test Name 2"
    And I should not see "Test Name 3"

  Scenario: Create New Response Set with warning modal
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the "New Response Set" link
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Response 1"
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    When I go to the list of Response Sets
    And I click on the "Save & Leave" button
    And I should see "Gender Partial"
    And I should see "M / F"

  Scenario: Abandon New Response Set with warning modal
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the "New Response Set" link
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Response 1"
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    When I go to the list of Response Sets
    And I click on the "Continue Without Saving" button
    And I should not see "Gender Partial"

  Scenario: Search for a Response Set on the Response Set Index Page
    Given I have a Response Set with the name "Gender1"
    And I have a Response Set with the name "gender lowercase"
    And I have a Response Set with the name "Temp Partial"
    And I have a Response Set with the name "Other Partial"
    And I have a Response Set with the name "True / False"
    When I go to the list of Response Sets
    And I fill in the "search" field with "Gender"
    And I click on the "Go!" button
    Then I should see "Gender1"
    And I should see "gender lowercase"
    And I should not see "Temp"
    And I should not see "True"
    And I should not see "Other"
