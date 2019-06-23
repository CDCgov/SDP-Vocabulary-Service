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
    When I click on the "Export" button
    Then I should see "REDCap (XML)"
    And I should see "Epi Info (XML)"
    And I should see "Spreadsheet (XLSX)"
    And I should see "Survey Details [DRAFT]"
    When I click on the "Stage" button
    Then I should see "Update Content Stage:"
    And I should see "Comment Only"
    When I click on the "Trial Use" link
    Then I should see "Survey Details [TRIAL USE]"
    And I should see "Version 1 (Trial Use)"
    And I should see "Visibility: Private (authors and publishers only)"

  Scenario: Show published Survey to unauthenticated user
    Given I have a published Survey with the name "Test Survey" and the description "Survey description"
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Details the Survey with the name "Test Survey"
    Then I should see "Test Survey"
    And I should see "Survey description"
    And I should not see "Curate"

  Scenario: Send a Draft Survey to a Publisher
    Given I have a Survey with the name "Test Survey" and the description "Survey description"
    And I have a publisher "johnny@test.org" with the first name "Johnny" and last name "Test"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Details the Survey with the name "Test Survey"
    Then I should see "Test Survey"
    And I should see "Send"
    When I click on the "Send" button
    And I should see "Johnny Test <johnny@test.org>"

 Scenario: Revise Survey
   Given I have a published Survey with the name "Test Survey" and the description "Survey description"
   Given I have a published Section with the name "Test Gender Section" and the description "Section description"
   And I am logged in as test_author@gmail.com
   When I go to the dashboard
   And I click on the menu link for the Survey with the name "Test Survey"
   And I click on the option to Revise the Survey with the name "Test Survey"
   And I fill in the "survey-name" field with "Gender Survey"
   And I fill in the "survey-description" field with "Revised Description"
   And I fill in the "Tags" field with "TagTest1"
   And I tab out of the "Tags" field
   And I fill in the "search" field with "Gender"
   And I click on the "search-btn" button
   And I use the section search to select "Test Gender Section"
   And I click on the "Save" button
   Then I should see "Name: Gender Survey"
   Then I should see "Revised Description"
   And I should see "TagTest1"
   When I click on the "Linked Sections" link
   And I should see "Test Gender Section"
   And I should see "(Published)"
   And I should see "Edit"
   When I click on the "Test Gender Section" link
   And I click on the "Parent Items" link
   Then I should see "Gender Survey"

  Scenario: Extend Survey
    Given I have a published Survey with the name "Test Survey" and the description "Parent description"
    Given I have a published Section with the name "Test Gender Section" and the description "Section description"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Extend the Survey with the name "Test Survey"
    And I fill in the "survey-name" field with "Test Survey Extended"
    And I fill in the "search" field with "Gender"
    And I click on the "search-btn" button
    And I use the section search to select "Test Gender Section"
    And I click on the "Save" button
    Then I should see "Name: Test Survey Extended"
    Then I should see "Parent description"
    And I should see "Extended from: Test Survey"
    When I click on the "Linked Sections" link
    And I should see "Test Gender Section"
    And I should not see "Publish"
  # And I should see "Version: 1"
    And I should see "Edit"

 Scenario: Delete a draft Survey
  Given I have a Survey with the name "Test Survey" and the description "Survey description"
  And I am logged in as test_author@gmail.com
  When I go to the list of Surveys
  And I click on the menu link for the Survey with the name "Test Survey"
  And I click on the option to Details the Survey with the name "Test Survey"
  When I click on the "Delete" link
  Then I should see "Are you sure you want to delete this survey?"
  When I click on the "Delete Survey" link
  Then I go to the dashboard
  When I go to the list of Surveys
  Then I should not see "Test Survey"

 Scenario: Publish and Retire a draft Survey
   Given I have a Survey with the name "Test Survey" and the description "Survey description"
   And I am the publisher test_author@gmail.com
   When I go to the list of Surveys
   And I click on the menu link for the Survey with the name "Test Survey"
   And I click on the option to Details the Survey with the name "Test Survey"
   Then I should see "Test Survey"
   Then I should see "Survey description"
   When I click on the "Publish" link
   Then I should see "This action cannot be undone"
   When I click on the "Confirm Publish" link
   Then I should see "Revise"
   And I should see "Published By: test_author@gmail.com"
   And I should not see "Edit"
   And I should see "Retire"
   When I click on the "Retire" link
   Then I should see "Are you sure"
   When I click on the "Confirm Retire" link
   Then I should see "Content Stage: Retired"

  Scenario: Edit a draft Survey
    Given I have a Surveillance System with the name "National Violent Death Reporting System"
    And I have a Surveillance Program with the name "FoodNet"
    And I have a Surveillance Program with the name "Influenza"
    And I have a Survey with the name "Test Survey" and the description "Survey description" and the concept "Healthcare Concept"
    And I am working the program "FoodNet" and system "National Violent Death Reporting System" logged in as test_author@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Details the Survey with the name "Test Survey"
    Then I should see "Test Survey"
    And I should see "Survey description"
    And I should see "Healthcare Concept"
    When I click on the "Edit" link
    Then I should see "FoodNet"
    When I click on the "FoodNet Click to edit program" link
    And I search for the program "flu"
    Then the list "Surveillance Program" should contain the option "FoodNet"
    And the list "Surveillance Program" should contain the option "Influenza"
    When I select the "Influenza" option in the "Surveillance Program" list
    And I click on the "Update" button
    And I fill in the "survey-name" field with "Edited Survey"
    And I click on the "Add Row" link
    And I fill in the "value_0" field with "Test Concept 1"
    And I fill in the "value_1" field with "Test Concept 2"
    And I click on the "remove_0" link
    And I fill in the "save-with-comment" field with "Testing comment functionality on edit"
    And I click on the "Save" button
    Then I should see "Name: Edited Survey"
    And I should see "Survey description"
    And I should see "Surveillance Program: Influenza"
    And I should not see "FoodNet"
    And I should see "Test Concept 2"
    And I should not see "Test Concept 1"
    And I should not see "Publish"
    And I should see "Edit"
    And I should see "Surveillance System: National Violent Death Reporting System"
    When I click on the "Change History" link
    Then I should see "Notes / Comments: Testing comment functionality on edit"
    Then I should see "Changes by test_author@gmail.com"
    And I should see "field changed from"

  Scenario: Reorder sections on a Survey
    Given I have a published Survey with the name "Test Survey"
    And I have a Section with the name "Gender Section"
    And I have a Section with the name "Demographics Section"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Revise the Survey with the name "Test Survey"
    And I fill in the "search" field with "Section"
    And I click on the "search-btn" button
    And I should not see "Result Already Added"
    And I use the section search to select "Gender Section"
    And I use the section search to select "Demographics Section"
    And I wait 3 seconds
    And I move the Section "Gender Section" down
    And I move the Section "Gender Section" up
    And I should see "Result Already Added"
    And I click on the "Save" button
    And I click on the "Linked Sections" link
    Then I should see "Gender Section"
    And I should see "Demographics Section"


  Scenario: Create New Survey with warning modal
    Given I have a Section with the name "Gender Section"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Surveys" dropdown item
    And I fill in the "survey-name" field with "Test Survey"
    And I fill in the "controlNumber" field with "1234-1234"
    And I fill in the "search" field with "Gender"
    And I click on the "search-btn" button
    And I use the section search to select "Gender Section"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    And I wait 1 seconds
    And I go to the dashboard
    Then I should see "Test Survey"


 Scenario: Abandon New Survey with warning modal
   Given I have a Section with the name "Gender Section"
   And I am logged in as test_author@gmail.com
   When I go to the dashboard
   And I click on the create "Surveys" dropdown item
   And I fill in the "survey-name" field with "Test Survey"
   And I fill in the "controlNumber" field with "1234-1234"
   And I fill in the "search" field with "Gender"
   And I click on the "search-btn" button
   And I use the section search to select "Gender Section"
   When I click on the "CDC Vocabulary Service" link
   And I click on the "Continue Without Saving" button
   And I wait 1 seconds
   And I go to the dashboard
   Then I should not see "Test Survey"

  Scenario: An invalid control number should not allow save
    Given I have a Section with the name "Gender Section"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Surveys" dropdown item
    And I fill in the "survey-name" field with "Test Survey"
    And I fill in the "controlNumber" field with "1234"
    And I click on the "Save" button
    Then I should see "error(s) prohibited this form from being saved"
    And I should see "controlNumber - must be a valid OMB Control Number"

  Scenario: An author should not be able to publish the survey
    Given I have a Survey with the name "Test Survey" and the description "Survey description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Details the Survey with the name "Test Survey"
    Then I should not see "Publish"

  Scenario: A publisher should not be able to edit another author's survey
    Given I have a Survey with the name "Test Survey" and the description "Survey description"
    And I am the publisher test_publisher@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Details the Survey with the name "Test Survey"
    Then I should see "Publish"
    And I should not see "Revise"

  Scenario: Curate Survey
    Given I have a Section with the name "Test Section"
    And I have a Survey with the name "Test Survey" and the description "Survey description"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Question with the content "What is your name?" and the type "MC"
    And I have a Question with the content "What is your name? Dupe" and the type "MC"
    And I have a published Response Set with the name "Gender Partial"
    And I have a Response Set with the name "Gender Partial dupe"
    And I have a Response Set with the name "Gender Partial again"
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
    When I go to the dashboard
    And I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Edit the Survey with the name "Test Survey"
    And I fill in the "search" field with "Test"
    And I set search filter to "section"
    And I click on the "search-btn" button
    And I use the section search to select "Test Section"
    And I click on the "Save" button
    Then I wait 1 seconds
    And I click on the "Curate" button
    Then I should see "Questions from your Survey w/Suggested Replacements (2)"
    And I should see "Test Section (2)"
    And I should see "Response Sets (1)"
    When I click on the "view-single-What is your gender?" button
    Then I should see "Viewing 1 of 2 Questions w/Suggested Replacements"
    When I click on the "Switch to the next potential duplicate question" button
    Then I should see "Viewing 2 of 2 Questions w/Suggested Replacements"
    When I click on the "select-question-What is your name? Dupe" button
    Then I should see "Select & Replace Confirmation"
    When I click on the "Cancel" button
    And I click on the "(List all)" link
    Then I should see "Test Section (2)"
    When I click on the "Response Sets (1)" link
    Then I should see "Response Sets from Your Survey w/Suggested Replacements (1)"
    And I click on the "view-single-Gender Partial" button
    Then I should see "Suggested Replacement Response Sets ("
    When I click on the "select-response-set-Gender Partial dupe" button
    Then I should see "Mark & Link Confirmation"
    When I click on the "Confirm Link" button
    Then I should see "Successfully linked: Gender Partial with Gender Partial dupe"
    When I click on the "Click for info about this item (Suggested Replacement Response Sets)" button
    Then I click on the "Close" button
    When I click on the "Click for info about this item (Response Set Mark as Reviewed)" button
    Then I click on the "Close" button
    When I click on the "Click for info about this item (Response Set With Suggested Replacements List All)" button
    Then I click on the "Close" button
    When I click on the "Click for info about this item (Response Sets from your Survey with Suggested Replacements)" button
    Then I click on the "Close" button
    When I click on the "Click for info about this item (Response Set Name and Description)" button
    Then I click on the "Close" button
    When I click on the "Click for info about this item (Response Set Action)" button
    Then I click on the "Close" button

  Scenario: See survey breadcrumb
    Given I have a Section with the name "Test Section"
    And I have a Survey with the name "Test Survey" and the description "Survey description"
    And I have a Question with the content "What is your gender?" and the type "MC"
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
    And I click on the "Save" button
    Then I wait 1 seconds
    When I go to the dashboard
    And I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Edit the Survey with the name "Test Survey"
    And I fill in the "search" field with "Test"
    And I set search filter to "section"
    And I click on the "search-btn" button
    And I use the section search to select "Test Section"
    And I click on the "Save" button
    Then I wait 1 seconds
    And I click on the "Linked Sections" link
    And I click on the "Test Section" link
    Then I should see "Test Survey"
    When I click on the "Linked Questions and Sections" link
    And I click on the "What is your gender?" link
    Then I should see "Test Survey"
    And I should see "Test Section"

  Scenario: A Section when added to a Survey should inherit the group assigned to Survey
    Given I have a Survey with the name "Search Survey Test" and the description "Test"
    And I have a Section with the name "New Section" and the description "New section description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Search Survey Test"
    And I click on the option to Details the Survey with the name "Search Survey Test"
    When I click on the "Groups" button
    Then I should see "Group1"
    When I click on the "Click to add content to the Group1 group" button
    And I click on the "Groups" button
    Then I should see "Group1"
    When I click on the "Edit" button
    When I go to the list of Sections
    And I click on the menu link for the Section with the name "New Section"
    Then I should see "Edit"
    And I go to the dashboard
    When I am logged in as new_user_in_group1@gmail.com
    And I go to the dashboard
    And I fill in the "search" field with "New Section"
    And I click on the "search-btn" button
    And I click on the menu link for the Section with the name "New Section"
    And I click on the "Details" link
    Then I should not see "Edit"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Search Survey Test"
    And I click on the option to Details the Survey with the name "Search Survey Test"
    When I click on the "Edit" button
    Then I should see "Edit Survey"
    And I set search filter to "section"
    And I fill in the "search" field with "New Section"
    And I click on the "search-btn" button
    And I use the section search to select "New Section"
    And I click on the "Save" button
    And I wait 2 seconds
    Then I should see "Name: Search Survey Test"
    When I am logged in as new_user_in_group1@gmail.com
    And I wait 2 seconds
    Then I go to the dashboard
    And I fill in the "search" field with "New Section"
    And I click on the "search-btn" button
    And I click on the menu link for the Section with the name "New Section"
    And I click on the "Details" link
    Then I should see "Edit"

    Scenario: Approval Data visible only when there is OMB Approval Code
      Given I have a Survey with the name "Search Survey Test" and the description "Test"
      And I am logged in as test_author@gmail.com
      And I go to the dashboard
      And I click on the create "Surveys" dropdown item
      And I fill in the "survey-name" field with "Test2 Survey"
      And I fill in the "survey-description" field with "OMB Date Test"
      Then I should not see "OMB Approval Date"
      And I fill in the "controlNumber" field with "1234-1234"
      Then I should see "OMB Approval Date"
      And I fill in the "ombApprovalDate" field with "12/12/2015"
      And I click on the "Save" button
      When I go to the dashboard
      And I go to the list of Surveys
      And I click on the menu link for the Survey with the name "Test2 Survey"
      And I click on the option to Edit the Survey with the name "Test2 Survey"
      Then I should see "OMB Approval Date"

    Scenario: View the info buttons in a Survey
      Given I have a Survey with the name "Test Survey" and the description "Survey description"
      And I am logged in as test_author@gmail.com
      When I go to the list of Surveys
      And I click on the menu link for the Survey with the name "Test Survey"
      And I click on the option to Details the Survey with the name "Test Survey"
      When I click on the "Click for info about this item (Version)" button
      Then I click on the "Close" button
      When I click on the "Click for info about this item (Content Stage)" button
      Then I click on the "Close" button
    # When I click on the "Click for info about this item (Public)" button
    # Then I click on the "Close" button
      When I click on the "Click for info about this item (Private)" button
      Then I click on the "Close" button
