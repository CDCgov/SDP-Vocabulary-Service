Feature: Group information page
  As a user
  I want to see info about the groups I am a part of
  Scenario: Filter by groups
    Given I am logged in as test_author@gmail.com
    And I am on the "/" page
    When I click on the "Group" link
    And I click on the "Group1" link
    Then I should see "Filtering by content in group: Group1"
    When I click on the "Click link to expand information about group" link
    Then I should see "Description: A group for testing group associations"
    And I should see "(test_author@gmail.com)"
    When I click on the "Group" link
    And I click on the "All My Groups" link
    Then I should see "Filtering to content owned by any of your groups"
    And I should not see "(test_author@gmail.com)"
