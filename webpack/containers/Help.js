import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSteps } from '../actions/tutorial_actions';
import { Button } from 'react-bootstrap';
import InfoModal from '../components/InfoModal';

class Help extends Component {
  constructor(props){
    super(props);
    this.selectTab = this.selectTab.bind(this);
    this.selectInstruction = this.selectInstruction.bind(this);
    this.state = {
      selectedTab: props.location.state ? props.location.state.selectedTab : 'instructions',
      selectedInstruction: props.location.state ? '' :  'general'
    };
  }

  selectTab(tabName) {
    if(tabName === 'instructions'){
      this.setState({
        selectedTab: tabName,
        selectedInstruction: 'general'
      });
    } else {
      this.setState({
        selectedTab: tabName,
        selectedInstruction: ''
      });
    }
  }

  selectInstruction(instrName) {
    this.setState({
      selectedTab: 'instructions',
      selectedInstruction: instrName
    });
  }

  componentDidMount() {
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      },
      {
        title: 'Tutorials',
        text: 'Click any item in this side bar to see instructions on how to perform any of the specified activities.',
        selector: '.how-to-nav',
        position: 'right',
      }]);
  }

  generalInstructions() {
    return(
      <div className="tab-pane active" id="general" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'general'} aria-labelledby="general-tab">
        <h1 id="general">General</h1>
        <p><strong>Full help resources:</strong></p>
        <ul>
        <li><a href='https://www.cdc.gov/sdp/SDPVocabularyServiceSharedServices.html' target='_blank'>Additional external help resources including a full user guide can be found by clicking here!</a></li>
        </ul>
        <p><strong>Navigation and Help Basics:</strong></p>
        <ul>
        <li>Use the top bar to log-in or navigate to various pages.</li>
        <li>Clicking the CDC logo in the top left will return you to the landing page at any time.</li>
        <li>The footer contains useful links to pages with additional information about the site, including the application version. Please reference this version number in any bug reports.</li>
        <li>On most pages the top right navigation bar gives a &quot;Help&quot; option. Click on this option to view documentation for various actions or see step-by-step walk throughs on some pages. The step by step walkthroughs are also available below in accessible plain text format.</li>
        </ul>


        <p><strong>Page Step By Step Instructions:</strong></p>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#section-edit">Section Edit Page</a></li>
          <li><a href="#section-details">Section Details Page</a></li>
          <li><a href="#question-edit">Question Edit Page</a></li>
          <li><a href="#question-details">Question Details Page</a></li>
          <li><a href="#response-set-edit">Response Set Edit Page</a></li>
          <li><a href="#response-set-details">Response Set Details Page</a></li>
          <li><a href="#survey-edit">Survey Edit Page</a></li>
          <li><a href="#survey-details">Survey Details Page</a></li>
          <li><a href="#help-page-link">Help Page</a></li>
          <li><a href="#code-system-mappings-tables-edit">Code System Mappings Tables on Edit Page</a></li>
        </ul>

        <h2 id="step-by-step">Step-by-Step Walkthroughs by Page</h2>
        <h3 id="dashboard">Dashboard</h3>
        <ul>
        <li>Type in your search term and search across all items by default. Results include items you own and public items.</li>
        <li>Click on any of the type boxes to highlight them and toggle on filtering by that single item type.</li>
        <li>Click Advanced Link to see additional filters you can apply to your search.</li>
        <li>If you already have an account you can log in to unlock more features in the top right of the dashboard page.</li>
        <li>Click on any of the rows in the My Stuff Analytics panel to filter by items you authored.</li>
        <li>If you belong to a group you may use the dropdown in the right panel to select a group, this will filter all search results limiting to content owned by that group.</li>
        <li>Click the create menu and then select an item type to author a new item.</li>
        <li>Click the alerts dropdown to see any new notifications about your content.</li>
        <li>Click your e-mail to see various account management options.</li>
        </ul>
        <h3 id="section-edit">Section Edit Page</h3>
        <ul>
        <li>If you need to create a new question without leaving the the section use this button to author a new question from scratch.</li>
        <li>Type in your search keywords in the top left search bar to search for questions to add to the section.</li>
        <li>Click Advanced to see additional filters you can apply to your search.</li>
        <li>Use these search results to find the question you want to add.</li>
        <li>Click on the add (+) button to select a question for the section.</li>
        <li>Edit the various section details on the right side of the page. Select save in the top right of the page when done editing to save a private draft of the content (this content will not be public until it is published).</li>
        </ul>
        <h3 id="section-details">Section Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the 'Create and Edit Content' section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on public content</li>
        </ul>
        <h3 id="question-edit">Question Edit Page</h3>
        <ul>
        <li>Use the input fields to edit content of the question. If the response type is open choice this panel will also give you the option to associate response sets with this quesiton at creation time</li>
        <li>Click the search icon to search for and add coded concepts to the question</li>
        <li>Alternatively, you can manually add a code system mapping - click the plus sign to add additional code system mapping to associate with the question</li>
        <li>The Concept Name field is what the user will see on the page</li>
        <li>Optionally, you can enter a code and a code system for the mapping you are adding if it belongs to an external system (such as LOINC or SNOMED)</li>
        <li>Click save to save a private draft of the edited content</li>
        </ul>
        <h3 id="question-details">Question Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on public content</li>
        </ul>
        <h3 id="response-set-edit">Response Set Edit Page</h3>
        <ul>
        <li>Use the input fields to edit content of the response set</li>
        <li>Click the search icon to search for and add coded responses to the response set</li>
        <li>Alternatively, you can manually add a response - click the plus sign to add additional responses to associate with the response set</li>
        <li>The Display Name field is what the user will see on the page</li>
        <li>Optionally, you can enter a code and a code system for the response you are adding if it belongs to an external system (such as LOINC or SNOMED)</li>
        <li>Click save to save a private draft of the edited content (this content will not be public until it is published)</li>
        </ul>
        <h3 id="response-set-details">Response Set Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on public content</li>
        </ul>
        <h3 id="survey-edit">Survey Edit Page</h3>
        <ul>
        <li>Type in your search keywords here to search for sections to add to the survey</li>
        <li>Click Advanced to see additional filters you can apply to your search</li>
        <li>Use these search results to find the section you want to add</li>
        <li>Click on the add button to select a section for the survey</li>
        <li>Edit the various survey details on the right side of the page. Select save in the top right of the page when done editing to save a private draft of the content (this content will not be public until it is published)</li>
        </ul>
        <h3 id="survey-details">Survey Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on public content</li>
        </ul>
        <h3 id="help-page-link">Help Page</h3>
        <ul>
        <li>Click any item in the left side bar to see instructions on how to perform any of the specified activities</li>
        </ul>
        <h3 id="code-system-mappings-tables-edit">Code System Mappings Tables on Edit Pages</h3>
        <ul>
        <li>Click the info (i) icon, or go to the Code System Mappings tab in the help documentation to see more information and examples on how to get the most out of code mappings.</li>
        </ul>
      </div>
    );
  }

  accountInstructions() {
    return(
      <div className="tab-pane" id="manage-account" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'manage-account'} aria-labelledby="manage-account-tab">
        <h1 id="account-management">Account Management</h1>
        <p><strong>Options:</strong></p>
        <ul>
        <li><a href="#logging-in">Logging In</a></li>
        <li><a href="#logging-out">Logging Out</a></li>
        <li><a href="#trouble">Trouble Logging In</a></li>
        </ul>
        <h2 className="help-section-subtitle" id="logging-in">Logging In</h2>
        <p>If you already have an account simply click the log-in link in the blue navigation bar in the top right of the screen. You should then be redirected to Secure Access Management Services (SAMS) to login* with your credentials. If you do not see a log-in button the browser may be logged in from a previous session. In that case see how to log out below.</p>
        <p id="trouble"><strong>*Trouble logging in:</strong> If you receive an error message after entering your credentials into SAMS, please email surveillanceplatform@cdc.gov to request Surveillance Data Platform Vocabulary Service SAMS Activity Group membership.</p>
        <h2 className="help-section-subtitle" id="logging-out">Logging Out</h2>
        <p>On any page you should be able to log-out by first clicking the e-mail in the top-right corner of the navigation bar, then selecting log-out from the drop-down menu that will appear. The page should refresh automatically.</p>
      </div>
    );
  }

  searchInstructions() {
    return(
      <div className="tab-pane" id="search" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'search'} aria-labelledby="search-tab">
        <h1 id="search-functionality">Search Functionality</h1>
        <p><strong>Features:</strong></p>
        <ul>
        <li><a href="#advanced-search">Advanced search</a></li>
        <li><a href="#basic-search">Basic search</a></li>
        <li><a href="#filtering-by-type">Filtering by type</a></li>
        <li><a href="#see-content-you-own">See content you own</a></li>
        <li><a href="#advanced-filtering">Advanced filtering</a></li>
        </ul>
        <h2 className="help-section-subtitle" id="advanced-search">Advanced Search</h2>
        <p>The application uses a search engine called Elasticsearch. Features of this search engine include filters in the "Advanced" search pop-up, fuzzy matching on queries that are close matches to the search terms, better weighted results, and the curation wizard.</p>
        <p>If a warning symbol appears next to the "Advanced" search link or you see an error message in the advanced search pop-up, the advanced search engine (Elasticsearch) is down. The advanced features, including filters and fuzzy matching, will not work while the engine is down. Please check back later or contact your system administrator at <a href="mailto:surveillanceplatform@cdc.gov">surveillanceplatform@cdc.gov</a> if the issue is persistent.</p>
        <h2 className="help-section-subtitle" id="basic-search">Basic Search</h2>
        <p>On the dashboard there is a search bar that can be used to find questions, response sets, sections, and surveys. Typing in search terms that might be found in the name, description, author e-mail, and various other relevant fields on the items.</p>
        <h2 className="help-section-subtitle" id="filtering-by-type">Filtering by Type</h2>
        <p>You can filter a search by the type of content by clicking on the analytics icons immediately below the search bar on the dashboard page. Clicking on any of those four squares on the top of the page will filter by the type specified in the square and highlight the square. Once a filter is applied you can click on the &#39;clear filter&#39; link that will appear under the icons on the dashboard.</p>
        <h2 className="help-section-subtitle" id="see-content-you-own">See Content You Own</h2>
        <p>Similar to searching by type (described above) when you are logged in to an account the dashboard will have a &quot;My Stuff&quot; section displayed on the right side of the dashboard. Clicking on any of the icons or the filter link in that panel will highlight the filter applied in blue and filter any searches down to only return private drafts and public published content that you own.</p>
        <h2 className="help-section-subtitle" id="see-content-your-groups-own">See Content Your Groups Own</h2>
        <p>Similar to searching by content you own, when you are logged in to an account that is part of an authoring group, the dashboard will have a &quot;Filter by Group&quot; section displayed on the right side of the dashboard. Selecting any of the group names from the dropdown in that panel will filter any searches down to only return content that is assigned to the specified group.</p>
        <h2 className="help-section-subtitle" id="advanced-filtering">Advanced Filtering</h2>
        <p>Under the search bars seen across the app there is an &#39;Advanced&#39; link. If you click that link it will pop up a window with additional filters that you can apply. Any filters you select will limit your searches by the selected filters. The window also has a clear filters buttons that will reset back to the default search.</p>
      </div>
    );
  }

  viewInstructions() {
    return(
      <div className="tab-pane" id="view" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'view'} aria-labelledby="view-tab">
        <h1 id="content-viewing-and-exporting">Content Viewing and Exporting</h1>
        <p><strong>Options:</strong></p>
        <ul>
        <li><a href="#viewing">View Content</a></li>
        <li><a href="#exporting">Export Content</a></li>
        </ul>

        <h2 className="help-section-subtitle" id="viewing">View Content</h2>

        <ul>
        <li>On the dashboard and various other places you will see a little summary box, or widget, displaying important information about the search result.</li>
        <li>Clicking the bottom link on each widget expands a box with additional information about the item.</li>
        <li>In most places the full details page can be seen by clicking the name / title link of the item.</li>
        <li>On the edit pages the name link is disabled but you can click the eyeball icon on any of the widgets to navigate to the details page.</li>
        </ul>

        <h2 className="help-section-subtitle" id="exporting">Exporting</h2>
        <p><strong>Epi Info </strong>(Surveys and Sections)</p>
        <p>On the view pages for surveys and sections there is an action button that exports the current content to Epi Info (XML). To export a survey or section and use it in Epi Info execute the following steps:</p>
        <ul>
        <li>Click on the 'Export' button on the Vocabulary service section details page (this will save a .xml file to the folder your browser directs downloads)</li>
        <li>Open Epi Info</li>
        <li>Choose the option to 'Create Forms'</li>
        <li>From the File menu, select 'Get Template'</li>
        <li>Select the .xml file you downloaded from the vocabulary service, it will be in the folder your browser downloads content into (usually the 'Downloads' folder). Click 'Open'.</li>
        <li>From the File menu, select 'New Project from Template'</li>
        <li>After selecting the template that was created from the vocabulary service .xml file, complete the rest of the fields. Click 'Ok'</li>
        </ul>

        <p><strong>REDCap </strong>(Surveys and Sections)</p>
        <p>On the view pages for surveys and sections there is an action button that exports the current section to REDCap. To export a survey or section and use it in REDCap execute the following steps (exact wording may differ slightly based on your version of REDCap):</p>
        <ul>
        <li>Click on the 'Export' button on the Vocabulary service survey or section details page and select 'REDCap (XML)' (this will save a .xml file to the folder your browser directs downloads)</li>
        <li>Open up REDCap</li>
        <li>Choose the option to create a new project</li>
        <li>On the project creation page follow the on screen instructions to add a name and various attributes to the new projects</li>
        <li>Look for an option titled something similar to "Start project from scratch or begin with a template?" and choose the "Upload a REDCap project XML file" option</li>
        <li>Click the "Choose File" button to select the .xml file you downloaded from the vocabulary service, it will be in the folder your browser downloads content into (usually the 'Downloads' folder)</li>
        <li>After selecting the .xml file to import and filling out the rest of the fields, click on the Create Project or Start Project button at the bottom of the page</li>
        </ul>

        <p><strong>Spreadsheet </strong> (Surveys only)</p>
        <p>On the view page for surveys there is an action button that exports the current survey to spreadsheet format (xlsx). To export a survey into this format, execute the following steps:</p>
        <ul><li>Click on the 'Export' button on the Vocabulary service survey or section details page and select 'Spreadsheet (XLSX)' (this will save a .xlsx file to the folder where your browser directs <b>downloads</b>.)</li></ul>

        <p><strong>PDF </strong> (Surveys and Sections)</p>
        <p>On the view page for surveys and sections there is an action button that exports the current content to a PDF file. To export a section or survey into this format, execute the following steps:</p>
        <ul><li>Click on the 'Export' button on the Vocabulary service survey or section details page and select 'Print' (this will save a .pdf file to the folder your browser directs downloads)</li></ul>

        </div>
    );
  }

  workflowInstructions() {
    return(
      <div className="tab-pane" id="workflow" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'workflow'} aria-labelledby="workflow-tab">
        <h1 id="content-workflow">Workflow Status and Content Stage</h1>
        <p>SDP-V has workflow statuses and content stages to support different business processes of users.</p>
        <p><strong>Topics:</strong></p>
        <ul>
        <li><a href="#workflow">Workflow Status</a></li>
        <li><a href="#stage">Content Stage</a></li>
        </ul>

        <h2 className="help-section-subtitle" id="workflow">Workflow Status</h2>
        <p>SDP-V content can be in either a Private or Public workflow status.  Workflow status drives visibility rules in SDP-V. Workflow status is displayed as “Visibility” in the UI to clearly communicate to users who can see which content.</p>
        <ul>
        <li>
        <strong>PRIVATE</strong> – When content is created or imported in SDP-V, it is in Private workflow status. Content in this workflow status has restricted visibility based on ownership and role and can be modified until the author or authoring group is ready to publish it (see Public workflow status below).
        <ul>
        <li><strong>Visibility: </strong>Content in private workflow status is only visible to the user who authored it, users that belong to a group that the content is added to, and to all Publishers in the system.</li>
        <li><strong>Ability to Modify Content: </strong>Only the Author or group members may make changes to the private draft content. The private content can be edited as desired until it is ready to be sent to a Publisher for review. SDP-V tracks changes to private draft content on the Change History tab.</li>
        <li><strong>Content Stages: </strong>Users can use the “draft”, “comment only”, or “trial use” content stages. The “draft” content stage is the default stage; “trial use” and “comment only” are optional content stages for this workflow status. To support multiple business cases, the user may place content in private workflow status into these 3 content stages bi-directionally in any order (e.g., draft, comment only, trial use, comment only) or may only use the "draft" content stage.</li>
        </ul>
        </li>
        <li>
        <strong>PUBLIC</strong> – Whenever an author or authoring group is ready to share their content publicly, an author must send a request to their program Publisher to change the workflow status in SDP-V. Content must be reviewed and approved by a Publisher in SDP-V to change the workflow status to Public; this action is known as “publishing” is SDP-V.
        <ul>
        <li><strong>Visibility: </strong>Public content is visible to everyone who visits the SDP-V website including users without authenticated accounts (publicly available). This allows for authors to share their SDP-V content with a wide public health audience. Once a version is public, it cannot be set back to private. An author can use the content stage attribute to indicate which public version is ready for use versus other stages of maturity (see definitions below).</li>
        <li><strong>Ability to Modify Content: </strong>Only the Author or group members of public content may choose to revise it. Revising public content results in a new version of the content in private status that can be modified as described above until it is ready to be published publicly. SDP-V maintains a version history for public content so that users can see how content has evolved over time.</li>
        <li><strong>Content Stages: </strong>Users can use the “published”, “comment only”, or “trial use” content stages. The “published” content stage is the default stage; “trial use” and “comment only” are optional content stages for this workflow status. To support multiple business cases, the user may place content in the public workflow status into these 3 content stages in any order (e.g., comment only, trial use, comment only, published) or may only use the "published" content stage.</li>
        </ul>
        </li>
        </ul>
        <p><strong>Note:</strong>Content in the public workflow status indicates that a program was ready to share content publicly to promote transparency, harmonization, standardization, and the goals of SDP-V and may not be authoritative. Users interested in using public content are encouraged to reach out to the appropriate program or system with any questions about content and consider the indicated content stage.</p>

        <h2 className="help-section-subtitle" id="stage">Content Stage</h2>
        <p>An attribute of the content being presented that represents content maturity. Response sets, questions, sections, and surveys added to SDP-V do not need to advance through each content stage described below before sharing their content publicly (publishing content as described above). The content stage attribute offers users flexibility to accurately communicate the maturity of their content at different stages of the vocabulary life cycle with other users.</p>
        <ul>
        <li>
        <strong>DRAFT</strong> – Content that is being worked on by its Authors and Publisher. It is generally not considered to be “complete” and unlikely ready for comment. Content at this Level should not be used. This is the initial status assigned to newly created content.
        <ul><li>This content stage can be used for content is that is in private workflow status.</li></ul>
        </li>
        <li>
        <strong>COMMENT ONLY</strong> – Content that is being worked on by its Authors and Publisher. It is generally not considered to be “complete” but is ready for viewing and comment. Content at this Level should not be used.
        <ul><li>This content stage can be used for content is that is in either private and public workflow status.</li></ul>
        </li>
        <li>
        <strong>TRIAL USE</strong> – Content that the Authors and Publisher believe is ready for User viewing, testing and/or comment. It is generally “complete”, but not final. Content at this Level should not be used to support public health response.
        <ul><li>This content stage can be used for content that is in either private and public workflow status.</li></ul>
        </li>
        <li>
        <strong>PUBLISHED</strong> – The most recent version of content. It is ready for viewing, downloading, comments, use for public health response.
        <ul><li>This content stage can be used for content that is in public workflow status.</li></ul>
        </li>
        <li>
        <strong>RETIRED</strong> – Content that is no longer the most recent version (not latest). However, this content could be used with no known risk.
        <ul><li>This content stage can be used for content that is in public workflow status. Only publishers can move content to this content stage. Authors who would like to retire content should contact their program publisher. Content that is "retired" is hidden from dashboard search results by default unless an advanced filter is toggled to show retired content.</li></ul>
        </li>
        <li>
        <strong>DUPLICATE</strong> – Content that the Author and Publisher believe is a duplicate of other content in the SDP-V repository. Content marked as “Duplicate” should not be used when creating new SDP-V surveys. If content marked as “Duplicate” is used on an existing SDP-V survey, it should be replaced during the next revision.
        <ul><li>This content stage is assigned whenever users identify duplicate content using the curation wizard. This content stage cannot be assigned by users outside of the curation wizard.</li></ul>
        </li>
        </ul>
      </div>
    );
  }

  editInstructions() {
    return(
      <div className="tab-pane" id="create-and-edit" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'create-and-edit'} aria-labelledby="create-and-edit-tab">
        <h1 id="content-creation-and-editing">Content Creation and Editing</h1>
        <p><strong>Options:</strong></p>
        <ul>
          <li><a href="#create-new-content">Create New Content</a></li>
          <li><a href="#edit-content">Edit Content</a></li>
          <li><a href="#revise-content">Revise Content</a></li>
          <li><a href="#extend-content">Extend Content</a></li>
        </ul>
        <h2 className="help-section-subtitle" id="create-new-content">Create New Content</h2>
        <ul>
          <li>To start a new private draft of any item click on the &quot;Create&quot; drop down in the top navigation bar on the dashboard.</li>
          <li>On the creation / editing page change any fields that need to be updated and press save - this saves a private draft of the first version of the new item that will need to get published by a publisher before it will be publicly visible to others.</li>
          <li>If you try to navigate away before saving the changes a prompt will ask if you want to navigate away without saving or save before you leave.</li>
        </ul>
        <h2 className="help-section-subtitle" id="edit-content">Edit Content</h2>
        <p><strong>Note:</strong> You can only edit your own private content, or content that belongs to a group where you are a member - once your content is made public you will be given the option to create a new revision or extension (a copy with a separate version history) of the content.</p>
        <ul>
          <li>When looking at the search result for the item you want to edit click on the menu button in the bottom right and select edit.</li>
          <li>When on the details page of an item the edit or revise button should appear in the top right above the item information.</li>
          <li>On the edit page change any fields that need to be updated and press save.</li>
        </ul>
        <h2 className="help-section-subtitle" id="revise-content">Revise Content</h2>
        <p><strong>Note:</strong> You can only revise your own public content, or public content that belongs to a group where you are a member. Saving a revision will save a private draft of that revision until you publish the new version.</p>
        <ul>
          <li>When looking at the search result for the item you want to revise click on the menu button in the bottom right and select revise</li>
          <li>When on the details page of an item the edit or revise button should appear in the top right above the item information</li>
          <li>On the revision editing page change any fields that need to be updated and press save - this saves a private draft of the new version that will need to get published by a publisher before it will be publicly visible to others.</li>
        </ul>
        <h2 className="help-section-subtitle" id="extend-content">Extend Content</h2>
        <p><strong>Note:</strong> You can only extend public content. Unlike revising, you do not need to own or be part of a group that owns content in order to create an extension (use it as a template with its own version history). Saving an extension will save a private draft that is the first version (new revision history) with a link to the content it was extended from (shown as the parent of the item).</p>
        <ul>
          <li>When looking at the search result for the item you want to extend click on the menu button in the bottom right and select extend</li>
          <li>When on the details page of a public item the extend button should appear in the top right above the item information</li>
          <li>On the extension editing page change any fields that need to be updated and press save - this saves a private draft of the first version of the extended item that will need to get published by a publisher before it will be publicly visible to others.</li>
        </ul>

      </div>
    );
  }

  curationInstructions() {
    return (
      <div className="tab-pane" id="curation" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'curation'} aria-labelledby="curation-tab">
        <h1 id="curation-wizard">Curation Wizard</h1>
        <p>Description: The curation wizard shows the user questions and response sets in the SDP-V repository that are similar to content on user’s survey. This feature automates the identification of similar questions and response sets created by other programs to maximize harmonization opportunities within SDP-V before private content is published or during the revision of a public SDP-V survey. The user may select an existing question or response set from the SDP-V repository to replace private draft content on their survey or link public content on their survey to another question or response in the service to indicate to other users what content in the repository is the preferred replacement.</p>
        <p>Value: These replacements and linkages will help curate and reduce redundancy while promoting reuse. Use of this feature will also enable proper population of system usage statistics in SDP-V to show use of content across CDC programs and systems (e.g., different users must link to the same question in the repository for usage across sections, surveys, programs, and surveillance systems to be transparent in the service). This feature will also help to prevent duplicate questions and response sets from cluttering the repository so that content is easier to search, browse, and use.</p>
        <p><strong>How to Find Similar Questions and Response Sets in SDP-V (Surveys)</strong></p>
        <p>The Curation Wizard feature will be available on the Survey Details page if the algorithm detects similar questions and/or response sets from your survey in the SDP-V repository.</p>
        <p>To start the curation wizard, execute the following steps:</p>
        <ul>
          <li>
            Click on the 'Curate' button on the Survey details page (the number in parentheses indicates the total questions and/or response sets on the survey with similar content in SDP-V detected)
            <ul>
              <li>
                If no similar questions and/or response sets are detected on the survey, then the “Curate” button will not appear to the user.
              </li>
            </ul>
          </li>
          <li>
            The Curate Survey Content Page contains two tabs.
            <ul>
              <li>
                The ‘Questions’ tab is the default view and lists all questions on the survey with potential duplicates in the repository (the number in parentheses indicates the total questions on the survey with similar content detected in SDP-V).
              </li>
              <li>
                The ‘Response Sets’ tab lists all response sets on the survey with potential duplicates in the repository (the number in parentheses indicates the total response sets on the survey with similar content detected in SDP-V).
              </li>
            </ul>
          </li>
          <li>
            Select ‘View’ to see similar questions or response sets in the SDP-V repository with significant overlap in various fields (at least 75%).
            <ul>
              <li>Click on the Section Name hyperlink to view the section details where the potential duplicate questions were identified on the user’s survey</li>
            </ul>
          </li>
          <li>
            Scroll through ‘Potential Duplicate Questions’ or ‘Potential Duplicate Response Sets’ by using the left and right arrows on the right-side of the screen
            <ul>
              <li>Click on the Section Name hyperlink to view the section details where the potential duplicate questions were identified on the user’s survey</li>
            </ul>
          </li>
          <li>
            Click on the Question Name hyperlink to view the question details of the suggested replacement questions that were identified by the matching algorithm
            <ul>
              <li>If the potential duplicate Question or Response Set visibility is “private”: Select ‘Replace’ to mark the private draft question or response set on the user’s survey as a duplicate and replace it with the selected question or response set. A prompt will appear for confirmation of the replacement along with details of the change that states the current question or response set will be replaced everywhere it is used in the vocabulary service and be deleted. This action cannot be undone.</li>
              <li>If the duplicate Question or Response Set visibility is “public”: A “Link” button appears instead of “Replace”. Selecting “Link” will mark the question or response set as “Duplicate” and move the question or response set to the “Duplicate” content stage. The potential duplicate question or response set details page will provide a link to the question or response set that the author selected (by clicking “Link to”). This action allows authors to indicate which item is a preferred replacement to promote harmonization and reduce redundancy.</li>
            </ul>
          </li>
        </ul>
        <h2>Curation Wizard ‘Replace’ Function</h2>
        <p>Whenever a user chooses to replace a private question or response set on their survey with an existing question or response set in SDP-V, only some fields are updated. This is to prevent the user from losing information that has already been entered.</p>
        <p><strong>Questions</strong></p>
        <p>Whenever a user replaces a duplicate question on their private survey with a suggested replacement question, the replacement question is linked to the private survey. The following list shows which fields will change:</p>
        <ul>
          <li>Question Name</li>
          <li>Question Description</li>
          <li>Response Type</li>
          <li>Question Category</li>
          <li>Question Subcategory</li>
          <li>Code Mappings</li>
        </ul>
        <p>The following fields and relationships will not change:</p>
        <ul>
          <li>Response Set (if choice question)</li>
          <li>Program Defined Variable Name</li>
        </ul>
        <p><strong>Note: </strong>Since there are many valid question and response set pairs, questions and response sets are assessed independently using the curation wizard. For instance, a program can harmonize a question (like ‘How old are you?’) with another program while choosing to use a different valid response set than that same program (like 5-year age categories compared to 10-year age categories).</p>
        <p><strong>Response Sets</strong></p>
        <p>Whenever a user replaces a duplicate response set on their private survey with a suggested replacement response set, the replacement response set is linked to the private survey. The following list shows which fields will change:</p>
        <ul>
          <li>Response Set Name</li>
          <li>Response Set Description</li>
          <li>Responses</li>
        </ul>
        <p><strong>Curation Wizard Match Score Algorithm</strong></p>
        <p>The match score algorithm identifies questions and response sets in the SDP-V repository that are like content on a user’s survey based on a match of at least 75% overlap in the fields.</p>
        <p>The match score algorithm compares the following fields to find similar questions:</p>
        <ul>
          <li>Question Name</li>
          <li>Question Description</li>
          <li>Question Category and Subcategory</li>
          <li>Code Mappings and Code System</li>
        </ul>
        <p>The match score algorithm compares the following fields to find similar response sets:</p>
        <ul>
          <li>Response Set Name</li>
          <li>Response Description</li>
          <li>Responses and Response Code Systems</li>
        </ul>
      </div>
    );
  }

  importInstructions() {
    return(
      <div className="tab-pane" id="import" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'import'} aria-labelledby="import-tab">
        <h1 id="import-content">Importing Content</h1>
        <br/>
        <ul>
        <li><a href="#message-mapping-guide">Importing Message Mapping Guide (MMG) Data Elements and Value Sets</a>
        <ol>
        <li><a href="#message-mapping-guide-import-MMG">How to Import MMG Content Through SDP-V User Interface</a></li>
        <li><a href="#message-mapping-import-requirements">MMG Spreadsheet Import Template Content and Formatting Requirements</a></li>
        <li><a href="#MMG-content-organization">Content Organization: How to Identify Sections, Templates, or Repeating Groups within the MMG Spreadsheet Import Template</a></li>
        </ol>

        </li>
        <li><a href="#generic-spreadsheet-guide">Importing Questions and Response Sets Using SDP-V Generic Import Template</a>
        <ol>
          <li><a href="#generic-spreadsheet-import">How to Import Content using the Generic Import Template through the SDP-V User Interface</a></li>
          <li><a href="#generic-content-organization">Content Organization: How to Identify Sections, Templates, or Repeating Groups within the Generic Spreadsheet Import Template</a></li>
          <li><a href="#generic-associate-rs">How to Associate Response Sets with Choice Questions on Import</a></li>
          <li><a href="#generic-local-rs">How to Create User-defined (“Local”) Response Sets Using the SDP-V Import Template</a></li>
          <li><a href="#generic-add-code-system-mappings">How to Add Multiple Code System Mappings to Content Using the SDP-V Import Template</a></li>
        </ol>
        </li>
        </ul>

          <h3><p id="message-mapping-guide">Importing Message Mapping Guide (MMG) Data Elements and Value Sets</p></h3>
          <p>This feature is to support the bulk import of vocabulary content from Nationally Notifiable Disease Message Mapping Guides (MMGs).</p>

          <h4><strong><p id="message-mapping-guide-import-MMG">How to Import MMG Content Through SDP-V User Interface</p></strong></h4>
          <p>On the taskbar, there is an action button to create content. To create a SDP-V survey using content from a Message Mapping Guide (MMG) formatted spreadsheet, execute the following steps:</p>
          <ul>
            <li>Click on the 'Create' button on the Vocabulary service taskbar and select 'Import Spreadsheet'</li>
            <li>Select the MMG formatted file you wish to import by clicking 'Choose File' </li>
            <li>Select ‘MMG Import’ as the format of the file you wish to import </li>
          </ul>
          <br/>

          <h4><p id="message-mapping-import-requirements"><strong>MMG Spreadsheet Import Template Content and Formatting Requirements</strong></p></h4>

          <p>The following table shows the expected MMG Column Names and how they map to Vocabulary Service.
          <strong>Each column is necessary for import, even if left blank. Each column should be spelled exactly as appears in quotes in the table below.</strong>
          </p>
          <br/>

          <table className="set-table table">
            <caption><strong>Table 1. MMG Import: Required Spreadsheet Column Names and Associated Vocabulary Service Item on Import</strong></caption>
            <thead>
              <tr>
                <th  id="mmg-display-name-column">MMG Import Column Name</th>
                <th  id="vocab-service-item-column">Vocabulary Service Item</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="mmg-display-name-column">'Data Element (DE) Name'</td>
                <td headers="vocab-service-item-column">Question Name and ‘Concept Name Column’ in Code System Mappings Table on Question Details</td>
              </tr>
              <tr>
                <td headers="mmg-display-name-column">'DE Identifier Sent in HL7 Message'</td>
                <td headers="vocab-service-item-column">Concept Identifier’ Column in Code System Mappings Tableon Question Details Page*</td>
              </tr>
              <tr>
                <td headers="mmg-display-name-column">'Data Element Description'</td>
                <td headers="vocab-service-item-column">Question Description</td>
              </tr>
              <tr>
                <td headers="mmg-display-name-column">'DE Code System'</td>
                <td headers="vocab-service-item-column">‘Code System Identifier’ Column in Code System Mappings Table on Question Details Page *</td>
              </tr>
              <tr>
                <td headers="mmg-display-name-column">'Value Set Name (VADS Hyperlink)'</td>
                <td headers="vocab-service-item-column"><p>Response Set </p>Note: A data element will be associated with a PHIN VADS value set in SDP-V if a valid PHIN VADS hyperlink is provided in the same row of the SDP-V MMG import spreadsheet. The hyperlink provided in the cell must be in the following format to be recognized by the SDP-V MMG Importer: https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=2.16.840.1.114222.4.11.819. The PHIN VADS URL must end in “oid=identifier” in order to be accurately parsed by the importer.  Embedded hyperlinks such as ‘Yes No Indicator (HL7)’ will not be recognized by the importer; this will result in the question not being linked to the appropriate PHIN VADS value set in SDP-V. <br/>
                 If a valid PHIN VADS hyperlink is not provided, the SDP-V MMG importer will look for a tab with the same name as the value in this cell. The value set tab is expected to contain the value set values organized into the following column headers: ‘Concept Code’, ‘Concept Name’, ‘Code System OID’, ‘Code System Name’, and ‘Code System Version’. If a tab with the same name is not found, an error message will be displayed.
                </td>
              </tr>
              <tr>
                <td headers="mmg-display-name-column">'PHIN Variable Code System' OR 'Local Variable Code System'</td>
                <td headers="vocab-service-item-column">Program Defined Variable Name associated with a question</td>
              </tr>
              <tr>
                <td headers="mmg-display-name-column">'Data Type'</td>
                <td headers="vocab-service-item-column">Question Response Type</td>
              </tr>
              </tbody>
          </table><br/>

          <ul>
            <li>The content in each tab in the spreadsheet that contains all required columns will be imported and tagged with the 'Tab Name'.</li>
            <li>If there are multiple spreadsheets that contain all required columns, they will be imported as separate sections on the same SDP-V survey.</li>
            <li>The user importing content into SDP-V using this template will be assigned as the author of the survey. This SDP-V survey can then be added to a collaborative authoring group in the service to provide access to additional authors. </li>
            <li>Content will be imported into SDP-V in ‘Private’ workflow status and “Draft” content stage.</li>
          </ul>

          <br/>
          <p><strong>NOTE:</strong> If a required column from the table is missing, the user will receive an error message and the content will not be imported.</p>
          <br/>
          <h4 id="MMG-content-organization"><p><strong>Content Organization: How to Identify Sections, Templates, or Repeating Groups within the MMG Spreadsheet Import Template</strong></p></h4>
          <p>
            Sections, templates, or repeating groups are created by listing data elements between 'START: insert section name' and 'END: insert section name' rows; the ‘START’ and ‘END’ markers must be in the ‘PHIN Variable’ column. Each row between these markers are imported as data elements within that grouping (called sections in the vocabulary service). Sub-sections or sub-groupings may be created by including additional 'START: ' and 'END: ' markers within a parent section or grouping.
          </p>
          <ul>
            <li>The beginning of a section is indicated by the prefix 'START: ' (including a space after the colon) in the 'PHIN Variable' column</li>
            <li>The end of a section is indicated by the prefix 'END: '(including a space after the colon) in the 'PHIN Variable' column</li>
            <li>
              The text following the 'START: ' and 'END: ' pre-fixes will be imported as the Section Name in the vocabulary service
              <ul>
                <li>Example: Data element information in rows between START: Laboratory and END: Laboratory markers will be imported into SDP-V as a group of questions and associated response sets into a Section called “Laboratory”.</li>
              </ul>
            </li>
            <li>The section name following the 'START: ' prefix must exactly match the section name following the 'END: ' prefix in order for the section to be correctly imported. </li>
            <li>Notes should not be included in the same row as the section name (e.g., after the ‘START:’ or ‘END:’ pre-fixes’)</li>
            <li>Text following a ‘NOTE:’ pre-fix will not be imported. </li>
          </ul>
          <br/>
          <br/>

          <h3><p id="generic-spreadsheet-guide">Importing Questions and Response Sets Using SDP-V Generic Import Template</p></h3>
          <br/>
          <p>The purpose of this feature is to support the creation of SDP-V surveys by importing large amounts of questions and response sets from existing data dictionaries, surveys, and other formats into the SDP Vocabulary Service (SDP-V) using a spreadsheet template.</p>
          <br/>

          <h4><p id="generic-spreadsheet-import"><strong>i.	How to Import Content Using the Generic Import Template through the SDP-V User Interface</strong></p></h4>
          <p>On the taskbar, there is an action button to create content. To create a SDP-V survey using content from the generic SDP-V template formatted spreadsheet, execute the following steps:</p>
          <ol>
            <li>Click on the 'Create' button on the Vocabulary service taskbar and select 'Import Spreadsheet'</li>
            <li>Select the SDP-V template formatted file you wish to import by clicking 'Choose File'</li>
            <li>Select 'Generic Import' as the format of the file you wish to import</li>
          </ol>

          <p>The following tables lists the Generic Import Column Names and the import priority.
          <strong>Each required column is necessary for import, even if left blank.
          Each column should be spelled exactly as appears in quotes in the table below.</strong>
          The generic import column names map directly to the Vocabulary Service items
          (e.g., 'Question Description' in Generic SDP-V template spreadsheet imported as 'Question Description' in SDP-V).
          </p>
          <table className="set-table table">
            <caption><strong>Table 2A. SDP-V Generic Import: Spreadsheet Column Names, Priority and Description - Survey Metadata Tab </strong></caption>
            <thead>
              <tr>
                <th  id="generic-display-name-column">'Survey Metadata' Tab Column Headers</th>
                <th  id="generic-display-priority">Priority</th>
                <th  id="generic-display-desc">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="generic-display-name-column">'Survey Name (R)'</td>
                <td headers="generic-display-priority">Required</td>
                <td headers="generic-display-desc">The information contained in this column on the 'Survey Metadata' tab is imported as the Survey name</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column">'Survey Description (O)'</td>
                <td headers="generic-display-priority">Optional</td>
                <td headers="generic-display-desc">The information contained in this column on the ‘Survey Metadata’ tab is imported as the Survey description. This information can alternatively be added through the SDP-V user interface after import.</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column">‘Survey Keyword Tags (O)’</td>
                <td headers="generic-display-priority">Optional</td>
                <td headers="generic-display-desc">Tags are text strings that are either keywords or short phrases created by users to facilitate content discovery, organization, and reuse. For instance, a survey called “Traumatic brain injury” may be tagged with “Concussion” to help other users find that survey who may not think of searching for the term “traumatic brain injury”. Multiple keyword tags can be separated with semicolon. </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column">‘Concept Name (C)’</td>
                <td headers="generic-display-priority">Conditional</td>
                <td headers="generic-display-desc">Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS. For each row that has data entered in this column, the following additional columns are required: Concept Identifier (C) and Code System Identifier (C). </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column">‘Concept Identifier (C)’</td>
                <td headers="generic-display-priority">Conditional</td>
                <td headers="generic-display-desc">This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.  For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Code System Identifier (C).</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column">‘Code System Identifier (C)’</td>
                <td headers="generic-display-priority">Conditional</td>
                <td headers="generic-display-desc">This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code system identifier field will be automatically populated. For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Concept Identifier (C).</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column">‘Code System Mappings Table (O)’</td>
                <td headers="generic-display-priority">Optional</td>
                <td headers="generic-display-desc">ONLY use when associating MORE THAN ONE code system mapping per item (e.g., survey, section, or question). A user can create multiple Code System Mappings for a single items (survey, section, question) by creating Code System Mappings tables on separate tabs within the SDP-V generic import spreadsheet. After import, the SDP-V item details page will be populated with values from a code system mappings table where the value in this cell matches the name of a tab in the import spreadsheet with the naming convention "CSM #", where # is a number assigned by the user to identify the mappings table in this template (e.g., CSM 1, CSM 2, CSM 3...). The CSM tab must contain the following headers (described above): Concept Name (R), Concept Identifier (R), and Code System Identifier (R). </td>
              </tr>
            </tbody>
          </table>

          <table className="set-table table">
            <caption><strong>Table 2B. SDP-V Generic Import: Spreadsheet Column Names, Priority and Description - Section Metadata Tab </strong></caption>
            <thead>
              <tr>
                <th  id="generic-display-name-column-b">'Section Metadata' Tab Column Headers</th>
                <th  id="generic-display-priority-b">Priority</th>
                <th  id="generic-display-desc-b">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="generic-display-name-column-b">'Section Name (R)'</td>
                <td headers="generic-display-priority-b">Required</td>
                <td headers="generic-display-desc-b">The information contained in this column on the 'Section Metadata' tab is imported as the Section name</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-b">'Section Description (O)'</td>
                <td headers="generic-display-priority-b">Optional</td>
                <td headers="generic-display-desc-b">The information contained in this column on the ‘Section Metadata’ tab is imported as the Section description. This information can alternatively be added through the SDP-V user interface after import.</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-b">‘Section Keyword Tags’ (O)</td>
                <td headers="generic-display-priority-b">Optional</td>
                <td headers="generic-display-desc-b">Tags are text strings that are either keywords or short phrases created by users to facilitate content discovery, organization, and reuse. For instance, a section called “Prescription Drug Misuse and Abuse” may be tagged with “Opioid” to help other users find that section who may not think of searching for the term “prescription drug”. Multiple keyword tags can be separated with semicolon. </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-b-b">'Concept Name (C)'</td>
                <td headers="generic-display-priority-b">Conditional</td>
                <td headers="generic-display-desc-b">Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS. For each row that has data entered in this column, the following additional columns are required: Concept Identifier (C) and Code System Identifier (C). </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-b">'Concept Identifier (C)'</td>
                <td headers="generic-display-priority-b">Conditional</td>
                <td headers="generic-display-desc-b">This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.  For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Code System Identifier (C).</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-b">'Code System Identifier (C)'</td>
                <td headers="generic-display-priority-b">Conditional</td>
                <td headers="generic-display-desc-b">This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code system identifier field will be automatically populated. For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Concept Identifier (C).</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-b">'Code System Mappings Table (O)'</td>
                <td headers="generic-display-priority-b">Optional</td>
                <td headers="generic-display-desc-b">ONLY use when associating MORE THAN ONE code system mapping per item (e.g., survey, section, or question). A user can create multiple Code System Mappings for a single items (survey, section, question) by creating Code System Mappings tables on separate tabs within the SDP-V generic import spreadsheet. After import, the SDP-V item details page will be populated with values from a code system mappings table where the value in this cell matches the name of a tab in the import spreadsheet with the naming convention "CSM #", where # is a number assigned by the user to identify the mappings table in this template (e.g., CSM 1, CSM 2, CSM 3...). The CSM tab must contain the following headers (described above): Concept Name (R), Concept Identifier (R), and Code System Identifier (R). </td>
              </tr>
            </tbody>
          </table>


          <table className="set-table table">
            <caption><strong>Table 2C. SDP-V Generic Import: Spreadsheet Column Names, Priority and Description - Survey Questions Tab </strong></caption>
            <thead>
              <tr>
                <th  id="generic-display-name-column-c">'Survey Questions' Tab Column Headers</th>
                <th  id="generic-display-priority-c">Priority</th>
                <th  id="generic-display-desc-c">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="generic-display-name-column-c">'Question Text (R)'</td>
                <td headers="generic-display-priority-c">Required</td>
                <td headers="generic-display-desc-c">Each row between Section ‘START:’ and ‘END’ markers will be imported as questions within that section. Questions must be associated with a section in SDP-V.</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Question Description (R)'</td>
                <td headers="generic-display-priority-c">Required</td>
                <td headers="generic-display-desc-c">The information contained in this column is imported as the question description.</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Question Response Type (R)'</td>
                <td headers="generic-display-priority-c">Required</td>
                <td headers="generic-display-desc-c">The information contained in this column is imported as the question response type.
                  <ul>
                    <li>The allowed response types are: Attachment, Boolean, Choice, Date, Date Time, Decimal, Instant, Integer, Open Choice, Quantity, Reference, String, Text, Time, or URL</li>
                    <li>The 14 allowed response types are defined at https://www.hl7.org/fhir/valueset-item-type.html </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">‘Other Allowed? (O)’</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c">This attribute can only be used for Choice type questions and allows users to indicated if “Other” is an allowed response option in addition to the values specified in a defined response set. For choice type questions, allowed values in the import template are "Yes" or "No". If this cell is left blank or “No” is specified, then the “Other allowed?” attribute will be null. If this cell in the import spreadsheet includes the value “Yes”, the “Other allowed?” attribute will be checked on import for the indicated question.</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Response Set Name (I)'</td>
                <td headers="generic-display-priority-c">Informational</td>
                <td headers="generic-display-desc-c">This column is to help the user of the template catalog the local response set tables that are being created in the Response Set tabs. The information in this column is for workflow purposes only and will not be imported. The Response Set Name will be assigned to local response sets based on values in the response set tables in each response set tab.</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Local Response Set Table (C)'</td>
                <td headers="generic-display-priority-c">Conditional</td>
                <td headers="generic-display-desc-c">The information contained in this column allows a user to specify a PHIN VADS value set to associate with a question or to create a new response set in SDP-V to be associated with the question on import (referred to as a local response set) if one does not already exist in the repository.<br/>
                <strong>Associate a question with an existing PHIN VADS value set:</strong>
                <ul>
                  <li>Enter the PHIN VADS URL in the cell.</li>
                  <li>If you provide a PHIN VADS URL, the value set information will be parsed from PHIN VADS and linked to the appropriate question in SDP-V upon import. The PHIN VADS URL must contain “oid= identifier” in order to be accurately parsed by the importer. </li>
                  <ul>
                    <li>An example of a valid PHIN VADS URL is: https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=2.16.840.1.114222.4.11.7552</li>
                  </ul>
                  <li>Alternatively, PHIN VADS value sets can be found by searching SDP-V and linking them with the question through the user interface after the SDP-V survey has been created on import.</li>
                  <li>If this column is left blank, the content owner will be able to add response set information to questions through the SDP-V user interface after import.</li>
                </ul>
                <br/>
                <strong>Create and associate a local response set on import:</strong>
                <ul>
                  <li>A local response set will be created on import and associated with the question in the same row where the value in this cell matches the name of a tab in the spreadsheet with the naming convention 'RS ID#', where ID# is a number assigned by the user to identify the response set in this template (e.g., RS 1, RS 2, RS 3...)
                    <ul><li>The RS ID# tab will contain the response set table that will be imported as the response set</li></ul>
                  </li>
                </ul>
                Note: A user may create as many local response sets as needed, but it is best practice to check SDP-V for existing response sets before doing so to prevent creating duplicate response sets in SDP-V.
                </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Question Category (O)'</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c">The information contained in this column is imported as the Question Category.
                <ul><li>The following are allowed values: Screening, Clinical, Demographics, Treatment, Laboratory, Epidemiological, Vaccine, or Public Health Emergency Preparedness & Response</li></ul>
                Note: This information is optional, but it is best practice to complete it since it will help other users find related content within SDP-V.</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Question Subcategory (O)'</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c">The information contained in this column is imported as the Question Subcategory.
                <ul>
                  <li>The Question Subcategory field is only valid if the Question Category is either "Epidemiological" or "Emergency Preparedness".
                    <ul>
                      <li>The following are allowed values for "Epidemiological" category: Travel, Contact or Exposure, Drug Abuse, or Sexual Behavior. </li>
                      <li>The following are allowed values for "Emergency Preparedness" category: Managing & Commanding, Operations, Planning/Intelligence, Logistics, and Financial/Administration.</li>
                    </ul>
                  </li>
                </ul>
                Note: This information is optional, but it is best practice to complete since it will help other users find related content within SDP-V.
                </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Question Data Collection Method (O)'</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c">The purpose of this attribute is to help other authors quickly find questions that were used to collect data from a source in a similar manner (e.g., phone interview vs paper-based survey vs electronic data exchange). The Data Collection Method attribute should represent the manner in which the question is used to collect data in a real-world setting. This is not necessarily the same as how CDC is receiving the data. For instance, a question on a survey may be worded to collect information from respondents over the phone, but respondent information may be sent to CDC in an electronic file; in this case, “Facilitated by Interviewer (Phone)” should be selected as the Data Collection Method rather than “electronic (machine to machine). The allowed values for this attribute are: Electronic (e.g., machine to machine), Record review, Self-administered (Web or Mobile), Self-Administered (Paper), Facilitated by Interviewer (Phone) and Facilitated by Interviewer (In-Person). In the import spreadsheet, one value can be specified. After import, the user can select multiple values in the UI. </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Question Content Stage (O)'</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c"> An attribute of the content being presented that represents content maturity. The content stage attribute offers users flexibility to accurately communicate the maturity of their content at different stages of the vocabulary life cycle with other users. If this field is left blank, the question will be imported in the “draft” content stage. Users may also select “comment only” or “trial use. Content stages are defined as follows:
                  <br/><strong>DRAFT</strong> – Content that is being worked on by its Authors and Publisher. It is generally not considered to be “complete” and unlikely ready for comment. Content at this Level should not be used.
                  <br/><strong>COMMENT ONLY</strong> – Content that is being worked on by its Authors and Publisher. It is generally not considered to be “complete” but is ready for viewing and comment. Content at this Level should not be used.
                  <br/><strong>TRIAL USE</strong> – Content that the Authors and Publisher believe is ready for User viewing, testing and/or comment. It is generally “complete”, but not final. Content at this Level should not be used to support public health response.
                </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Question Keyword Tags (O)'</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c">Tags are text strings that are either keywords or short phrases created by users to facilitate content discovery, organization, and reuse. For instance, a question about “Prescription Drug Misuse and Abuse” may be tagged with “Opioid” to help other users find that question who may not think of searching for the term “prescription drug”. Multiple keyword tags can be separated with semicolon. </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Program Defined Variable Name (O)'</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c">Program-defined Variable Name is associated with questions at the section level. The purpose of this is to allow each program to use its local program variable names to identify a question, such as those used in data analysis by a program, without changing the properties of the question itself. Since this attribute is not a property of the question, it allows for users across SDP-V to reuse the same questions while allowing programs to meet its use case requirements. </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Concept Name (C)'</td>
                <td headers="generic-display-priority-c">Conditional</td>
                <td headers="generic-display-desc-c">Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS. For each row that has data entered in this column, the following additional columns are required: Concept Identifier (C) and Code System Identifier (C). </td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Concept Identifier (C)'</td>
                <td headers="generic-display-priority-c">Conditional</td>
                <td headers="generic-display-desc-c">This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.  For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Code System Identifier (C).</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Code System Identifier (C)'</td>
                <td headers="generic-display-priority-c">Conditional</td>
                <td headers="generic-display-desc-c">This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code system identifier field will be automatically populated. For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Concept Identifier (C).</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'Code System Mappings Table (O)'</td>
                <td headers="generic-display-priority-c">Optional</td>
                <td headers="generic-display-desc-c">The purpose of Tags is to facilitate content discovery and reuse. A user can create tags by creating tags tables on separate tabs within the SDP-V generic import spreadsheet. A question will be tagged with values from a tag table where the value in this cell matches the name of a tab in the spreadsheet with the naming convention "CSM #", where # is a number assigned by the user to identify the tags table in this template (e.g., CSM 1, CSM 2, CSM 3...).</td>
              </tr>
              <tr>
                <td headers="generic-display-name-column-c">'RS Notes (I)'</td>
                <td headers="generic-display-priority-c">Informational</td>
                <td headers="generic-display-desc-c">This column is to help the user of the template keep track of actions that may need to be completed after imported, such as the need to extend an existing response set in SDP-V. The information in this column is for workflow purposes and will not be imported.</td>
              </tr>
              </tbody>
          </table><br/>
          <p>The content in each tab in the spreadsheet that contains all required columns will be imported and tagged with the “Tab Name”. If there are multiple spreadsheets that contain all required columns, they will be imported as separate sections on the same SDP-V survey.</p>
          <p><strong>NOTE:</strong> If a required column from the table is missing, the user will receive an error message and the content will not be imported.</p>
          <br/>

          <h4 id="generic-content-organization"><p><strong>Content Organization: How to Identify Sections, Templates, or Repeating Groups within the Generic Spreadsheet Import Template</strong></p></h4>
          <p>Sections, templates, or repeating groups are created by listing data elements between 'START: insert section name' and 'END: insert section name' rows. Each row between these markers are imported as data elements within that grouping (called sections in the vocabulary service). Sub-sections or sub-groupings may be created by including additional 'START: ' and 'END: ' markers within a parent section or grouping</p>
          <ul>
            <li>The beginning of a section is indicated by the prefix 'START: ' (including a space after the colon)</li>
            <li>The end of a section is indicated by the prefix 'END: '(including a space after the colon)</li>
            <li>The text following the 'START: ' and 'END: ' pre-fixes will be imported as the Section Name in the vocabulary service</li>
            <li>The section name following the 'START: ' prefix must exactly match the section name following the 'END: ' prefix in order for the section to be correctly imported. </li>
            <li>Notes should not be included in the same row as the section name (e.g., after the ‘START:’ or ‘END:’ pre-fixes’)</li>
            <li>Text following a ‘NOTE:’ pre-fix will not be imported. </li>
          </ul>
          <br/>


          <h4 id="generic-associate-rs"><strong>How to Associate Response Sets with Choice Questions on Import</strong></h4>
          <p><strong>There are 3 options for Choice Questions for import into SDP-V:</strong></p>
          <ol>
            <li>A PHIN VADS response value can be associated with a question by providing a valid PHIN VADS value set URL
            <ul>
              <li>If you provide a PHIN VADS URL, the value set information will be parsed from PHIN VADS and linked to the appropriate question in SDP-V upon import. The PHIN VADS URL must contain “oid= identifier” in order to be accurately parsed by the importer. </li>
              <li>An example of a valid PHIN VADS URL is: https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=2.16.840.1.114222.4.11.7552</li>
            </ul>
            </li>
            <li>A local response set can be created in the template and associated with the appropriate question on import. </li>
            <li>The response set information can be left blank and the user can add response information through the SDP-V user interface</li>
          </ol>

          <p><strong>BEST PRACTICE:</strong> Check SDP-V for existing response sets before importing local response sets to prevent creating duplicate response sets in SDP-V.
          The SDP Vocabulary Service imports value sets from PHIN VADS on a weekly basis and other users have added response sets which are available to be reused or extended within SDP-V.
           Where applicable, existing SDP-V response sets should be reused or extended before creating new ones; this will allow SDP-V to show the relationship between response set and
           program and surveillance system usage. This will allow other users to see which response sets are most commonly used.</p>

          <br/>
          <h4 id="generic-local-rs"><strong>How to Create User-defined (“Local”) Response Sets Using the SDP-V Import Template</strong></h4>
          <p>A "local" response set is a response set defined within this template and does not already exist in either SDP-V or PHIN VADS.
          "Local" tells the importer to look for a response set tab within this template for more information.</p>

          <ol><li><strong>Populate Distinct Response Set Information on Separate Response Set Tabs in the Spreadsheet (Tab naming convention: RS #)</strong></li>
          <br/>
          <table className="set-table table">
            <caption><strong>Table 3. Response Set Tab Column Listings</strong></caption>
            <thead>
              <tr>
                <th  id="generic-rs-name-column">Column Name</th>
                <th  id="generic-rs-description-column">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="generic-rs-name-column">Response Set Name (R)</td>
                <td headers="generic-rs-description-column">The information contained in the first cell is imported as the ‘Response Set Name’.</td>
              </tr>
              <tr>
                <td headers="generic-rs-name-column">Response Set Description (O)</td>
                <td headers="generic-rs-description-column">The information contained in this column is imported as the ‘Response Set Description’ values in the response set table created in SDP-V. </td>
              </tr>
              <tr>
                <td headers="generic-rs-name-column">Display Name (R)</td>
                <td headers="generic-rs-description-column">The information contained in this column is imported as the ‘Display Name’ values in the response set table created in SDP-V. </td>
              </tr>
              <tr>
                <td headers="generic-rs-name-column">Response (R)</td>
                <td headers="generic-rs-description-column">The information contained in this column is imported as the ‘Response’ values in the response set table created in SDP-V.</td>
              </tr>
              <tr>
                <td headers="generic-rs-name-column">Code System Identifier (optional)</td>
                <td headers="generic-rs-description-column">The information contained in this column is imported as the ‘Code System Identifier (optional)’ values in the response set table created in SDP-V.</td>
              </tr>
            </tbody>
          </table>
          <br/>
          <li><strong>2.	Associate response set table #’s with appropriate question by entering the following values in the same row as the question text:</strong></li>
            <ul>
              <li>‘Local Response Set Table (C)’ (column F) – A local response set will be associated with the question in the same row where the value in this cell matches the name of a tab in the spreadsheet with the naming convention RS ID#, where ID# is a number assigned by the user to identify the response set in this template (e.g., RS 1, RS 2, RS 3...)
                <ul><li>The tab name identifies where the response set table information for a question is located</li></ul>
              </li>
            </ul>
          </ol>
          <br/>
          <h4 id="generic-add-code-system-mappings"><strong>How to Add Multiple Code System Mappings to Content Using the SDP-V Import Template</strong></h4>
          <p>
            The purpose of Code System Mappings (CSM) is to identify the governed concepts from code systems like LOINC, SNOMED, PHIN VADS, etc that are associated with response sets, questions, sections, or surveys in SDP-V. That is, the Code System Mappings table identifies how content in SDP-V is represented in another code system. <br/>
            A user can create a single mapping by filling in the Concept Name, Concept Identifier, and Code System Identifier cells on each tab for the respective content (e.g., question, section, or survey). However, in some cases, a user may want to map their content to multiple representations. The SDP-V Generic Importer supports multiple Code Systems Mappings; to import multiple CSM, you will need to create CSM tables on separate tabs within the SDP-V generic import spreadsheet. This feature should only be used when associating MORE THAN ONE code system mapping per item (e.g., survey, section, or question). Alternatively, users can add the CSMs manually through the UI.
          </p>

          <ol><li><strong>1.	Populate Code System Mappings Tables on Separate Tabs in the Spreadsheet (Tab naming convention: CSM #)</strong></li>

          <table className="set-table table">
            <caption><strong>Table 4. Response Set Tab Column Listings</strong></caption>
            <thead>
              <tr>
                <th  id="generic-tag-name-column">Column Name</th>
                <th  id="generic-tag-description-column">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="generic-tag-name-column">Concept Name (R)</td>
                <td headers="generic-tag-description-column">Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS. For each row that has data entered in this column, the following additional columns are required: Concept Identifier (C) and Code System Identifier (C). </td>
              </tr>
              <tr>
                <td headers="generic-tag-name-column">Concept Identifier (R)</td>
                <td headers="generic-tag-description-column">This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.  For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Code System Identifier (C).</td>
              </tr>
              <tr>
                <td headers="generic-tag-name-column">Code System Identifier (optional)</td>
                <td headers="generic-tag-description-column">This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code system identifier field will be automatically populated. For each row that has data entered in this column, the following additional columns are required: Concept Name (C) and Concept Identifier (C).</td>
              </tr>
              </tbody>
          </table>
          <br/>
          <li><strong>2.	Associate CSM tables #’s with appropriate Question, Section, or Survey by entering the following values in the same row as the mapped content:</strong></li>
            <ul>
              <li>‘Code System Mappings Table (O)’–  After import, the SDP-V item details page will be populated with values from the code system mappings table where the value in this cell matches the name of a tab in the import spreadsheet with the naming convention "CSM #", where # is a number assigned by the user to identify the mappings table in this template (e.g., CSM 1, CSM 2, CSM 3...). The CSM tab must contain the following headers (described above): Concept Name (R), Concept Identifier (R), and Code System Identifier (R).
                <ul><li>The tab name identifies where the CMS table information for a particular question, section, or survey is located in the import spreadsheet </li></ul>
              </li>
            </ul>
          </ol>
      </div>
    );
  }

  taggingInstructions() {
    // Need to update this section with single word tagging instructions
    return(
      <div className="tab-pane" id="tagging" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'tagging'} aria-labelledby="tagging-tab">
        <h1 id="tagging-content">Keyword Tags</h1>
        <h2>Purpose</h2>
        <p>Tags are text strings that are either keywords or short phrases created by users to facilitate content discovery, organization, and reuse. For instance, a survey called “’Traumatic brain injury” may be tagged with “Concussion” to help other users find that survey who may not think of searching for the term “traumatic brain injury”.<br/>The purpose of tags is not to identify unique concept identifiers or code systems associated with specific content. To specify code system mappings for your vocabulary, please see the “Code System Mappings” help documentation for additional information.</p>
        <p><strong>Mutability: </strong>Since keyword tags should only be used to facilitate content discovery and organization, keyword tags can be changed (added or deleted) at any time by the author to meet user needs and to optimize search results. The history of tags is not saved and a new version of content is not created whenever tags are changed.</p>
        <p><strong>Discoverability: </strong>Tags are included in the dashboard search algorithm so other users can find content that has been tagged with the same keyword(s) entered in the dashboard search bar. </p>
        <p><strong>How to add a tag: </strong>Tags are listed near the top of the details page under either the response set, question, section or survey name and version number next to the “Tags:” header. Tags may be added or removed by selecting “Update Tags” on the right-side of the screen across from the “Tags:” header. Tags may be either a single word or a short keyword phrase. After selecting “Update Tags”, a tag may be created by simply typing a keyword or short phrase and hitting the “enter” or “tab” key between tag entries and then selecting “Save”. </p>
        <p><strong>How to remove a tag: </strong>After a tag is successfully created, the UI will wrap the tag in a green box and an “x” will appear allowing the user to delete the tag in the future. To remove a tag, simply click on the “x” next to tag (within the green wrapping) and then select “Save”. Alternatively, tags can be added or removed on the content edit page.</p>
      </div>
    );
  }

  mappingInstructions() {
    // Need to update this section with single word tagging instructions
    return(
      <div className="tab-pane" id="mapping" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'mapping'} aria-labelledby="mapping-tab">
        <h1 id="mapping-content">Code System Mappings Help</h1>
        <h2>Purpose</h2>
        <p>The purpose of the Code System Mappings table is to identify the governed concepts from code systems like LOINC, SNOMED, PHIN VADS, etc that are associated with response sets, questions, sections, or surveys in SDP-V. That is, the Code System Mappings table identifies how content in SDP-V is represented in another code system.<br/>The Code System Mappings table should only include mapping to governed concepts. Non-governed concepts or keywords should not be added to the Code System Mappings table. If you would like to add keywords to your response set, question, section, or survey to facilitate content discovery or organization, please see the “Keyword Tags” help documentation for information on how to use the “Tags” feature.</p>
        <p><strong>Mutability: </strong>Any changes to entries in the Code System Mappings table are versioned since code system mappings are a property of the vocabulary itself. This allows users to update the Code System Mappings while maintaining legacy mappings in older SDP-V content versions if needed.</p>
        <p><strong>Discoverability: </strong>Code System Mappings table fields are included in the dashboard search algorithm so other users can find questions, sections, and surveys with specific concept names, concept identifiers or code system identifiers in SDP-V. For instance, a user can enter “27268008” into the dashboard search box to find content in SDP-V associated with that concept identifier. </p>

        <h2>Definitions</h2>
        <p><strong>Concept Name: </strong>Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS.</p>
        <p><strong>Concept Identifier: </strong>This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.</p>
        <p><strong>Code System Identifier: </strong>This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code system identifier field will be automatically populated.</p>

        <h2>Example Code System Mappings Table</h2>
        <table className="set-table table">
          <caption><strong></strong></caption>
          <thead>
            <tr>
              <th  id="concept-name">Concept Name</th>
              <th  id="concept-identifier">Concept Identifier</th>
              <th  id="code-sytem-identifier">Code System Identifier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td headers="concept-name">Genus Salmonella (organism)</td>
              <td headers="concept-identifier">27268008</td>
              <td headers="code-sytem-identifier">2.16.840.1.113883.6.96</td>
            </tr>
            <tr>
              <td headers="concept-name">Genus Campylobacter (organism)</td>
              <td headers="concept-identifier">35408001</td>
              <td headers="code-sytem-identifier">2.16.840.1.113883.6.96</td>
            </tr>
          </tbody>
        </table><br/>
        <p><strong>How to Search for Previously Used Code Mappings</strong><br/>To determine if a code system mapping has been used before in SDP-V, start typing in the concept name column of the table. A drop-down list of all previously used concept names that match the text entered in the field will appear. A user can navigate the list and select a concept name that was previously used. If a concept name is selected from the list, the concept identifier and code system identifier fields will be populated with existing values already entered in SDP-V.</p>
        <p><strong>How to Search for Code Mappings from an External Code Systems</strong><br/>Rather than requiring you to copy and paste codes from other code systems, SDP-V allows you to search for codes from specific external code systems by clicking on the “Search for external coded items” magnifying glass icon to the right of the code system mappings header. This opens the Search Codes dialog box. You may select a particular code system from the drop-down menu, or enter a search term to search across multiple code systems. This code search functionality searches codes from PHIN VADS. You may add coded values from these search results to the code mappings table by clicking the “Add” selection beside each result.</p>
        <p><strong>How to Create a New Code System Mapping</strong><br/>A new code system mapping may be created by simply typing a new concept name, concept identifier, and code system identifier. A new code mapping should only be created if an existing code mapping does not meet a user’s needs.</p>
      </div>
    );
  }

  commentInstructions() {
    return(
      <div className="tab-pane" id="comment" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'comment'} aria-labelledby="comment-tab">
        <h1 id="commenting-on-content">Commenting on Content</h1>
        <h2 id="public-comments">Public Comments</h2>
        <p>To post public comments, you must have a user account. Any comments posted will appear as posted “by user name”, where the user name that appears is the First Name and Last Name stored in the user profile.</p>
        <p><strong>Steps:</strong></p>
        <ul>
        <li>Login to SDP-V. </li>
        <li>Navigate to the details page of the content you wish to post public comments on</li>
        <li>Scroll down below the descriptive and linked content sections</li>
        <li>To start a new comment thread fill in the box immediately under the "Public Comments" header</li>
        <li>To reply to someone else's comment (which will automatically notify the user of your reply) click the "reply" link immediately under the comment</li>
        </ul>

        <h2 id="private-comments">Private Comments</h2>
        <p>Users can post comments about changes made to private draft content if they are either the author or a member of a collaborative authoring group with permission to edit the content.  These comments are saved on the Change History tab and log the date and time that the comment was saved and the user who created it. Visibility of the Change History tab is restricted to authors, authoring group members, and publishers (e.g., private comments).</p>
        <p><strong>Steps:</strong></p>
        <ul>
        <li>Login to SDP-V</li>
        <li>Navigate to the details page of the private draft content you wish to post a private comment</li>
        <li>Select Edit</li>
        <li>Type in the “Notes/Comment About Changes Made (Optional)” textbox</li>
        <li>Click Save</li>
        <li>Comments will appear on the “Change History” tab on the Details page.</li>
        </ul>
      </div>
    );
  }

  adminInstructions() {
    return(
      <div className="tab-pane" id="admin" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'admin'} aria-labelledby="admin-tab">
        <h1 id="admin-panel">Admin Panel</h1>
        <p><strong>Getting to the panel (requires administrator role):</strong></p>
        <ul>
        <li>When logged in to an account with administrator privileges, navigate to the account dropdown (click the email and gear-icon link in the top right of the application)</li>
        <li>Click the Admin Panel menu item to navigate to the main administration page</li>
        <li>The page has a number of tabs with different utilities described in detail below</li>
        </ul>
        <p><strong>Tabs:</strong></p>
        <ul>
        <li><a href="#admin-list">Admin List</a></li>
        <li><a href="#publisher-list">Publisher List</a></li>
        <li><a href="#prog-sys-list">Program and System Lists</a></li>
        <li><a href="#group-list">Group List</a></li>
        <li><a href="#elasticsearch-admin-tab">Elasticsearch</a></li>
        </ul>
        <h2 className="help-section-subtitle" id="admin-list">Admin List</h2>
        <p>This list will populate with all of the users who have administrative privileges. The admin role allows access to all content and all functionality in the application. To the right of each user name and email is a remove button that will revoke the admin role from that user. The admin role can be granted by typing in the email of a user and clicking the plus button. The user will then appear on the admin list or an error will be displayed explaining any issues with the addition.</p>
        <h2 className="help-section-subtitle" id="publisher-list">Publisher List</h2>
        <p>For usage instructions please see the information about the Admin List above. Adding members to this list allows them to see private content they did not author and publish that content to make it public.</p>
        <h2 className="help-section-subtitle" id="prog-sys-list">Program and System Lists</h2>
        <p>On the Program List and System List tabs an administrator can see a current list of all surveillance programs and systems currently available for users to work under. The admin can use the input fields and click the add button to make another program / system available for in the users profile drop down.</p>
        <h2 className="help-section-subtitle" id="group-list">Group List</h2>
        <p>On the group list tab an administrator can add new groups and curate the user membership lists for any of the groups in the application. For any group click on the Manage Users button in the right column to see a list of current users and add or remove users by email.</p>
        <h2 className="help-section-subtitle" id="elasticsearch-admin-tab">Elasticsearch</h2>
        <p>The Elasticsearch tab is used to synchronize the Elasticsearch database with any activity stored in the Vocabulary service database while Elasticsearch may have been down. This page should only be used according to the instructions given on the page by an experienced administrator. Actions on this page could cause Elasticsearch to become temporarily unavailable.</p>
      </div>
    );
  }

  instructionsTab() {
    return(
      <div className={`tab-pane ${this.state.selectedTab === 'instructions' && 'active'}`} id="instructions" role="tabpanel" aria-hidden={this.state.selectedTab !== 'instructions'} aria-labelledby="instructions-tab">
        <div className="col-md-3 how-to-nav no-print">
          <h2 className="showpage_sidenav_subtitle">
            <text className="sr-only">Version History Navigation Links</text>
            <ul className="list-inline">
              <li className="subtitle_icon"><span className="fa fa-graduation-cap " aria-hidden="true"></span></li>
              <li className="subtitle">Learn How To:</li>
            </ul>
          </h2>
          <ul className="nav nav-pills nav-stacked" role="tablist">
            <li id="general-tab" className="active" role="tab" onClick={() => this.selectInstruction('general')} aria-selected={this.state.selectedInstruction === 'general'} aria-controls="general"><a data-toggle="tab" href="#general">General</a></li>
            <li id="manage-account-tab" role="tab" onClick={() => this.selectInstruction('manage-account')} aria-selected={this.state.selectedInstruction === 'manage-account'} aria-controls="manage-account"><a data-toggle="tab" href="#manage-account">Manage Account</a></li>
            <li id="search-tab" role="tab" onClick={() => this.selectInstruction('search')} aria-selected={this.state.selectedInstruction === 'search'} aria-controls="search"><a data-toggle="tab" href="#search">Search</a></li>
            <li id="view-tab" role="tab" onClick={() => this.selectInstruction('view')} aria-selected={this.state.selectedInstruction === 'view'} aria-controls="view"><a data-toggle="tab" href="#view">View and Export Content</a></li>
            <li id="workflow-tab" role="tab" onClick={() => this.selectInstruction('workflow')} aria-selected={this.state.selectedInstruction === 'workflow'} aria-controls="workflow"><a data-toggle="tab" href="#workflow">Workflow Status and Content Stage</a></li>
            <li id="create-and-edit-tab" role="tab" onClick={() => this.selectInstruction('create-and-edit')} aria-selected={this.state.selectedInstruction === 'create-and-edit'} aria-controls="create-and-edit"><a data-toggle="tab" href="#create-and-edit">Create and Edit Content</a></li>
            <li id="curation-tab" role="tab" onClick={() => this.selectInstruction('curation')} aria-selected={this.state.selectedInstruction === 'curation'} aria-controls="curation"><a data-toggle="tab" href="#curation">Curation Wizard</a></li>
            <li id="import-tab" role="tab" onClick={() => this.selectInstruction('import')} aria-selected={this.state.selectedInstruction === 'import'} aria-controls="import"><a data-toggle="tab" href="#import">Import Content</a></li>
            <li id="tagging-tab" role="tab" onClick={() => this.selectInstruction('tagging')} aria-selected={this.state.selectedInstruction === 'tagging'} aria-controls="tagging"><a data-toggle="tab" href="#tagging">Tagging Content</a></li>
            <li id="mapping-tab" role="tab" onClick={() => this.selectInstruction('mapping')} aria-selected={this.state.selectedInstruction === 'mapping'} aria-controls="mapping"><a data-toggle="tab" href="#mapping">Code System Mappings</a></li>
            <li id="comment-tab" role="tab" onClick={() => this.selectInstruction('comment')} aria-selected={this.state.selectedInstruction === 'comment'} aria-controls="comment"><a data-toggle="tab" href="#comment">Comment on Content</a></li>
            <li id="admin-tab" role="tab" onClick={() => this.selectInstruction('admin')} aria-selected={this.state.selectedInstruction === 'admin'} aria-controls="admin"><a data-toggle="tab" href="#admin">Admin Panel</a></li>
          </ul>
        </div>
        <div className="tab-content col-md-8">
          {this.generalInstructions()}
          {this.searchInstructions()}
          {this.accountInstructions()}
          {this.viewInstructions()}
          {this.workflowInstructions()}
          {this.editInstructions()}
          {this.curationInstructions()}
          {this.importInstructions()}
          {this.taggingInstructions()}
          {this.mappingInstructions()}
          {this.commentInstructions()}
          {this.adminInstructions()}
        </div>
      </div>
    );
  }

  glossaryTab() {
    return (
      <div className="tab-pane" id="glossary" role="tabpanel" aria-hidden={this.state.selectedTab !== 'glossary'} aria-labelledby="glossary-tab">
      <h1 id="glossaryTab">Glossary</h1>
      <br/>
        <p><strong>Author –</strong> An actor (organization, person, or program) responsible for creating and/or maintaining a data collection item, a code set, a value set, or a data collection instrument</p>
        <p><strong>Code –</strong> a succinct label for a concept, variable, value, or question</p>
        <p><strong>Code System –</strong> a collection of unique codes pertaining to one or more topic areas and maintained as a unit; aka code set</p>
        <p><strong>Data Collection Instrument –</strong> a  method for collecting data from or about subjects using tests, questionnaires, inventories, interview schedules or guides, and survey plans</p>
        <p><strong>Data Collection Item –</strong> A question or data element used to indicate the name and meaning of a datum. It may be identified by a code in a code system, and it may be associated with keywords or search tags from a code system</p>
        <p><strong>Data Collection Item Group –</strong> a set of data collection items such as questions that are used together in data collection instruments, for example as questionnaire sections, message segments, or SDV-Sections</p>
        <p><strong>Data Collection Specification -</strong> a set of data terms or questions, definitions, and data value constraints used to describe information collected manually or electronically for surveillance purposes and may also prescribe organization and collection instructions, guidelines, or logic. Examples include an HL7 V2.x  message mapping guide, and HL7 CDA implementation guide</p>
        <p><strong>Data Element –</strong> A unit of data or a variable defined for evaluating and processing. It typically is associated with a code name, a description, and a set of expected values. It may have other associated metadata.</p>
        <p><strong>Question –</strong> a data collection item that has a natural language expression used to solicit a value for  a data variable. A question may be identified by a code name that stands for the question.</p>
        <p><strong>SDP-V Survey –</strong> a kind of data collection specification created in the SDP Vocabulary Service. It is a selection of questions and response sets (grouped into sections) used together to define the contents of a data collection instrument such as a survey instrument.</p>
        <p><strong>Survey Instrument -</strong> a data collection instrument in which the collection is done by asking questions and receiving responses. A survey can be implemented as a paper or electronic form, or as a live interview. This is also called a questionnaire</p>
        <p><strong>Value –</strong> an item of data that can be assigned to a data element or a response to a question</p>
        <p><strong>Value Set –</strong> a set of value choices that are applicable to one or more data collection items (e.g. data elements or questions). In the case where the data collection item is a question, a value set is also referred to as a response set.</p>
      </div>
    );
  }

  whatsnewTab() {
    return (
    <div className={`tab-pane ${this.state.selectedTab === 'whatsnew' && 'active'}`} id="whatsnew" role="tabpanel" aria-hidden={this.state.selectedTab !== 'whatsnew'} aria-labelledby="whatsnew-tab">
    <h1 id="whatsnewTab">What&lsquo;s New</h1>
      <br/>
      <p>Here you can find the latest news and information about the CDC Vocabulary Service.
          Read our latest release notes to learn how the application is continuously improving, learn
          about updates to user documentation, and find other announcements important to the user community.</p>
      <br/>
        <strong>Find Out What&lsquo;s New In:</strong>
        <br/>
        <br/>
        <ol>
          <a href="#announcements">Announcements</a><br/>
          <a href="#releasenotes">Release Notes </a>
              <small>
              (<a href="#1.1">1.1</a>,&nbsp;
              <a href="#1.2">1.2</a>,&nbsp;
              <a href="#1.3">1.3</a>,&nbsp;
              <a href="#1.4">1.4</a>,&nbsp;
              <a href="#1.5">1.5</a>,&nbsp;
              <a href="#1.6">1.6</a>,&nbsp;
              <a href="#1.7">1.7</a>,&nbsp;
              <a href="#1.8">1.8</a>,&nbsp;
              <a href="#1.9">1.9</a>,&nbsp;
              <a href="#1.10">1.10</a>,&nbsp;
              <a href="#1.11">1.11</a>,&nbsp;
              <a href="#1.12">1.12</a>,&nbsp;
              <a href="#1.13">1.13</a>,&nbsp;
              <a href="#1.14">1.14</a>,&nbsp;
              <a href="#1.15">1.15</a>,&nbsp;
              <a href="#1.16">1.16</a>,&nbsp;
              <a href="#1.17">1.17</a>,&nbsp;
              <a href="#1.18">1.18</a>,&nbsp;
              <a href="#1.19">1.19</a>,&nbsp;
              <a href="#1.20">1.20</a>,&nbsp;
              <a href="#1.21">1.21</a>,&nbsp;
              <a href="#1.22">1.22</a>,&nbsp;
              <a href="#1.23">1.23</a>)
              </small><br/>
          <a href="#userdocupdates">User Documentation Updates</a>
          </ol>
          <br/>
          <h4>Pipeline test...</h4>
          <br/>
          <h4 id="Announcements"><strong>Announcements</strong></h4>
            <ol>This section will be periodically updated with announcements relevant to the user community.  Please check back for updates.</ol>
          <br/>
          <h4 id="releasenotes"><strong>Release Notes</strong></h4>
            <ul>
            <li id="1.23"><strong>Release <a href='' target='_blank'>1.23</a></strong> <small>(July 2020)</small></li>
            <ol>
              <li>Response type default update to "Choice" when creating a Question.</li>
              <li>Updated Section Edit page with Type Filter allowing a user to easily distiguish between filtering between Questions and Sections.</li>
              <li>Added a Position info button to Create Section page.</li>
              <li>Updated API to return the latest version.</li>
              <li>Updated EPI Info export mapping.</li>
              <li>Description textbox updated in Details section to dynamically scale.</li>
              <InfoModal show={this.state.showInfoImportFileBug} header="Known Bug: File Import" body={<p>
                <ul>
                  <u>Status</u>: Deferred
                  <br/>
                  <u>Summary</u>:
                  <br/>
                  When a user attempts to import a file using the 'Import Spreadsheet' option, the user may encounter a 'Server 500' error stating that the import was not successful.<br/>
                  <u>Expected Result</u>: <br/>Dependant on file size, an error message is presented to the user with a '500 Server Error'.<br/>
                  <u>Actual Result</u>: <br/>Processing of the imported spreadsheet continues to process and the upload is successful.<br/>
                  <u>Content Requirements for Successful Import of the Spreadsheet</u>:
                  <ul>
                    <li>Formatting (i.e. Tab name or header name changes) of the Excel import spreadsheet file has not been changed.</li>
                    <li>Content is enterred and saved with accuracy.</li>
                  </ul>
                </ul></p>} hideInfo={()=>this.setState({showInfoImportFileBug: false})} />
                <li>File Import Error <i>(Known Bug<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoImportFileBug: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>)</i>.</li>
              <li>Security updates include acorn, arrify, coffeescript, del, devise, esquery, estraverse, fast-levenshtein, flat-cache, generate-function, glob, globby, handlebars, is-my-json-valid, is-property, jquery, json, js-yaml, lodash, nio4r, node-sass, nokogiri, nokogiri x64 and x86, optionator, path-parse, puma, rack, resolve, rimraf, swagger-cli, webpack, webpack-bundle-analyzer, websocket-extensions, word-wrap.</li>
              </ol>
            <li id="1.22"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/592838675/SDP+Vocabulary+Service+Release+1.22' target='_blank'>1.22</a></strong> <small>(August 6, 2019)</small></li>
              <ol>
              <li>Removed clickable filters and highlighting from dashboard items.</li>
              <li>Per usability testing feedback, components and detail sections have been reordered across the service for ease of readablity.</li>
              <li>Content stage filter badges have been added for ease of identification and use.</li>
              <li>Response Type and Category selections are now multi-select.</li>
              <li>Multi-select drop-downs do not disappear when a user selects multiple items.</li>
              <li>Duplicate content when viewing 'Author Recommended Response Sets' and 'Response Set Linked on Sections' have been removed.</li>
              <li>'Response Set Linked on Sections' has been renamed to 'Alternative Response Set Options'.</li>
              <li>SDP-V will return and store EPI Info published data.</li>
              </ol>
            <li id="1.21"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/579338249/SDP+Vocabulary+Service+Release+1.21' target='_blank'>1.21</a></strong> <small>(June 28, 2019)</small></li>
              <ol>
              <li>Users can now preview response sets linked to questions on the dashboard by clicking the 'preview' button on the right side of the search result expansion.</li>
              <li>The metrics API and admin dashboard now report a count of the number of collaborative authoring groups.</li>
              <li>The application now has a reusable info button that has been added to various places that required clarifications on language and use of functionality around the application.</li>
              <li>Various improvements were made to the dashboard based on the usability testing, including:
                <ul>
                <li>Increase visibility of object type color-coding scheme</li>
                <li>Object filters consolidated under the search bar and made to look more like filters</li>
                <li>Improve clarity of Program and System counts on dashboard with updated colors</li>
                <li>Rearranged layout and descreased size or eliminated unnecessary and unimportant information to reduce visual clutter</li>
                </ul>
              </li>
              </ol>
            <li id="1.20"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/571015169/SDP+Vocabulary+Service+Release+1.20' target='_blank'>1.20</a></strong> <small>(May 30, 2019)</small></li>
              <ol>
              <li>Implemented logic to determine if PHIN VADS link is valid and if the OID exists</li>
              <li>Added ability to create an Epi Info web-based Survey using SDP-V content</li>
              <li>Implemented versions of content on dashboard search results</li>
              <li>Implemented the abiliy to remove advanced filters from the dashboard</li>
              <li>Implemented the ability to indicate which Response Set is linked on Sections/Surveys when a user navigates to the Question details page</li>
              <li>Users have the ability to identify a new position for Question/Sections on Survey and Section edit pages</li>
              <li>Added the ability to view 'Hide retired content' on the dashboard</li>
              <li>Implemented sorting of search results to show most rescent version at the top</li>
              </ol>
            <li id="1.19"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/564461569/SDP+Vocabulary+Service+Release+1.19' target='_blank'>1.19</a></strong> <small>(May 2, 2019)</small></li>
              <ol>
              <li>Collaborator role has been implemented</li>
              <li>Implemented Dashboard Search Result Report Feature that allows users to export dashboard search results into a spreadsheet format</li>
              <li>Implemented metrics tab on admin panel to allow administrators to view system metrics</li>
              <li>Aggregate metrics have been exposed in the API</li>
              <li>Added pagination to linked content to accommodate application growth and ensure performance and page responsiveness as linked content increases on pages</li>
              <li>Curation wizard feature has been extended to allow administrators and publishers to view suggested replacement questions on surveys</li>
              <li>Additional google tags have been implemented for analytics</li>
              <li>Bug fixes</li>
              </ol>
            <li id="1.18"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/524910593/SDP+Vocabulary+Service+Release+1.18' target='_blank'>1.18</a></strong> <small>(Apr 5, 2019)</small></li>
              <ol>
              <li>Authors have the ability to request that publishers retired content</li>
              <li>'Draft' visibility has been changed to 'Private' and 'Published' visibility has been changed to 'Public' to attributes more intuitive</li>
              <li>"Access denied" message updated for authenticated and non-authenticated users to promote collaboration on private content</li>
              </ol>
            <li id="1.17"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/491061249/SDP+Vocabulary+Service+Release+1.17' target='_blank'>1.17</a></strong> <small>(Mar 8, 2019)</small></li>
              <ol>
              <li>Added advanced search feature on create Questions page</li>
              <li>Implemented "matched on fields" values to increase transparency of dashboard results</li>
              <li>Curation Wizard updates, including:</li>
              <ol type="a">
              <li>“Mark as Reviewed” capability to filter out previously reviewed suggestions</li>
              <li>Filter out "Retired" content from suggestions</li>
              <li>Optimize match algorithm</li>
              </ol>
              <li>Added Curation History Tab to Response Sets and Questions</li>
              </ol>
            <li id="1.16"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/484081696/SDP+Vocabulary+Service+Release+1.16' target='_blank'>1.16</a></strong> <small>(Feb 5, 2019)</small></li>
              <ol>
              <li>Elasticsearch improvements</li>
              <li>Advanced Filter Improvements</li>
              <li>Importer Bug Fixes</li>
              </ol>
            <li id="1.15"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/473858095/SDP+Vocabulary+Service+Release+1.15' target='_blank'>1.15</a></strong> <small>(Jan 8, 2019)</small></li>
              <ol>
              <li>Links in descriptions will open in a new tab</li>
              <li>Allow duplicate OMB number for more than one survey</li>
              <li>Improvement of linked content</li>
              <li>Exact match on dashboard with double quotes</li>
              <li>Dashboard search optimization and tokenizer changes</li>
              <li>Epi Info Export improvement</li>
              </ol>
            <li id="1.14"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/463994881/SDP+Vocabulary+Service+Release+1.14' target='_blank'>1.14</a></strong> <small>(Dec 04, 2018)</small></li>
              <ol>
                <li>Added 'What's New' tab to Help</li>
                <li>Updated SDP-V import template</li>
                <li>OMB Approval number and date on show page</li>
                <li>Metadata Tab importing for Surveys and Sections</li>
              </ol>
            <li id="1.13"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/462422017/SDP+Vocabulary+Service+Release+1.13' target='_blank'>1.13</a></strong> <small>(Nov 28, 2018)</small></li>
              <ol>
                <li>Tracking associations in the change history tab</li>
                <li>Rolling out large response set code in demo</li>
                <li>Single word tags and code system mappings</li>
                <li>API performance improvements</li>
              </ol>
            <li id="1.12"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/407928833/SDP+Vocabulary+Service+Release+1.12' target='_blank'>1.12</a></strong> <small>(Sept 28, 2018)</small></li>
              <ol>
                <li>Curating Public Content</li>
                <li>UI Asynchronous Rework & Optimizations</li>
                <li>Comprehensive Developer Documentation</li>
              </ol>
            <li id="1.11"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/360546430/SDP+Vocabulary+Service+Release+1.11' target='_blank'>1.11</a></strong> <small>(July 25, 2018)</small></li>
            <ol>
              <li>Introduction of Content Stage Attributes</li>
              <li>User Feedback Success Message</li>
              <li>Addition of Source to the Response Set Details Summary</li>
            </ol>
            <li id="1.10"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/349601800/SDP+Vocabulary+Service+Release+1.10' target='_blank'>1.10</a></strong> <small>(June 29, 2018)</small></li>
            <ol>
              <li>New Advanced Search filters</li>
              <li>Introduction of the Ability for an Author to Save Comments on Private Draft</li>
              <li>FHIR API Update</li>
            </ol>
            <li id="1.9"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/281509889/SDP+Vocabulary+Service+Release+1.9' target='_blank'>1.9</a></strong> <small>(May 22, 2018)</small></li>
            <ol>
              <li>Curation Wizard Feature</li>
              <li>"CDC preferred" content attribute</li>
              <li>Import content that conforms to SDP-V generic spreadsheet</li>
            </ol>
            <li id="1.8"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/256507905/SDP+Vocabulary+Service+Release+1.8' target='_blank'>1.8</a></strong> <small>(April 25, 2018)</small></li>
            <ol>
              <li>Revision history for private draft content</li>
              <li>"Delete/Delete All" prompts</li>
              <li>Group member visibility in the User Interface (UI)</li>
            </ol>
            <li id="1.7"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/212893697/SDP+Vocabulary+Service+Release+1.7' target='_blank'>1.7</a></strong> <small>(March 28, 2018)</small></li>
            <ol>
              <li>Export SDP-V data</li>
              <li>Survey creation by importing using Message Mapping Guide (MMG)</li>
              <li>"Contact Us" link addition</li>
            </ol>
            <li id="1.6"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/145883215/SDP+Vocabulary+Service+Release+1.6' target='_blank'>1.6</a></strong> <small>(February 26, 2018)</small></li>
            <ol>
              <li>User Interface (UI) updated for nesting sections and questions</li>
              <li>Generic spreadsheet importer update (i.e. FHIR API, Swagger API, MMG importer)</li>
              <li>Collaborative authoring group functionality</li>
            </ol>
            <li id="1.5"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/120750131/SDP+Vocabulary+Service+Release+1.5' target='_blank'>1.5</a></strong> <small>(January 30, 2018)</small></li>
            <ol>
              <li>Improvement to User Interface (UI) for nesting sections and questions</li>
              <li>FHIR API update</li>
              <li>User Interface navigation between various responses</li>
            </ol>
            <li id="1.4"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/48627713/SDP+Vocabulary+Service+Release+1.4' target='_blank'>1.4</a></strong> <small>(January 4, 2018)</small></li>
            <ol>
              <li>Share private draft content per groups</li>
              <li>User Interface to better display relationships between content</li>
              <li>SDP-V API update</li>
            </ol>
            <li id="1.3"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/60653574/SDP+Vocabulary+Service+Release+1.3' target='_blank'>1.3</a></strong> <small>(Nov 13, 2017)</small></li>
            <ol>
              <li>SDP-V form name update</li>
              <li>Added new advanced search filters</li>
              <li>Dashboard ranks</li>
            </ol>
            <li id="1.2"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/51871750/SDP+Vocabulary+Service+Release+1.2' target='_blank'>1.2</a></strong> <small>(Oct 17, 2017)</small></li>
            <ol>
              <li>Tag features</li>
              <li>"out of date" development</li>
              <li>Administration role feature</li>
            </ol>
            <li id="1.1"><strong>Release <a href='https://publichealthsurveillance.atlassian.net/wiki/spaces/SVS/pages/50036737/SDP+Vocabulary+Service+Release+1.1' target='_blank'>1.1</a></strong> <small>(Oct 10, 2017)</small></li>
              <ol>
                <li>See release for more details.</li>
              </ol>
              </ul>
              <br/>
              <h4 id="userdocupdates"><strong>User Documentation Updates</strong></h4>
              <ul>
              <li><strong>May 2019</strong></li>
              <ul>
                <li>The <strong>Vocabulary Service User Guide</strong>  has been updated with features available through Release 1.15.  The user guide is available on the <a href='https://www.cdc.gov/sdp/SDPHowItWorksVocabularyService.html' target='_blank'>Accessing SDP Vocabulary Service</a> webpage.</li>
                <li><strong>Surveillance Data Platform Vocabulary Service Fact Sheet</strong> has been updated.  The fact sheet is available at the bottom of the  <a href='https://www.cdc.gov/sdp/SDPVocabularyServiceSharedServices.html' target='_blank'>SDP Vocabulary Service</a> webpage.</li>
              </ul>
                  <li><strong>August 2018</strong></li>
                  <ul>
                    <li>The <strong>Vocabulary Service User Guide</strong> has been updated with features available through Release 1.8. The user guide is available on the <a href='https://www.cdc.gov/sdp/SDPHowItWorksVocabularyService.html' target='_blank'>Accessing SDP Vocabulary Service</a> webpage.</li>
                    <li><strong>Surveillance Data Platform Vocabulary Service Fact Sheet</strong> has been updated.  The fact sheet is available at the bottom of the  <a href='https://www.cdc.gov/sdp/SDPVocabularyServiceSharedServices.html' target='_blank'>SDP Vocabulary Service</a> webpage.</li>
                  </ul>
                  <li><strong>June 2018</strong></li>
                  <ul>
                    <li>The <strong>Vocabulary Service Value Diagram</strong> has been updated to reflect recent enhancements to the system. This diagram summarizes the value of the Vocabulary Service by highlighting specific capabilities of the service. The diagram is available on the <a href='https://www.cdc.gov/sdp/SDPVocabularyServiceSharedServices.html' target='_blank'>SDP Vocabulary Service</a> webpage.</li>
                    <li>The <strong>SDP Vocabulary Info Graphic</strong> has been updated to show that Sections can now include either questions or one or more sections (e.g., sub-sections or nested sections). This ability to nest sections was introduced in Release 1.5. The info graphic is available on the <a href='https://www.cdc.gov/sdp/SDPHowItWorksVocabularyService.html' target='_blank'>Accessing SDP Vocabulary Service</a> webpage.</li>
                  </ul>
              </ul>
    </div>
    );
  }

  render() {
    return (
      <div className="container" href="#help">
        <div className="row basic-bg">
          <div className="col-md-12">
            <div className="showpage_header_container no-print">
              <ul className="list-inline">
                <li className="showpage_button"><span className="fa fa-question-circle fa-2x" aria-hidden="true"></span></li>
                <li className="showpage_title"><h1>Help</h1></li>
              </ul>
            </div>
            <div className="container col-md-12">
              <div className="row">
                <div className="col-md-12 nopadding">
                  <ul className="nav nav-tabs" role="tablist">
                    <li id="instructions-tab" className={`nav-item ${this.state.selectedTab === 'instructions' && 'active'}`} role="tab" onClick={() => this.selectTab('instructions')} aria-selected={this.state.selectedTab === 'instructions'} aria-controls="instructions">
                      <a className="nav-link" data-toggle="tab" href="#instructions" role="tab">Instructions</a>
                    </li>
                    <li id="glossary-tab" className="nav-item" role="tab" onClick={() => this.selectTab('glossary')} aria-selected={this.state.selectedTab === 'glossary'} aria-controls="glossary">
                      <a className="nav-link" data-toggle="tab" href="#glossary" role="tab">Glossary</a>
                    </li>
                    <li id="faq-tab" className="nav-item" role="tab" onClick={() => this.selectTab('faq')} aria-selected={this.state.selectedTab === 'faq'} aria-controls="faq">
                      <a className="nav-link" data-toggle="tab" href="#faq" role="tab">FAQs</a>
                    </li>
                    <li id="whatsnew-tab" className={`nav-item ${this.state.selectedTab === 'whatsnew' && 'active'}`} role="tab" onClick={() => this.selectTab('whatsnew')} aria-selected={this.state.selectedTab === 'whatsnew'} aria-controls="whatsnew">
                      <a className="nav-link" data-toggle="tab" href="#whatsnew" role="tab">What&lsquo;s New</a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {this.instructionsTab()}
                    <div className="tab-pane" id="faq" role="tabpanel" aria-hidden={this.state.selectedTab !== 'faq'} aria-labelledby="faq-tab">
                      <h1 id="faqTab">FAQs</h1>
                      <br/>
                      <p>Please visit the FAQ page on the official cdc.gov website: <a href="https://www.cdc.gov/sdp/SDPFAQs.html#tabs-2-2" target="_blank">https://www.cdc.gov/sdp/SDPFAQs.html</a></p>
                    </div>
                    {this.glossaryTab()}
                    {this.whatsnewTab()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps}, dispatch);
}

Help.propTypes = {
  setSteps: PropTypes.func,
  location: PropTypes.object
};

export default connect(null, mapDispatchToProps)(Help);
