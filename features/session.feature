Feature: Session Management
  As a user
  I want to register, log in, and log out
  Scenario: Navigate to the sign in page
    Given I am on the "/" page
    When I click on the "Register" link
    Then I should see "Sign Up"

  Scenario: Create an account with default program and system
    Given I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance System with the name "National Vital Statistics System"
    And I have a Surveillance Program with the name "FoodNet"
    And I have a Surveillance Program with the name "Influenza"
    And I am on the "/" page
    When I click on the "Register" link
    And I fill in the "email" field with "test_author@gmail.com"
    And I fill in the "password" field with "password"
    And I fill in the "passwordConfirmation" field with "password"
    And I click on the "Sign Up" button
    Then I should see "test_author@gmail.com"
    And a user "test_author@gmail.com" should exist
    And a user "test_author@gmail.com" should have a last Surveillance System named "National Violent Death Reporting System"
    And a user "test_author@gmail.com" should have a last Surveillance Program named "FoodNet"

  Scenario: Create an account with default program and system after search
    Given I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance System with the name "National Vital Statistics System"
    And I have a Surveillance Program with the name "FoodNet"
    And I have a Surveillance Program with the name "Influenza"
    And I am on the "/" page
    When I click on the "Register" link
    And I fill in the "email" field with "test_author@gmail.com"
    And I fill in the "password" field with "password"
    And I fill in the "passwordConfirmation" field with "password"
    Then I search for the system "vital"
    Then the list "Surveillance System" should not contain the option "National Violent Death Reporting System"
    Then the list "Surveillance System" should contain the option "National Vital Statistics System"
    Then I search for the program "flu"
    Then the list "Surveillance Program" should not contain the option "FoodNet"
    Then the list "Surveillance Program" should contain the option "Influenza"
    And I click on the "Sign Up" button
    Then I should see "test_author@gmail.com"
    And a user "test_author@gmail.com" should exist
    And a user "test_author@gmail.com" should have a last Surveillance System named "National Vital Statistics System"
    And a user "test_author@gmail.com" should have a last Surveillance Program named "Influenza"

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
    Then I search for the system "vital"
    Then the list "Surveillance System" should not contain the option "National Violent Death Reporting System"
    Then the list "Surveillance System" should contain the option "National Vital Statistics System"
    And I select the "National Vital Statistics System" option in the "Surveillance System" list
    Then I search for the program "flu"
    Then the list "Surveillance Program" should not contain the option "FoodNet"
    Then the list "Surveillance Program" should contain the option "Influenza"
    And I select the "Influenza" option in the "Surveillance Program" list
    And I click on the "Sign Up" button
    Then I should see "test_author@gmail.com"
    And a user "test_author@gmail.com" should exist
    And a user "test_author@gmail.com" should have a last Surveillance System named "National Vital Statistics System"
    And a user "test_author@gmail.com" should have a last Surveillance Program named "Influenza"

  Scenario: Login to an existing account
    Given I am on the "/" page
    And a user "test_author@gmail.com" exists
    Then I should see "Author Questions, Response Sets, Sections, and Surveys"
    And I should not see "My Stuff"
    When I click on the "Login" link
    And I fill in the "email" field with "test_author@gmail.com"
    And I fill in the "password" field with "password"
    And I click on the "Log In" button
    Then I should see "test_author@gmail.com"
    And I should see "My Stuff"
    And I should not see "Author Questions, Response Sets, Sections, and Surveys"

  Scenario: Edit an existing account
    Given I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance System with the name "National Vital Statistics System"
    And I have a Surveillance Program with the name "FoodNet"
    And I have a Surveillance Program with the name "Influenza"
    And I am working the program "FoodNet" and system "National Violent Death Reporting System" logged in as test_author@gmail.com
    And I am on the "/" page
    When I click on the "account-dropdown" link
    And I click on the "Settings" link
    Then I should see "Account Details"
    Then I search for the system "violent"
    Then the list "Surveillance System" should contain the option "National Violent Death Reporting System"
    Then the list "Surveillance System" should not contain the option "National Vital Statistics System"
    Then I search for the system "vital"
    Then I take a screenshot named "test"
    Then the list "Surveillance System" should contain the option "National Violent Death Reporting System"
    Then the list "Surveillance System" should contain the option "National Vital Statistics System"
    And I select the "National Vital Statistics System" option in the "Surveillance System" list
    Then I search for the program "food"
    Then the list "Surveillance Program" should contain the option "FoodNet"
    Then the list "Surveillance Program" should not contain the option "Influenza"
    Then I search for the program "flu"
    Then the list "Surveillance Program" should contain the option "FoodNet"
    Then the list "Surveillance Program" should contain the option "Influenza"
    And I select the "Influenza" option in the "Surveillance Program" list
    When I click on the "Update" button
    Then I wait 1 seconds
    And a user "test_author@gmail.com" should have a last Surveillance System named "National Vital Statistics System"
    And a user "test_author@gmail.com" should have a last Surveillance Program named "Influenza"

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

  Scenario: Users who are not logged in should not see create links
    Given I am on the "/" page
    Then I should not see a "Create" link

  Scenario: First time users should see modal with instructions
    Given I am on the "/" page
    Then I should see the "First Time Login" link
    When I click on the "First Time Login" link
    Then I should see "Trouble logging in:"
    And I should see "Continue to SAMS"

  Scenario: On login page should update and users should see their My Stuff content
    Given I am on the "/" page
    And a user "test_author@gmail.com" exists
    And I have a Question with the content "What?" and the description "A simple question"
    And I have a Question with the content "Who?" and the description "Another simple question"
    # This step should be "should not see my stuff" once landing page is merged / test are written
    Then I should see "0 Questions"
    And I should not see "2 Questions"
    When I click on the "Login" link
    And I fill in the "email" field with "test_author@gmail.com"
    And I fill in the "password" field with "password"
    And I click on the "Log In" button
    Then I should see "test_author@gmail.com"
    And I should see "2 Questions"

  Scenario: Users should not be able to access restricted rs pages
    Given I am on the "/landing#/responseSets/new" page
    Then I should see "You are not authorized to see this content, please login."
  Scenario: Users should not be able to access restricted question pages
    Given I am on the "/landing#/questions/new" page
    Then I should see "You are not authorized to see this content, please login."
  Scenario: Users should not be able to access restricted section pages
    Given I am on the "/landing#/sections/new" page
    Then I should see "You are not authorized to see this content, please login."
  Scenario: Users should not be able to access restricted survey pages
    Given I am on the "/landing#/surveys/new" page
    Then I should see "You are not authorized to see this content, please login."

  Scenario: Sessions that expire result in redirection
    Given I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    Then I should see "What is your gender?"
    And I should see "My Stuff"
    Then my session expires
    And I go to the dashboard
    Then I should not see "My Stuff"
    And I should see "Author Questions, Response Sets, Sections, and Surveys"

  Scenario: Accessing content that belongs to another user causes a forbidden error
    Given I am logged in as test_author@gmail.com
    Then I navigate to a question created by "someone@gmail.com"
    Then I should see "You do not have access to this resource."

  Scenario: Dashboard should display Registration link when user registration is not disable
    User registration is "disabled"
    And I am on the "/" page
    Then I should see the "Register" link
    And I should see the link "Login" to "#"

  Scenario: Dashboard should display Registration link when user registration is disabled but display login is true
    Given Disable user registration is "true" and display login is "true"
    And I am on the "/" page
    Then I should see the "Register" link
    And I should see the link "Login" to "#"

  Scenario: Dashboard should not display Registration link when user registration is disable
    Given Disable user registration is "true" and display login is "false"
    And I am on the "/" page
    Then I should not see the "Register" link
    And I should see the link "Login" to "/users/auth/openid_connect"
