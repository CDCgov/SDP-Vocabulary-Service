Feature: Manage Responses
  As an author
  I want to create and manage Responses
  Scenario: Response List View
    Given I have responses with the values Male, Female, Prefer not to answer
    When I go to the list of responses
    Then I should see "Male"
    And I should see "Female"
    And I should see "Prefer not to answer"

  #@javascript
  Scenario: Destroy Response
    Given I have responses with the values Male, Female, Prefer not to answer
    And I am logged in as test_author@gmail.com
    When I go to the list of responses
    Then I should see the option to Destroy "Male"
    And I should see the option to Destroy "Female"
    And I should see the option to Destroy "Prefer not to answer"

  Scenario: Show Response in Detail
    Given I have responses with the values Male, Female, Prefer not to answer
    And I am logged in as test_author@gmail.com
    When I go to the list of responses
    Then I should see the option to Show "Male"
    And I should see the option to Show "Female"
    And I should see the option to Show "Prefer not to answer"

  Scenario: Edit Response
    Given I have responses with the values Male, Female, Prefer not to answer
    And I am logged in as test_author@gmail.com
    When I go to the list of responses
    Then I should see the option to Edit "Male"
    And I should see the option to Edit "Female"
    And I should see the option to Edit "Prefer not to answer"
