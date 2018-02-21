Feature: Manage Sections
  As an author
  I want to manage Sections
  Scenario: Section List Details
    Given I have a published Section with the name "Test Section"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    Then I should see "Test Section"
    When I click on the menu link for the Section with the name "Test Section"
    And I should see the option to Details the Section with the name "Test Section"
    And I should see the option to Revise the Section with the name "Test Section"

  Scenario: Show Section in Detail
    Given I have a Section with the name "Test Section" and the description "Section description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Details the Section with the name "Test Section"
    Then I should see "Test Section"
    Then I should see "Section description"

  Scenario: Send a Draft Section to a Publisher
    Given I have a Section with the name "Test Section" and the description "Section description"
    And I have a publisher "johnny@test.org" with the first name "Johnny" and last name "Test"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Details the Section with the name "Test Section"
    Then I should see "Test Section"
    And I should see "Send to publisher"
    When I click on the "Send to publisher" button
    And I should see "Johnny Test <johnny@test.org>"

  Scenario: Delete Section
    Given I have a Section with the name "Test Section" and the description "Section description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Details the Section with the name "Test Section"
    When I click on the "Delete" link and confirm my action
    Then I go to the dashboard
    When I go to the list of Sections
    Then I should not see "Test Section"

  Scenario: Publish a Draft Section
    Given I have a Section with the name "Test Section" and the description "Section description"
    And I am the publisher test_publisher@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Details the Section with the name "Test Section"
    Then I should see "Test Section"
    Then I should see "Section description"
    When I click on the "Publish" link
    And I should not see "Revise"
    And I should see "Published By: test_publisher@gmail.com"
    And I should not see "Edit"
    And I should not see a "Publish" link
