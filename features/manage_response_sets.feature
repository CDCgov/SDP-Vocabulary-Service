Feature: Manage Response Sets
  As an author
  I want to create and manage Response Sets
  Scenario: Response Set List View
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    Then I should see the option to Show the Response Set with the name "Gender Full"
    And I should see the option to Edit the Response Set with the name "Gender Full"
    And I should see the option to Destroy the Response Set with the name "Gender Full"

  Scenario: Show Response Set in Detail
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Show the Response Set with the name "Gender Full"
    Then I should see "Name: Gender Full"
  
  Scenario: Edit Response Set
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Edit the Response Set with the name "Gender Full"
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Update Response set" button
    Then I should see "Response set was successfully updated."
    And I should see "Gender Partial"

  Scenario: Create New Response Set
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the "New Response Set" link
    And I fill in the "Name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Create Response set" button
    Then I should see "Response set was successfully created."
    And I should see "Gender Partial"

  Scenario: Response Set Destroy
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the option to Destroy the Response Set with the name "Gender Full"
    Then I should see "Response set was successfully destroyed."
    And I should not see "Gender Full" 
