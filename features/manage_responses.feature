Feature: Manage Responses
  As an author
  I want to create and manage Responses
  Scenario: Response List View
    Given I have a Response Set with the name "Gender Full"
    And I have the Responses: Male, 1; Female, 1; Prefer not to answer, 1
    And I am logged in as test_author@gmail.com
    When I go to the list of Responses
    Then I should see "Male"
    And I should see "Female"
    And I should see "Prefer not to answer"
    And I should see the option to Destroy the Response with the value "Male"
    And I should see the option to Destroy the Response with the value "Female"
    And I should see the option to Destroy the Response with the value "Prefer not to answer"
    And I should see the option to Show the Response with the value "Male"
    And I should see the option to Show the Response with the value "Female"
    And I should see the option to Show the Response with the value "Prefer not to answer"
    And I should see the option to Edit the Response with the value "Male"
    And I should see the option to Edit the Response with the value "Female"
    And I should see the option to Edit the Response with the value "Prefer not to answer"

  Scenario: Show Response in Detail
    Given I have a Response Set with the name "Gender Full"
    And I have the Responses: Male, 1; Female, 1; Prefer not to answer, 1
    And I am logged in as test_author@gmail.com
    When I go to the list of Responses
    And I click on the option to Show the Response with the value "Male"
    Then I should see "Value: Male"

  Scenario: Edit Response
    Given I have a Response Set with the name "Gender Full"
    And I have a Response Set with the name "Gender Alien"
    And I have the Responses: Male, 1; Female, 1; Prefer not to answer, 1
    And I am logged in as test_author@gmail.com
    When I go to the list of Responses
    And I click on the option to Edit the Response with the value "Male"
    And I fill in the "Value" field with "Dalek"
    And I fill in the "Response set" field with "2"
    And I click on the "Update Response" button
    Then I should see "Response was successfully updated."
    And I should see "Dalek"
  
  Scenario: Create New Response from List
    Given I have a Response Set with the name "Gender Full"
    Given I am logged in as test_author@gmail.com
    When I go to the list of Responses
    And I click on the "New Response" link
    And I fill in the "Value" field with "Dalek"
    And I fill in the "Response set" field with "1"
    And I click on the "Create Response" button
    Then I should see "Response was successfully created."
    And I should see "Dalek"
  
  Scenario: Destroy Response
    Given I have a Response Set with the name "Gender Full"
    And I have the Responses: Male, 1; Female, 1; Prefer not to answer, 1
    And I am logged in as test_author@gmail.com
    When I go to the list of Responses
    And I click on the option to Destroy the Response with the value "Male"
    And I confirm my action
    Then I should see "Response was successfully destroyed."
    And I should not see "Male"
