Feature: Online Help
  As an application user
  I want access to help documentation and tutorials to learn how to use various pages
  Scenario: View help documentations
    When I go to the dashboard
    And I click on the "Help" link
    And I click on the "Help Documentation" link
    Then I should see "Learn How To"
    When I click on the "Search" link
    Then I should see "Search Functionality"
    When I click on the "Glossary" link
    Then I should see "Data Collection Instrument"
