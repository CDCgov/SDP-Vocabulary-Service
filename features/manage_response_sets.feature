Feature: Manage Response Sets
  As an author
  I want to create and manage Response Sets
  Scenario: Response Set List View
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    Then I should see the option to Show the Response Set with the name "Gender Full"
    And I should see the option to Revise the Response Set with the name "Gender Full"
    And I should see the option to Extend the Response Set with the name "Gender Full"
    And I should see the option to Destroy the Response Set with the name "Gender Full"

  Scenario: Show Response Set in Detail
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Show the Response Set with the name "Gender Full"
    Then I should see "Name: Gender Full"

  Scenario: Revise Response Set
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Revise Response Set" button
    Then I should see "Response set was successfully revised."
    And I should see "Gender Partial"

  Scenario: Revise Response Set Removing Response
    Given I have a Response Set with the name "Gender Full"
    And I have the Responses: Male, 1; Female, 1; Prefer not to answer, 1
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I click on the link to remove the Response "Male"
    And I click on the "Revise Response Set" button
    Then I should see "Response set was successfully revised."
    And I should see "Gender Full"
    And I should see "Female"
    And I should not see "Male"

  Scenario: Extend Response Set
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Extend the Response Set with the name "Gender Full"
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F / O"
    And I click on the "Create Response set" button
    Then I should see "Response set was successfully created."
    And I should see "Gender Partial"
    And I should see "M / F / O"

  Scenario: Create New Response Set
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the "New Response Set" link
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "response_set_responses_attributes_0_value" field with "m-code"
    And I fill in the "response_set_responses_attributes_0_display_name" field with "Male"
    And I fill in the "response_set_responses_attributes_1_value" field with "f-code"
    And I fill in the "response_set_responses_attributes_1_display_name" field with "Female"
    And I click on the "Create Response set" button
    Then I should see "Response set was successfully created."
    And I should see "Gender Partial"
    And I should see "Male"
    And I should see "Female"
    And I should see "m-code"
    And I should see "f-code"

  Scenario: Response Set Destroy
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Destroy the Response Set with the name "Gender Full"
    Then I should see "Response set was successfully destroyed."
    And I should not see "Gender Full"
