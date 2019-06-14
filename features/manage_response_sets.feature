Feature: Manage Response Sets
  As an author
  I want to create and manage Response Sets
  Scenario: Response Set List View
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    Then I should see the option to Details the Response Set with the name "Gender Full"
    And I should not see the option to Revise the Response Set with the name "Gender Full"
    And I should not see the option to Extend the Response Set with the name "Gender Full"
    And I should see the option to Edit the Response Set with the name "Gender Full"

  Scenario: Show Response Set in Detail
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Response Set with the name "Gender Full" linked to Surveillance System "National Violent Death Reporting System"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Name: Gender Full"
    And I should see "Response set description"
    And I should see "Original Response"
    And I should see "Source: Local"
    And I should see "Surveillance Programs: 0"
    And I should see "Surveillance Systems: 1"

  Scenario: Show response set with many linkages
    Given I have a Response Set with 20 question linkages
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "test rs"
    And I click on the option to Details the Response Set with the name "test rs"
    Then I should see "Name: test rs"
    And I should see "qtest 3"
    And I should not see "qtest 13"

  Scenario: Show Response Set in Detail No Responses
    Given I have a Response Set with the name "Gender Full" and the description "Response set description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Name: Gender Full"
    And I should see "Response set description"
    And I should see "No Responses Selected"

  Scenario: Edit a Draft Response Set
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    And I click on the "Change History" link
    Then I should see "No changes have been made to this version."
    And I should not see "Changes by"
    And I should see "Edit"
    When I click on the "Edit" button
    And I fill in the "response-set-name" field with "Gender Partial"
    And I fill in the "save-with-comment" field with "Testing comment functionality on edit"
    And I fill in the "Description" field with "M / F"
    And I fill in the "Tags" field with "TagTest1"
    And I tab out of the "Tags" field
    And I click on the "Save" button
    Then I should see "Gender Partial"
    And I should see "M / F"
    And I should see "TagTest1"
    And I should not see "Publish"
    When I click on the "Change History" link
    Then I should see "Notes / Comments: Testing comment functionality on edit"
    Then I should see "Changes by test_author@gmail.com"
    And I should see "field changed from"
    And I should not see "No changes have been made to this version."
    When I click on the "Update Tags" link
    And I fill in the "Tags" field with "TagTest2"
    And I tab out of the "Tags" field
    And I click on the "Save" button
    Then I should see "TagTest1, TagTest2"

  Scenario: Send a Draft Response Set to a Publisher
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    And I have a publisher "johnny@test.org" with the first name "Johnny" and last name "Test"
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Send"
    When I click on the "Send" button
    And I should see "Johnny Test <johnny@test.org>"

   Scenario: Delete a draft Response Set
    Given I have a Response Set with the name "Test Response Set" and the description "Response Set description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the menu link for the Response Set with the name "Test Response Set"
    And I click on the option to Details the Response Set with the name "Test Response Set"
    When I click on the "Delete" link
    Then I should see "Are you sure you want to delete this response set?"
    When I click on the "Delete Response Set" link
    Then I go to the dashboard
    When I go to the list of Response Sets
    Then I should not see "Test Response Set"

  Scenario: Publish and retire a Draft Response Set
    Given I have a Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am the publisher test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    Then I should see "Edit"
    And I should see "Publish"
    And I should not see "Revise"
    And I should not see "Extend"
    When I click on the "Publish" button
    Then I should see "This action cannot be undone"
    When I click on the "Confirm Publish" link
    Then I should see "Extend"
    And I should see "Revise"
    And I should see "Published By: test_author@gmail.com"
    And I should not see "Edit"
    And I should see "Retire"
    When I click on the "Retire" link
    Then I should see "Are you sure"
    When I click on the "Confirm Retire" link
    Then I should see "Content Stage: Retired"
    And I should see "(Retired)"

  Scenario: Revise Response Set
    Given I have a published Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I fill in the "response-set-name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    And I click on the "Save" button
    Then I should see "Version: 2"
    And I should see "Gender Partial"
    And I should see "M / F"
    And I should see "Test Response 2"
    And I should not see "Original Response"

  Scenario: Revise Response Set Removing Response
    Given I have a published Response Set with the name "Gender Full" and the description "Response set description" and the response "Male"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Revise the Response Set with the name "Gender Full"
    And I click on the link to remove the Response "Male" in row number 1
    And I click on the "Save" button
    Then I should see "Version: 2"
    And I should see "Gender Full"
    And I should not see "Male"

  Scenario: Extend Response Set
    Given I have a published Response Set with the name "Gender Full" and the description "Response set description" and the response "Original Response"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Extend the Response Set with the name "Gender Full"
    And I fill in the "response-set-name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F / O"
    And I click on the "Add Row" link
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    And I click on the "Save" button
    Then I should see "Version: 1"
    And I should see "Extended from: Gender Full"
    And I should see "Gender Partial"
    And I should see "M / F / O"
    And I should see "Test Response 2"
    And I should not see "Original Response"

  Scenario: Create New Response Set
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the create "Response Sets" dropdown item
    And I fill in the "response-set-name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Response 1"
    And I fill in the "value_1" field with "Test Response 2"
    And I fill in the "value_2" field with "Test Response 3"
    And I fill in the "codeSystem_0" field with "Test System 1"
    And I fill in the "codeSystem_1" field with "Test System 2"
    And I fill in the "codeSystem_2" field with "Test System 3"
    And I fill in the "displayName_0" field with "Test Name 1"
    And I fill in the "displayName_1" field with "Test Name 2"
    And I fill in the "displayName_2" field with "Test Name 3"
    And I click on the "remove_2" link
    And I click on the "Save" button
    Then I should see "Version: 1"
    And I should see "Gender Partial"
    And I should see "Test Response 1"
    And I should see "Test Response 2"
    And I should not see "Test Response 3"
    And I should see "Test System 1"
    And I should see "Test System 2"
    And I should not see "Test System 3"
    And I should see "Test Name 1"
    And I should see "Test Name 2"
    And I should not see "Test Name 3"

  Scenario: Create New Response Set with warning modal
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the create "Response Sets" dropdown item
    And I fill in the "response-set-name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Response 1"
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    And I wait 2 seconds
    And I go to the list of Response Sets
    And I should see "Gender Partial"
    And I should see "M / F"

  Scenario: Abandon New Response Set with warning modal
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the create "Response Sets" dropdown item
    And I fill in the "response-set-name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Response 1"
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Continue Without Saving" button
    And I go to the list of Response Sets
    Then I should not see "Gender Partial"

  Scenario: Close the warning modal on New Response Set with the escape key
    Given I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    And I click on the create "Response Sets" dropdown item
    And I fill in the "response-set-name" field with "Gender Partial"
    And I fill in the "Description" field with "M / F"
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Response 1"
    And I fill in the "value_1" field with "Test Response 2"
    And I click on the "remove_0" link
    When I click on the "CDC Vocabulary Service" link
    Then I should see "Unsaved Changes"
    Then I press the key escape
    Then I should not see "Unsaved Changes"

  Scenario: Create New Response Set PHIN VADS Source
    Given I am logged in as test_author@gmail.com
    Given I have a Response Set with the name "Birth Outcome (Rubella)" and the description "Response set description" with oid "2.16.840.1.114222.4.11.3323"
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Birth Outcome (Rubella)"
    And I click on the option to Details the Response Set with the name "Birth Outcome (Rubella)"
    Then I should see "Name: Birth Outcome (Rubella)"
    And I should see "Source: PHIN VADS"
    Then I go to the dashboard
    When I go to the list of Response Sets
    Then I should see "Birth Outcome (Rubella)"
    When I go to the dashboard
    And I fill in the "search" field with "Birth Outcome"
    And I click on the "search-btn" button
    Then I should see "Birth Outcome (Rubella)"
    And I should see the "PHIN VADS" link

  Scenario: Create New Response Set Local Source
    Given I am logged in as test_author@gmail.com
    Given I have a Response Set with the name "Body Type" and the description "Body Type description"
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Body Type"
    And I click on the option to Details the Response Set with the name "Body Type"
    Then I should see "Name: Body Type"
    And I should see "Source: Local"
    Then I go to the dashboard
    When I go to the list of Response Sets
    Then I should see "Body Type"
    When I go to the dashboard
    And I fill in the "search" field with "Body Type"
    And I click on the "search-btn" button
    Then I should see "Body Type"
    And I should not see a "PHIN VADS" link

  Scenario: View info buttons in a Response Set
    Given I have a Response Set with the name "Gender Full"
    And I am logged in as test_author@gmail.com
    When I go to the list of Response Sets
    When I click on the menu link for the Response Set with the name "Gender Full"
    And I click on the option to Details the Response Set with the name "Gender Full"
    When I click on the "Click for info about this item (Version)" button
    Then I click on the "Close" button
    When I click on the "Click for info about this item (Content Stage)" button
    Then I click on the "Close" button
  # When I click on the "Click for info about this item (Public)" button
  # Then I click on the "Close" button
    When I click on the "Click for info about this item (Private)" button
    Then I click on the "Close" button
