Feature: Privacy statement
  As a product owner
  I want user to be able to view a privacy statement
  Scenario: View privacy statement
    When I go to the dashboard
    And I click on the "Privacy" link
    Then I should see "The material embodied in this software is"
