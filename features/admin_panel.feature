Feature: Admin Panel
  As an admin
  I want to be able to add and remove user roles and permissions
  Scenario: Get rejected from admin panel
    Given I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    Then I should not see "Admin Panel"

  Scenario: Unauthenticated admin page should error
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
    Then I should see "Successfully added program: New Program"
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
    Then I should see "Successfully added system: New System"
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

  Scenario: Sync elasticsearch success pop-up
    Given I am the admin test_author@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    And I click on the "Admin Panel" link
    And I click on the "Elasticsearch" link
    Then I should see "Elasticsearch Management"
    When I click on the "elasticsearch-sync-button" button
    Then I should see "Successfully updated Elasticsearch"

  Scenario: Add a group and a user
    Given I am the admin test_author@gmail.com
    When I go to the dashboard
    And I click on the "account-dropdown" link
    And I click on the "Admin Panel" link
    And I click on the "Group List" link
    Then I should see "Description (Optional)"
    And I fill in the "group-name" field with "New Group"
    And I fill in the "group-description" field with "Test Description"
    And I click on the "submit-group" button
    Then I should see "Successfully created group: New Group"
    And I fill in the "group-name" field with " "
    And I fill in the "group-description" field with " "
    Then I should see "New Group"
    And I should see "Test Description"
    And I click on the "Manage Users" button
    And I fill in the "email-input" field with "test_author@gmail.com"
    And I click on the "submit-email" button
    And I fill in the "email-input" field with " "
    Then I should see "Remove"
    And I should see "test_author@gmail.com"
