Feature: Manage My Stuff
  As an author
  I want to create and manage My Stuff
  Scenario: View My Stuff
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to my stuff
    And I wait 1 second(s)
    Then I should see a Question widget with the content "What is your gender?"
