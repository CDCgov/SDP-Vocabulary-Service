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
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Name: Gender Full"

  Scenario: Revise Response Set
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Revise Response Set" button
    Then I should see "Version: 2"
    And I should see "Gender Partial"

  Scenario: Revise Response Set Removing Response
    Given I have a Response Set with the name "Gender Full"
    And I have the Responses: Male, 1; Female, 1; Prefer not to answer, 1
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I click on the link to remove the Response "Male"
    And I click on the "Revise Response Set" button
    Then I should see "Version: 2"
    And I should see "Gender Full"
    And I should see "Female"
    And I should not see "Male"

  Scenario: Extend Response Set
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Extend the Response Set with the name "Gender Full"
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F / O"
    And I click on the "Extend Response Set" button
    Then I should see "Version: 1"
    And I should see "Extended from: Gender Full"
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
    And I click on the "Create Response Set" button
    Then I should see "Version: 1"
    And I should see "Gender Partial"
    And I should see "Male"
    And I should see "Female"
    And I should see "m-code"
    And I should see "f-code"

  Scenario: Create New Response Set with warning modal
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
    When I go to the list of Response Sets
    And I click on the "Save & Leave" button
    And I should see "Gender Partial"

  Scenario: Abandon New Response Set with warning modal
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
    When I go to the list of Response Sets
    And I click on the "Continue Without Saving" button
    And I should not see "Gender Partial"

  Scenario: Response Set Delete
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Delete the Response Set with the name "Gender Full"
    Then I should see "Response set was successfully destroyed."
    And I should not see "Gender Full"

  Scenario: Search for a Response Set
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

  Scenario: Filter for Response Sets on Dashboard
    Given I have a Question with the content "Why?" and the type "MC"
    And I have a Question with the content "What?" and the type "MC"
    And I have a Response Set with the name "Reasons why"
    When I go to the dashboard
    And I click on the "search-group-btn" button
    And I click on the response_sets search filter
    And I fill in the "search" field with "why"
    And I click on the "search-btn" button
    Then I should not see "Why?"
    And I should see "Reasons"
    And I should not see "What?"
