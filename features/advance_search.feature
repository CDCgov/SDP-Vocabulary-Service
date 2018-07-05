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
    And I check the "preferred-filter" checkbox
    And I click on the "Close" button
    Then I should see "Program Filters:"
    And I should see "Influenza"
    And I should see "Clear Adv. Filters"
    And I should see "Filtering by most recent version"
    And I should see "Filtering by CDC preferred content"

  Scenario: Filter search by date
    And I am on the "/" page
    When I click on the "Advanced" link
    And I fill in the "content-since" field with "07/29/2017"
    And I click on the "Close" button
    Then I should see "Content Since Filter:"
    And I should see "7/29/2017"
    And I should see "Clear Adv. Filters"

  Scenario: Filter search by omb approval date
    And I am on the "/" page
    When I click on the "Advanced" link
    And I fill in the "omb-date" field with "06/10/2017"
    And I click on the "Close" button
    Then I should see "Filtering to surveys with OMB approval date after:"
    And I should see "6/10/2017"
    And I should see "Clear Adv. Filters"

  Scenario: Filter search by source
    And I am on the "/" page
    When I click on the "Advanced" link
    And I select the "SDPV Local" option in the "Source (Response Sets Only):" list
    And I click on the "Close" button
    Then I should see "Filtering results by local source"
    And I should see "Clear Adv. Filters"

  Scenario: Filter search by status
    And I am on the "/" page
    When I click on the "Advanced" link
    And I tab out of the "content-since" field
    And I click the "Draft" option button
    And I click on the "Close" button
    Then I should see "Filtering results by draft status"
    And I should see "Clear Adv. Filters"

  Scenario: Filter search by category
    And I am on the "/" page
    When I click on the "Advanced" link
    And I select the "Clinical" option in the "Category (Questions Only):" list
    And I click on the "Close" button
    Then I should see "Filtering results by Clinical category"
    And I should see "Clear Adv. Filters"

  Scenario: Filter search by response type
    And I am on the "/" page
    When I click on the "Advanced" link
    And I select the "Choice" option in the "Response Type (Questions Only):" list
    And I click on the "Close" button
    Then I should see "Filtering results by Choice response type"
    And I should see "Clear Adv. Filters"

  Scenario: Sort by system and program usage
    Given I am on the "/" page
    When I click on the "Advanced" link
    And I tab out of the "content-since" field
    And I click the "System Usage" option button
    And I click on the "Close" button
    Then I should see "Sorting results by System Usage"
    When I click on the "Clear Adv. Filters" link
    And I click on the "Advanced" link
    And I tab out of the "content-since" field
    And I click the "Program Usage" option button
    And I click on the "Close" button
    Then I should see "Sorting results by Program Usage"
    And I should see "Clear Adv. Filters"

  Scenario: Filter by groups
    Given I am logged in as test_author@gmail.com
    And I am on the "/" page
    When I select the "Group1" option in the "Group Select" list
    Then I should see "Filtering by content in group: Group1"
    And I should not see "Clear Adv. Filters"
    When I select the "All My Groups" option in the "Group Select" list
    Then I should see "Filtering to content owned by any of your groups"

  Scenario: Filter by collection method
    Given I am logged in as test_author@gmail.com
    And I am on the "/" page
    When I click on the "Advanced" link
    And I select the "Record review" option in the "Data Collection Method (Questions Only):" list
    And I click on the "Close" button
    Then I should see "Data Collection Method Filters:"
    And I should see "Record review"
