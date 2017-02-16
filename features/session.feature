Feature: Session Management
  As a user
  I want to register, log in, and log out
  Scenario: Navigate to the sign in page
    Given I am on the "/" page
    When I click on the "Register" link
    Then I should see "Sign Up"

  Scenario: Create an account
    Given I am on the "/" page
    When I click on the "Register" link
    And I fill in the "email" field with "test_author@gmail.com"
    And I fill in the "password" field with "password"
    And I fill in the "passwordConfirmation" field with "password"
    And I click on the "Sign Up" button
    Then a user "test_author@gmail.com" should exist

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

  Scenario: Login via OpenID Connect
    Given I am on the "/users/sign_in" page
    Then I should see the "Sign in with OpenIDConnect" link
