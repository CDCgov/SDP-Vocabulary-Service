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

  Scenario: In app Whats New page
    When I go to the dashboard
    And I click on the "Help" link
    And I click on the "What‘s New" link
    Then I should see "Release Notes"
    And I should see "Find Out What‘s New In"

  Scenario: Step-by-Step
    When I go to the dashboard
    And I click on the "Help" link
    And I click on the "Step-by-Step Walkthrough" link
    Then I should see "Click next"
    When I click on the "Next" link
    Then I should see "Results include private items"
