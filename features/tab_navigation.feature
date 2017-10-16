Feature: Tab Navigation and Order
  As a user without a mouse
  I want tab navigation to be logical so I can solely use a keyboard

  Scenario: See skip navigation
    Given I am on the "/" page
    When I press the key tab
    And I press the key tab
    Then I should see "Skip to main content"
    And "skip-nav" should be my focus

  Scenario: Get to action buttons without going through all search results
    Given I am logged in as test_author@gmail.com
    And I have a Question with the content "What is your gender 1?" and the type "MC"
    And I have a Question with the content "What is your gender 2?" and the type "MC"
    And I have a Question with the content "What is your gender 3?" and the type "MC"
    And I am on the "/" page
    And I click on the create "Sections" dropdown item
    And I press the tab key 11 times
    Then "section-name" should be my focus
