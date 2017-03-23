Feature: Manage Surveys
  As an author
  I want to create and manage Surveys
  Scenario: Survey List Details
    Given I have a Survey with the name "Test Survey"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    Then I should see "Test Survey"
    When I click on the menu link for the Survey with the name "Test Survey"
    And I should see the option to Details the Survey with the name "Test Survey"
    And I should see the option to Edit the Survey with the name "Test Survey"

    Scenario: Show Survey in Detail
      Given I have a Survey with the name "Test Survey" and the description "Survey description"
      And I am logged in as test_author@gmail.com
      When I go to the list of Surveys
      And I click on the menu link for the Survey with the name "Test Survey"
      And I click on the option to Details the Survey with the name "Test Survey"
      Then I should see "Test Survey"
      Then I should see "Survey description"
