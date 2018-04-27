Feature: Group information page
  As a user
  I want to see info about the groups I am a part of
  Scenario: Filter by groups
    Given I am logged in as test_author@gmail.com
    And I am on the "/" page
    When I select the "Group1" option in the "Group Select" list
    Then I should see "Filtering by content in group: Group1"
    When I click on the "Click link to expand information about group" link
    Then I should see "Description: A group for testing group associations"
    And I should see "(test_author@gmail.com)"
    And I should not see "Clear Adv. Filters"
    When I select the "All My Groups" option in the "Group Select" list
    Then I should see "Filtering to content owned by any of your groups"
    And I should not see "(test_author@gmail.com)"
