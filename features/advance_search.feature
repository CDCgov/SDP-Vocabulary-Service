Feature: Advanced Search
  As a user
  I want to refine my search beyond just a text query
  Scenario: Filter search by searching for a system
    Given I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance System with the name "National Vital Statistics System"
    And I have a Surveillance Program with the name "FoodNet"
    And I have a Surveillance Program with the name "Influenza"
    And I am on the "/" page
    When I click on the "Advanced" link
    Then I should see "Most Recent Versions Only"
    Then I should see "FoodNet"
    Then I search for the program "flu"
    Then the list "select-prog" should not contain the option "FoodNet"
    Then the list "select-prog" should contain the option "Influenza"
    When I select the "Influenza" option in the "select-prog" list
    And I check the "most-recent-filter" checkbox
    And I click on the "Close" button
    Then I should see "Program Filters:"
    And I should see "Influenza"
    And I should see "Clear Adv. Filters"
    And I should see "Filtering by most recent version"

  Scenario: Filter search by date
    And I am on the "/" page
    When I click on the "Advanced" link
    And I fill in the "date" field with "07/29/2017"
    And I click on the "Close" button
    Then I should see "Content Since Filter:"
    And I should see "7/29/2017"
    And I should see "Clear Adv. Filters"
