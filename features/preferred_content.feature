Feature: Preferred Content
  As an admin
  I want to be able to add and remove preferred content label
  Scenario: Normal user doesn't see mark as preferred
    Given I am logged in as test_author@gmail.com
    And I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    And I should not see "Click to add CDC preferred attribute to this content"
    When I go to the dashboard
    Then I should not see "This content is marked as preferred by the CDC"

  Scenario: Admin can mark content as preferred and see it in search result
    Given I am the admin test_author@gmail.com
    And I have a Question with the content "What is your gender?" and the description "This is a question" and the type "MC"
    When I go to the list of Questions
    And I click on the menu link for the Question with the content "What is your gender?"
    And I click on the option to Details the Question with the content "What is your gender?"
    Then I should see "Name: What is your gender?"
    And I should see "Click to add CDC preferred attribute to this content"
    When I click on the "Click to add CDC preferred attribute to this content" link
    Then I should see "This content is marked as preferred by the CDC"
    When I go to the dashboard
    Then I should see "This content is marked as preferred by the CDC"
