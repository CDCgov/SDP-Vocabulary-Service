Feature: Admin Panel
  As an admin
  I want to be able to add and remove user roles and permissions
  Scenario: Get rejected from admin panel
    Given I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    Then I should not see "Admin Panel"
    When I am on the "/#/admin" page
    Then I should not see "Admin List"
    And I should see "You are not authorized to see this content"

  Scenario: Admin panel access and error display
    Given I am the admin test_author@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    And I click on the "Admin Panel" link
    Then I should see "Admin List"
    When I fill in the "email" field with "not_real@yahoo.com"
    And I click on the "submit-email" button
    Then I should see "No user found with email not_real@yahoo.com"

  Scenario: Revoke permissions
    Given I am the admin test_author@gmail.com
    And there is an admin with the email admin@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    And I click on the "Admin Panel" link
    Then I should see "Admin List"
    And I should see "admin@gmail.com"
    When I click on the "remove_admin@gmail.com" button
    Then I should not see "admin@gmail.com"
