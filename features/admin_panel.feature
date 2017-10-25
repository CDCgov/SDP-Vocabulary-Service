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

  Scenario: Add program
    Given I am the admin test_author@gmail.com
    And there is an admin with the email admin@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    And I click on the "Admin Panel" link
    And I click on the "Program List" link
    And I fill in the "program-name" field with "New Program"
    And I click on the "submit-prog-sys" button
    And I fill in the "program-name" field with "Just clearing the text"
    Then I should see "New Program"

  Scenario: Add System
    Given I am the admin test_author@gmail.com
    And there is an admin with the email admin@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    And I click on the "Admin Panel" link
    And I click on the "System List" link
    And I fill in the "system-name" field with "New System"
    And I click on the "submit-prog-sys" button
    And I fill in the "system-name" field with "Just clearing the text"
    Then I should see "New System"

  Scenario: Add System with name error
    Given I am the admin test_author@gmail.com
    And there is an admin with the email admin@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    And I click on the "Admin Panel" link
    And I click on the "System List" link
    And I fill in the "system-description" field with "Trying to add system with no name"
    And I click on the "submit-prog-sys" button
    Then I should see "Error saving system - check format, name cannot be blank"