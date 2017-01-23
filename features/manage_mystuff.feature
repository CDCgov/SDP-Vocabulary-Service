Feature: Manage My Stuff
  As an author
  I want to create and manage My Stuff
  Scenario: View My Stuff
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to my stuff
    Then I should see a Question widget with the content "What is your gender?"
    And I should see a Response Set widget with the name "Gender Full"
    And I should see a Form widget with the name "Test Form"
