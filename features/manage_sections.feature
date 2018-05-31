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
    And I should see "Send"
    When I click on the "Send" button
    And I should see "Johnny Test <johnny@test.org>"

  Scenario: Delete Section
    Given I have a Section with the name "Test Section" and the description "Section description"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Edit the Section with the name "Test Section"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I click on the "Save" button
    Then I wait 1 seconds
    When I click on the "Linked Questions" link
    And I should see "What is your gender?"
    When I click on the "Delete" link
    Then I should see "Are you sure you want to delete this section?"
    When I click on the "Delete Section" link
    Then I go to the dashboard
    When I go to the list of Sections
    Then I should not see "Test Section"
    When I go to the list of Questions
    Then I should see "What is your gender?"

  Scenario: Delete all Sections and Questions
    Given I have a Section with the name "Test Section"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Question with the content "What is your name?" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "Test Section"
    And I click on the option to Edit the Section with the name "Test Section"
    And I fill in the "search" field with "What"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your gender?"
    And I use the response set search modal to select "Gender Partial"
    And I set search filter to "question"
    And I click on the "search-btn" button
    And I use the question search to select "What is your name?"
    And I click on the "Save" button
    Then I wait 1 seconds
    When I click on the "Linked Questions" link
    And I should see "What is your gender?"
    And I should see the question "What is your name?" first
    And I should see the response set "Gender Partial" second
    When I click on the "Delete" link
    Then I should see "Are you sure you want to delete this section?"
    When I click on the "Delete All" link
    And I wait 1 seconds
    When I go to the list of Sections
    Then I should not see "Test Section"
    When I go to the list of Questions
    Then I should not see "What is your name?"
    When I go to the list of Response Sets
    Then I should not see "Gender Partial"

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
