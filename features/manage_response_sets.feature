Feature: Manage Response Sets
  As an author
  I want to create and manage Response Sets
  Scenario: Create New Response
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the "New Response Set" link
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Create Response set" button
    Then I should see "Response set was successfully created."
    And I should see "Gender Partial"

  Scenario: Response Linking List View Sanity Check
    Given I have a Response Set with the name "Gender Full"
    And I have the Responses: Male, 1; Female, 1; Prefer not to answer, 1
    And I am logged in as test_author@gmail.com
    When I go to the list of Responses
#    When I go to the list of Response Sets
#    And I click on the option to Show "Gender Full"
    Then I should see a Response with the value "Male" and a Response Set ID of "1"
    And I should see a Response with the value "Female" and a Response Set ID of "1"
    And I should see a Response with the value "Prefer not to answer" and a Response Set ID of "1"
    And I should see the option to Destroy "Male"
    And I should see the option to Destroy "Female"
    And I should see the option to Destroy "Prefer not to answer"
    And I should see the option to Show "Male"
    And I should see the option to Show "Female"
    And I should see the option to Show "Prefer not to answer"
    And I should see the option to Edit "Male"
    And I should see the option to Edit "Female"
    And I should see the option to Edit "Prefer not to answer"

  Scenario: Response Set List View Second Sanity Check
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    Then I should see a Response Set with the name "Gender Full"
    And I should see the option to Show "Gender Full"
    And I should see the option to Edit "Gender Full"
    And I should see the option to Destroy "Gender Full"
