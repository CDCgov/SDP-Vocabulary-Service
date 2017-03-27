Feature: Session Management
  As a user
  I want to register, log in, and log out
  Scenario: Navigate to the sign in page
    Given I am on the "/" page
    When I click on the "Register" link
    Then I should see "Sign Up"

  Scenario: Create an account
    Given I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance System with the name "National Vital Statistics System"
    And I have a Surveillance Program with the name "FoodNet"
    And I have a Surveillance Program with the name "Influenza"
    And I am on the "/" page
    When I click on the "Register" link
    And I fill in the "email" field with "test_author@gmail.com"
    And I fill in the "password" field with "password"
    And I fill in the "passwordConfirmation" field with "password"
    And I select the "National Vital Statistics System" option in the "Surveillance System" list
    And I select the "Influenza" option in the "Surveillance Program" list
    And I click on the "Sign Up" button
    Then I should see "test_author@gmail.com"
    And a user "test_author@gmail.com" should exist
    And a user "test_author@gmail.com" should have a last Surveillance Program named "Influenza"

  Scenario: Login to an existing account
    Given I am on the "/" page
    And a user "test_author@gmail.com" exists
    When I click on the "Login" link
    And I fill in the "email" field with "test_author@gmail.com"
    And I fill in the "password" field with "password"
    And I click on the "Log In" button
    Then I should see "test_author@gmail.com"

  Scenario: Edit an existing account
    Given I am logged in as test_author@gmail.com
    And I am on the "/" page
    When I click on the "account-dropdown" link
    And I click on the "Settings" link
    Then I should see "Account Details"

  Scenario: Edit an existing account without programs
    Given I am logged in as test_author@gmail.com
    And I am on the "/" page
    When I click on the "account-dropdown" link
    And I click on the "Settings" link
    Then I should see "Account Details"
    And I should see "No surveillance programs loaded in the database"
    And I fill in the "firstName" field with "Brett"
    And I fill in the "lastName" field with "Bretterson"
    And I click on the "Update" button
    Then I should see "test_author@gmail.com"
    And I should not see "Account Details"

  Scenario: Login via OpenID Connect
    Given I am on the "/" page
    When I click on the "Login" link
    Then I should see the "Sign in with OpenID Connect" link
