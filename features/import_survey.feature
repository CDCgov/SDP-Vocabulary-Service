Feature: Import Spreadsheet
  As an author
  I want to import a spreadsheet through the UI
  Scenario: Create Survey using importer
    Given I am logged in as test_author@gmail.com
    When I go to the dashboard
    Then I wait 5 seconds
    And I click on the create "Import Spreadsheet" dropdown item
    And I select the "import-type-mmg" radio button
    And I attach an MMG to the "file-select" input
    Then I wait 5 seconds
    And I should see "TestMMG.xlsx"
    And I should see "'Introduction' tab does not contain expected"
    When I click on the "Import" button
    And I wait 10 seconds
    Then I should see "File imported with warnings"
    When I click on the "View Survey" button
    Then I should see "Survey Name: TestMMG.xlsx"
    # Removed ': 6' due to info-button
    And I should see "Linked Sections"

  Scenario: Create Survey with Blank sheet using importer
      Given I am logged in as test_author@gmail.com
      When I go to the dashboard
      And I click on the create "Import Spreadsheet" dropdown item
      And I select the "import-type-mmg" radio button
      And I attach an MMG with a blank sheet to the "file-select" input
      Then I wait 5 seconds
      And I should see "TestMMGBlank.xlsx"
      And I should see "Sheet Blank Sheet skipped because it is blank"
      When I click on the "Import" button
      And I wait 10 seconds
      Then I should see "File imported with warnings"
      When I click on the "View Survey" button
      Then I should see "Survey Name: TestMMGBlank.xlsx"
      # Removed ': 6' due to info-button
      And I should see "Linked Sections"

 Scenario: Check that Survey which has no data does not import using importer
      Given I am logged in as test_author@gmail.com
      When I go to the dashboard
      And I click on the create "Import Spreadsheet" dropdown item
      And I select the "import-type-mmg" radio button
      And I attach an MMG with no data to the "file-select" input
      Then I wait 5 seconds
      And I should see "TestMMGNoData.xlsx"
      And I should see "File not recognized as MMG Excel spreadsheet"
      When I click on the "Remove" button
      And I wait 2 seconds
      Then I should see "Please select the file you wish to import"

Scenario: Create Survey from Generically Formatted Spreadsheet
      Given I am logged in as test_author@gmail.com
      When I go to the dashboard
      And I click on the create "Import Spreadsheet" dropdown item
      And I select the "import-type-generic" radio button
      And I attach a generic spreadsheet to the "file-select" input
      Then I wait 5 seconds
      And I should see "TestGenericTemplateMini.xlsx"
      And I should see "Warning: Sheet Sheet1 skipped"
      When I click on the "Import" button
      And I wait 30 seconds
      Then I should see "File imported with warnings"
      When I click on the "View Survey" button
      And I wait 10 seconds
      Then I should see "Survey Name: TestGenericTemplateMini.xlsx"
      # Removed ': 1' due to info-button
      And I should see "Linked Sections"

Scenario: Check that Survey Import fails from badly Formatted Generic Spreadsheet
      Given I am logged in as test_author@gmail.com
      When I go to the dashboard
      And I click on the create "Import Spreadsheet" dropdown item
      And I select the "import-type-generic" radio button
      And I attach a generic spreadsheet with bad format to the "file-select" input
      Then I wait 5 seconds
      And I should see "TestGenericTemplateBad.xlsx"
      And I should see "This Excel file does not contain any tabs. with the expected generic column name format and will not be imported."
      Then I should see "File format not able to be imported"
      When I click on the "Remove" button
      Then I should see "Please select the file you wish to import"
