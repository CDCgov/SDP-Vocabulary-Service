Feature: Search
  As an author
  I want to search for various items
  Scenario: Dashboard search for a draft I own
    Given I have a Question with the content "Why?" and the type "MC"
    And I am logged in as someone_else@gmail.com
    And I have a Question with the content "What?" and the type "MC"
    And I have a Response Set with the name "Reasons why"
    When I go to the dashboard
    And I fill in the "search" field with "why"
    And I click on the "search-btn" button
    Then I should see "Why"
    And I should see "Reasons"
    And I should not see "What?"
