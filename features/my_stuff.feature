Feature: My Stuff
  As an author
  I want to view My Stuff
  Scenario: My Stuff Questions View
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to My Stuff
    Then I should see "What is your gender?"
    When I click on the menu link for the Question with the content "What is your gender?"
    Then I should see the option to Details the Question with the content "What is your gender?"
    And I should see the option to Revise the Question with the content "What is your gender?"

  Scenario: My Stuff Response Sets View
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to My Stuff
    When I click on the menu link for the Response Set with the name "Gender Full"
    Then I should see the option to Details the Response Set with the name "Gender Full"
    And I should see the option to Revise the Response Set with the name "Gender Full"
    And I should see the option to Extend the Response Set with the name "Gender Full"
    And I should see the option to Delete the Response Set with the name "Gender Full"

  Scenario: My Stuff Forms View
    Given I have a Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to My Stuff
    Then I should see "Test Form"
    When I click on the menu link for the Form with the name "Test Form"
    And I should see the option to View the Form with the name "Test Form"
    And I should see the option to Revise the Form with the name "Test Form"
