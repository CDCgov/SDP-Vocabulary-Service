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

 Scenario: Revise Survey
   Given I have a published Survey with the name "Test Survey" and the description "Survey description"
   Given I have a published Form with the name "Test Gender Form" and the description "Form description"
   And I am logged in as test_author@gmail.com
   When I go to the list of Surveys
   And I click on the menu link for the Survey with the name "Test Survey"
   And I click on the option to Revise the Survey with the name "Test Survey"
   And I fill in the "name" field with "Gender Survey"
   And I fill in the "description" field with "Revised Description"
   And I fill in the "search" field with "Gender"
   And I click on the "Add to Survey" drop-down option for the form "Test Gender Form"
   And I click on the "Save" button
   Then I should see "Name: Gender Survey"
   Then I should see "Revised Description"
   And I should see "Test Gender Form"
   And I should see "Publish"
   And I should see "Edit"

 Scenario: Delete a draft Survey
  Given I have a Survey with the name "Test Survey" and the description "Survey description"
  And I am logged in as test_author@gmail.com
  When I go to the list of Surveys
  And I click on the menu link for the Survey with the name "Test Survey"
  And I click on the option to Details the Survey with the name "Test Survey"
  When I click on the "Delete" link
  When I confirm my action
  Then I go to the dashboard
  When I go to the list of Surveys
  Then I should not see "Test Survey"

 Scenario: Publish a draft Survey
   Given I have a Survey with the name "Test Survey" and the description "Survey description"
   And I am logged in as test_author@gmail.com
   When I go to the list of Surveys
   And I click on the menu link for the Survey with the name "Test Survey"
   And I click on the option to Details the Survey with the name "Test Survey"
   Then I should see "Test Survey"
   Then I should see "Survey description"
   When I click on the "Publish" link
   Then I should not see "Publish"
   And I should see "Revise"
   And I should not see "Edit"

  Scenario: Edit a draft Survey
    Given I have a Survey with the name "Test Survey" and the description "Survey description"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Details the Survey with the name "Test Survey"
    Then I should see "Test Survey"
    Then I should see "Survey description"
    When I click on the "Edit" link
    And I fill in the "name" field with "Edited Survey"
    And I click on the "Save" button
    Then I should see "Name: Edited Survey"
    Then I should see "Survey description"
    And I should see "Publish"
    And I should see "Edit"

  Scenario: Reorder forms on a Survey
    Given I have a published Survey with the name "Test Survey"
    And I have a Form with the name "Gender Form"
    And I have a Form with the name "Demographics Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Surveys
    And I click on the menu link for the Survey with the name "Test Survey"
    And I click on the option to Revise the Survey with the name "Test Survey"
    And I fill in the "search" field with "Form"
    And I click on the "Add to Survey" drop-down option for the form "Gender Form"
    And I click on the "Add to Survey" drop-down option for the form "Demographics Form"
    And I move the Form "Gender Form" down
    And I move the Form "Gender Form" up
    And I click on the "Save" button
    And I should see "Gender Form"
    And I should see "Demographics Form"


  Scenario: Create New Survey with warning modal
    Given I have a Form with the name "Gender Form"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Surveys" dropdown item
    And I fill in the "name" field with "Test Survey"
    And I fill in the "controlNumber" field with "1234-1234"
    And I fill in the "search" field with "Gender"
    And I click on the "Add to Survey" drop-down option for the form "Gender Form"
    When I click on the "CDC Vocabulary Service" link
    And I click on the "Save & Leave" button
    And I wait 1 seconds
    And I go to the dashboard
    Then I should see "Test Survey"


 Scenario: Abandon New Survey with warning modal
   Given I have a Form with the name "Gender Form"
   And I am logged in as test_author@gmail.com
   When I go to the dashboard
   And I click on the create "Surveys" dropdown item
   And I fill in the "name" field with "Test Survey"
   And I fill in the "controlNumber" field with "1234-1234"
   And I fill in the "search" field with "Gender"
   And I click on the "Add to Survey" drop-down option for the form "Gender Form"
   When I click on the "CDC Vocabulary Service" link
   And I click on the "Continue Without Saving" button
   And I wait 1 seconds
   And I go to the dashboard
   Then I should not see "Test Survey"

  Scenario: An invalid control number should not allow save
    Given I have a Form with the name "Gender Form"
    And I am logged in as test_author@gmail.com
    When I go to the dashboard
    And I click on the create "Surveys" dropdown item
    And I fill in the "name" field with "Test Survey"
    And I fill in the "controlNumber" field with "1234"
    And I click on the "Save" button
    Then I should see "error(s) prohibited this form from being saved"
    And I should see "controlNumber - must be a valid OMB Control Number"