Feature: Manage Notifications
  As an author
  I want to create and manage Notifications
  Scenario: Notification View
    Given I have a Notification with the message "User1 has replied to your comment" and the url "/questions/1"
    And I have a Notification with the message "User2 has replied to your comment" and the url "/questions/2"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the "notifications-dropdown" link
    Then I should see "User1 has replied to your comment"
    And I should see "2" new notifications

  Scenario: Notification Redirect
    Given I have a Notification with the message "User1 has replied to your comment" and the url "/questions/1"
    And I am logged in as test_author@gmail.com
    And I have a Question with the content "Who?" and the type "MC"
    When I go to the dashboard
    And I click on the "notifications-dropdown" link
    And I click on the "User1 has replied to your comment" notification
    Then I should see "Content: Who?"
