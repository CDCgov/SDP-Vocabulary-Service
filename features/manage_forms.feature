Feature: Manage Forms
  As an author
  I want to create and manage Forms
  Scenario: Form List View
    Given I have a Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    Then I should see "Test Form"
    When I click on the menu link for the Form with the name "Test Form"
    Then I should see the option to Delete the Form with the name "Test Form"
    And I should see the option to View the Form with the name "Test Form"
    And I should see the option to Revise the Form with the name "Test Form"

  Scenario: Show Form in Detail
    Given I have a Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to View the Form with the name "Test Form"
    Then I should see "Name: Test Form"

  Scenario: Revise Form
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Revise the Form with the name "Test Form"
    And I fill in the "form_name" field with "Gender Form"
    And I click on the button to add the Question "What is your gender?"
    Then I select the "Gender Partial" option in the "response_set_ids" list
    And I click on the "Save" button
    Then I should see "Name: Gender Form"
    And I should see "What is your gender?"
    And I should see "Gender Partial"

  Scenario: Reorder Questions
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Question with the content "What is your name?" and the type "MC"
    And I have a Response Set with the name "Gender Partial"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Revise the Form with the name "Test Form"
    And I click on the button to add the Question "What is your gender?"
    And I click on the button to add the Question "What is your name?"
    And I move the Question "What is your name?" up
    And I move the Question "What is your name?" down
    And I click on the "Save" button
    And I should see "What is your gender?"
    And I should see "Gender Partial"

  Scenario: Create New Form from List
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the "New Form" link
    And I fill in the "form_name" field with "Test Form"
    And I fill in the "form_control_number" field with "1234-1234"
    And I click on the button to add the Question "What is your gender?"
    Then I select the "Gender Full" option in the "response_set_ids" list
    And I click on the "Save" button
    Then I should see "Name: Test Form"
    And I should see "What is your gender?"

  Scenario: An invalid control number should not allow save
    Given I have a Response Set with the name "Gender Full"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the "New Form" link
    And I fill in the "form_name" field with "Test Form"
    And I fill in the "form_control_number" field with "1234"
    And I click on the button to add the Question "What is your gender?"
    Then I select the "Gender Full" option in the "response_set_ids" list
    And I click on the "Save" button
    Then I should see "error(s) prohibited this form from being saved"
    And I should see "Control number: must be a valid OMB Control Number"

  Scenario: Delete Form
    Given I have a Form with the name "Test Form"
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the menu link for the Form with the name "Test Form"
    And I click on the option to Delete the Form with the name "Test Form"
    And I confirm my action
    Then I should see "Form was successfully destroyed."
    And I should not see "Test Form"

  Scenario: Export Form
    Given I have a Form with the name "Test Form"
    And I have a Question with the content "What is your gender?" and the type "MC"
    And I have a Response Set with the name "Gender Partial" and the description "Gender example" and with the Responses Male, Female
    And I am logged in as test_author@gmail.com
    When I go to the list of Forms
    And I click on the "New Form" link
    And I fill in the "form_name" field with "Test Form"
    And I click on the button to add the Question "What is your gender?"
    And I select the "Gender Partial" option in the "response_set_ids" list
    And I click on the "Save" button
  

    Scenario: Export Form to Redcap
      Given I have a Form with the name "Test Form"
      And I have a Question with the content "What is your gender?" and the type "MC"
      And I have a Response Set with the name "Gender Partial" and the description "Gender example" and with the Responses Male, Female
      And I am logged in as test_author@gmail.com
      When I go to the list of Forms
      And I click on the "New Form" link
      And I fill in the "form_name" field with "Test Form"
      And I click on the button to add the Question "What is your gender?"
      And I select the "Gender Partial" option in the "response_set_ids" list
      And I click on the "Save" button
      And I click on the "Export to Redcap" link
      Then I should get a download with the filename "test form_redcap.xml"
