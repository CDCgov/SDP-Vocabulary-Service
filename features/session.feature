Feature: Session Management
  As a user
  I want to register, log in, and log out
  Scenario: Navigate to the sign in page
    Given I am on the "/" page
    When I click on the "Register" link
    Then I should see "Sign up"

  Scenario: Create an account
    Given I am on the "/users/sign_in" page
    When I click on the "Sign up" link
    And I fill in the "user_email" field with "test_author@gmail.com"
    And I fill in the "user_password" field with "password"
    And I fill in the "user_password_confirmation" field with "password"
    And I click on the "Sign up" button
    Then a user "test_author@gmail.com" should exist

  Scenario: Login to an existing account
    Given I am on the "/" page
    And a user "test_author@gmail.com" exists
    When I click on the "Login" link
    And I fill in the "user_email" field with "test_author@gmail.com"
    And I fill in the "user_password" field with "password"
    And I click on the "Log in" button
    Then I should see "Signed in successfully."

  Scenario: Edit an existing account
    Given I am logged in as test_author@gmail.com
    And I am on the "/" page
    When I click on the "Profile" link
    Then I should see "Account Details"
