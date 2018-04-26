Feature: Import Spreadsheet
  As an author
  I want to import a spreadsheet through the UI
  Scenario: Create Survey using importer
    Given I am logged in as test_author@gmail.com
    When I go to the dashboard
    Then I wait 5 seconds
    And I click on the create "Import MMG" dropdown item
    And I attach an MMG to the "file-select" input
    Then I wait 5 seconds
    And I should see "TestMMG.xlsx"
    And I should see "Value set tab 'Yes No Unknown (YNU)' not present"
    When I click on the "Import" button
    And I wait 10 seconds
    Then I should see "File imported with warnings"
    When I click on the "View Survey" button
    Then I should see "Survey Name: TestMMG.xlsx"
    And I should see "Linked Sections: 6"

  Scenario: Create Survey with Blank sheet using importer
      Given I am logged in as test_author@gmail.com
      When I go to the dashboard
      And I click on the create "Import MMG" dropdown item
      And I attach an MMG with a blank sheet to the "file-select" input
      Then I wait 5 seconds
      And I should see "TestMMGBlank.xlsx"
      And I should see "Sheet Blank Sheet skipped because it is blank"
      When I click on the "Import" button
      And I wait 10 seconds
      Then I should see "File imported with warnings"
      When I click on the "View Survey" button
      Then I should see "Survey Name: TestMMGBlank.xlsx"
      And I should see "Linked Sections: 6"

 Scenario: Check that Survey which has no data does not import using importer
      Given I am logged in as test_author@gmail.com
      When I go to the dashboard
      And I click on the create "Import MMG" dropdown item
      And I attach an MMG with no data to the "file-select" input
      Then I wait 5 seconds
      And I should see "TestMMGNoData.xlsx"
      And I should see "File not recognized as MMG Excel spreadsheet"
      When I click on the "Remove" button
      And I wait 10 seconds
      Then I should see "Please select the file you wish to import"
