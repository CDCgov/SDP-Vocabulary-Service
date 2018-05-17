Feature: Terms of Service statement
  As a product owner
  I want user to be able to view a Terms of Service statement
  Scenario: View Terms of Service statement
    When I go to the dashboard
    And I click on the "Terms of Service" link
    Then I should see "The material embodied in this software is"
