import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSteps } from '../actions/tutorial_actions';

class Help extends Component {
  constructor(props){
    super(props);
    this.selectTab = this.selectTab.bind(this);
    this.selectInstruction = this.selectInstruction.bind(this);
    this.state = {
      selectedTab: 'instructions',
      selectedInstruction: 'general'
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
        <p><strong>Navigation and Help Basics:</strong></p>
        <ul>
        <li>Use the top bar to log-in, sign-up, or navigate to various pages.</li>
        <li>Clicking the CDC logo in the top left will return you to the landing page at any time.</li>
        <li>The footer contains useful links to pages with additional information about the site, including the application version. Please reference this version number in any bug reports.</li>
        <li>On most pages the top right navigation bar gives a &quot;Help&quot; option. Click on this option to view documentation for various actions or see step-by-step walk throughs on some pages. The step by step walkthroughs are also available below in plain text format.</li>
        </ul>
        <h2 id="step-by-step">Step-by-Step Walkthroughs by Page</h2>
        <h3>Dashboard</h3>
        <ul>
        <li>Type in your search term and search across all items by default. Results include items you own and published items.</li>
        <li>Click on any of the type boxes to highlight them and toggle on filtering by that single item type.</li>
        <li>Click Advanced Link to see additional filters you can apply to your search.</li>
        <li>If you already have an account you can log in to unlock more features in the top right of the dashboard page.</li>
        <li>Click the Get Started! button on the banner to register a new account.</li>
        <li>Click on any of the rows in the My Stuff Analytics panel to filter by items you authored.</li>
        <li>Click the create menu and then select an item type to author a new item.</li>
        <li>Click the alerts dropdown to see any new notifications about your content.</li>
        <li>Click your e-mail to see various account management options.</li>
        </ul>
        <h3>Section Edit Page</h3>
        <ul>
        <li>If you need to create a new question without leaving the the section use this button to author a new question from scratch.</li>
        <li>Type in your search keywords here to search for questions to add to the section.</li>
        <li>Click Advanced to see additional filters you can apply to your search.</li>
        <li>Use these search results to find the question you want to add.</li>
        <li>Click on the add button to select a question for the section.</li>
        <li>Edit the various section details on the right side of the page. Select save in the top right of the page when done editing to save a draft of the content.</li>
        </ul>
        <h3>Section Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on published content</li>
        </ul>
        <h3>Question Edit Page</h3>
        <ul>
        <li>Use the input fields to edit content of the question. If the response type is open choice this panel will also give you the option to associate response sets with this quesiton at creation time</li>
        <li>Click the search icon to search for and add tags to the question</li>
        <li>Alternatively, you can manually add a tag - click the plus sign to add additional tags to associate with the question</li>
        <li>The Display Name field is what the user will see on the page</li>
        <li>Optionally, you can enter a code and a code system for the tag you are adding if it belongs to an external system (such as LOINC or SNOMED)</li>
        <li>Click save to save a draft of the edited content</li>
        </ul>
        <h3>Question Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on published content</li>
        </ul>
        <h3>Response Set Edit Page</h3>
        <ul>
        <li>Use the input fields to edit content of the response set</li>
        <li>Click the search icon to search for and add coded responses to the response set</li>
        <li>Alternatively, you can manually add a response - click the plus sign to add additional responses to associate with the response set</li>
        <li>The Display Name field is what the user will see on the page</li>
        <li>Optionally, you can enter a code and a code system for the response you are adding if it belongs to an external system (such as LOINC or SNOMED)</li>
        <li>Click save to save a draft of the edited content</li>
        </ul>
        <h3>Response Set Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on published content</li>
        </ul>
        <h3>Survey Edit Page</h3>
        <ul>
        <li>Type in your search keywords here to search for sections to add to the survey</li>
        <li>Click Advanced to see additional filters you can apply to your search</li>
        <li>Use these search results to find the section you want to add</li>
        <li>Click on the add button to select a section for the survey</li>
        <li>Edit the various survey details on the right side of the page. Select save in the top right of the page when done editing to save a draft of the content</li>
        </ul>
        <h3>Survey Details Page</h3>
        <ul>
        <li>Use the history side bar to switch between revisions of an item if more than one exists</li>
        <li>See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a className="tutorial-link" href="#help">Help Documentation (linked here).</a></li>
        <li>At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on published content</li>
        </ul>
        <h3>Help Page</h3>
        <ul>
        <li>Click any item in the left side bar to see instructions on how to perform any of the specified activities</li>
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
        <li><a href="#sign-up">Sign Up</a></li>
        <li><a href="#logging-in">Logging In</a></li>
        <li><a href="#logging-out">Logging Out</a></li>
        </ul>
        <h2 className="help-section-subtitle" id="sign-up">Sign Up</h2>
        <p>When you navigate to the page and you have not yet logged in there will be a sign up button at the top right corner of the screen. You can also click the &quot;Get Started!&quot; button on the landing page banner. A window will pop up asking for your information. Fill out as much information as possible and save. You should now see your e-mail with a gear icon in the navigation bar in the top right.</p>
        <h2 className="help-section-subtitle" id="logging-in">Logging In</h2>
        <p>If you already have an account simply click the log-in link in the blue navigation bar in the top right of the screen. If you do not see a log-in button the browser may be logged in from a previous session. In that case see how to log out below.</p>
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
        <li><a href="#basic-search">Basic search</a></li>
        <li><a href="#filtering-by-type">Filtering by type</a></li>
        <li><a href="#see-content-you-own">See content you own</a></li>
        <li><a href="#advanced-filtering">Advanced filtering</a></li>
        </ul>
        <h2 className="help-section-subtitle" id="basic-search">Basic Search</h2>
        <p>On the dashboard there is a search bar that can be used to find questions, response sets, sections, and surveys. Typing in search terms that might be found in the name, description, author e-mail, and various other relevant fields on the items.</p>
        <h2 className="help-section-subtitle" id="filtering-by-type">Filtering by Type</h2>
        <p>You can filter a search by the type of content by clicking on the analytics icons immediately below the search bar on the dashboard page. Clicking on any of those four squares on the top of the page will filter by the type specified in the square and highlight the square. Once a filter is applied you can click on the &#39;clear filter&#39; link that will appear under the icons on the dashboard.</p>
        <h2 className="help-section-subtitle" id="see-content-you-own">See Content You Own</h2>
        <p>Similar to searching by type (described above) when you are logged in to an account the dashboard will have a &quot;My Stuff&quot; section displayed on the right side of the dashboard. Clicking on any of the icons or the filter link in that panel will highlight the filter applied in blue and filter any searches done to only return drafts and published content that you own.</p>
        <h2 className="help-section-subtitle" id="advanced-filtering">Advanced Filtering</h2>
        <p>Under the search bars seen across the app there is an &#39;Advanced&#39; link. If you click that link it will pop up a window with additional filters that you can apply. Any filters you select will limit your searches by the selected filters. The window also has a clear filters buttons that will reset back to the default search.</p>
        <p>If a warning symbol appears next to the Advanced link or you see an error message in the advanced search pop-up, the advanced search server (Elasticsearch) is likely down. Please check back later or contact your system administrator if the issue is persistent.</p>
      </div>
    );
  }

  viewInstructions() {
    return(
      <div className="tab-pane" id="view" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'view'} aria-labelledby="view-tab">
        <h1 id="view-content">View Content</h1>
        <p><strong>Options:</strong></p>
        <ul>
        <li>On the dashboard and various other places you will see a little summary box, or widget, displaying important information about the search result.</li>
        <li>Clicking the bottom link on each widget expands a box with additional information about the item.</li>
        <li>In most places the full details page can be seen by clicking the name / title link of the item.</li>
        <li>On the edit pages the name link is disabled but you can click the eyeball icon on any of the widgets to navigate to the details page.</li>
        </ul>
        <h2 className="help-section-subtitle" id="exporting">Exporting</h2>
        <p>On the view pages for sections there is an action button that exports the current section to REDCap. To export a section and use it in REDCap execute the following steps (exact wording may differ slightly based on your version of REDCap):</p>
        <ul>
        <li>Click on the 'Export to REDCap' button on the Vocabulary service section details page (this will save a .xml file to the folder your browser directs downloads)</li>
        <li>Open up REDCap</li>
        <li>Choose the option to create a new project</li>
        <li>On the project creation page follow the on screen instructions to add a name and various attributes to the new projects</li>
        <li>Look for an option titled something similar to "Start project from scratch or begin with a template?" and choose the "Upload a REDCap project XML file" option</li>
        <li>Click the "Choose File" button to select the .xml file you downloaded from the vocabulary service, it will be in the folder your browser downloads content into (usually the 'Downloads' folder)</li>
        <li>After selecting the .xml file to import and filling out the rest of the fields, click on the Create Project or Start Project button at the bottom of the page</li>
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
        <li>To start a new draft of any item click on the &quot;Create&quot; drop down in the top navigation bar on the dashboard.</li>
        <li>On the creation / editing page change any fields that need to be updated and press save - this saves a draft of the first version of the new item that will need to get published by a publisher before it will be visible to others.</li>
        <li>If you try to navigate away before saving the changes a prompt will ask if you want to navigate away without saving or save before you leave.</li>
        </ul>
        <h2 className="help-section-subtitle" id="edit-content">Edit Content</h2>
        <p><strong>Note:</strong> You can only edit your own draft content - once content is published you will be given the option to create a new revision of the content.</p>
        <ul>
        <li>When looking at the search result for the item you want to edit click on the menu button in the bottom right and select edit.</li>
        <li>When on the details page of an item the edit or revise button should appear in the top right above the item information.</li>
        <li>On the edit page change any fields that need to be updated and press save - this overwrites the previous draft with the changes made and does not keep a history of the previous draft.</li>
        </ul>
        <h2 className="help-section-subtitle" id="revise-content">Revise Content</h2>
        <p><strong>Note:</strong> You can only revise your own published content. Saving a revision will save a draft of that revision until you publish the new version.</p>
        <ul>
        <li>When looking at the search result for the item you want to revise click on the menu button in the bottom right and select revise</li>
        <li>When on the details page of an item the edit or revise button should appear in the top right above the item information</li>
        <li>On the revision editing page change any fields that need to be updated and press save - this saves a draft of the new version that will need to get published by a publisher before it will be visible to others.</li>
        </ul>
        <h2 className="help-section-subtitle" id="extend-content">Extend Content</h2>
        <p><strong>Note:</strong> You can only extend published content. Unlike revising, you do not need to be the original author of something to extend it (use it as a template with its own version history). Saving an extension will save a draft that is the first version (new revision history) with a link to the content it was extended from.</p>
        <ul>
        <li>When looking at the search result for the item you want to revise click on the menu button in the bottom right and select revise</li>
        <li>When on the details page of an item the edit or revise button should appear in the top right above the item information</li>
        <li>On the extension editing page change any fields that need to be updated and press save - this saves a draft of the first version of the extended item that will need to get published by a publisher before it will be visible to others.</li>
        </ul>
      </div>
    );
  }

  taggingInstructions() {
    return(
      <div className="tab-pane" id="tagging" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'tagging'} aria-labelledby="tagging-tab">
        <h1 id="tagging-content">Tagging Content</h1>
        <p>Surveys, Sections, and Response Sets may all be tagged to facilitate content discovery and reuse. Currently, a tag consists of a name, a value or code, and a code system (which is optional depending on if the tag is coded or not).</p>
        <p>When editing content and a user starts typing in the tag column of the table a dropdown list will appear of all previously used tags. A user can use the arrow keys to navigate the list and select a tag that was previously used, or continue typing to enter a completely new tag.</p>
        <p>If the user wants to look for tags by the code or the code system typing these values into the tag field will filter the list by the code or code system as well.</p>
      </div>
    );
  }

  commentInstructions() {
    return(
      <div className="tab-pane" id="comment" role="tabpanel" aria-hidden={this.state.selectedInstruction !== 'comment'} aria-labelledby="comment-tab">
        <h1 id="commenting-on-content">Commenting on Content</h1>
        <p><strong>Steps:</strong></p>
        <ul>
        <li>Navigate to the details page of the content you wish to post public comments on</li>
        <li>Scroll down below the descriptive content section</li>
        <li>To start a new comment thread fill in the box immediately under the &quot;Public Comments&quot; header</li>
        <li>To reply to someone else&#39;s comment (which will automatically notify the user of your reply) click the &quot;reply&quot; link immediately under the comment</li>
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
        </ul>
        <h2 className="help-section-subtitle" id="admin-list">Admin List</h2>
        <p>This list will populate with all of the users who have administrative privileges. The admin role allows access to all content and all functionality in the application. To the right of each user name and email is a remove button that will revoke the admin role from that user. The admin role can be granted by typing in the email of a user and clicking the plus button. The user will then appear on the admin list or an error will be displayed explaining any issues with the addition.</p>
        <h2 className="help-section-subtitle" id="publisher-list">Publisher List</h2>
        <p>For usage instructions please see the information about the Admin List above. Adding members to this list allows them to see draft content they did not author and publish that content to make it public.</p>
      </div>
    );
  }

  instructionsTab() {
    return(
      <div className="tab-pane active" id="instructions" role="tabpanel" aria-hidden={this.state.selectedTab !== 'instructions'} aria-labelledby="instructions-tab">
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
            <li id="create-and-edit-tab" role="tab" onClick={() => this.selectInstruction('create-and-edit')} aria-selected={this.state.selectedInstruction === 'create-and-edit'} aria-controls="create-and-edit"><a data-toggle="tab" href="#create-and-edit">Create and Edit Content</a></li>
            <li id="tagging-tab" role="tab" onClick={() => this.selectInstruction('tagging')} aria-selected={this.state.selectedInstruction === 'tagging'} aria-controls="tagging"><a data-toggle="tab" href="#tagging">Tagging Content</a></li>
            <li id="comment-tab" role="tab" onClick={() => this.selectInstruction('comment')} aria-selected={this.state.selectedInstruction === 'comment'} aria-controls="comment"><a data-toggle="tab" href="#comment">Comment on Content</a></li>
            <li id="admin-tab" role="tab" onClick={() => this.selectInstruction('admin')} aria-selected={this.state.selectedInstruction === 'admin'} aria-controls="admin"><a data-toggle="tab" href="#admin">Admin Panel</a></li>
          </ul>
        </div>
        <div className="tab-content col-md-8">
          {this.generalInstructions()}
          {this.searchInstructions()}
          {this.accountInstructions()}
          {this.viewInstructions()}
          {this.editInstructions()}
          {this.taggingInstructions()}
          {this.commentInstructions()}
          {this.adminInstructions()}
        </div>
      </div>
    );
  }

  glossaryTab() {
    return (
      <div className="tab-pane" id="glossary" role="tabpanel" aria-hidden={this.state.selectedTab !== 'glossary'} aria-labelledby="glossary-tab">
        <h1 id="glossary">Glossary</h1>
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

  render() {
    return (
      <div className="container">
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
                    <li id="instructions-tab" className="nav-item active" role="tab" onClick={() => this.selectTab('instructions')} aria-selected={this.state.selectedTab === 'instructions'} aria-controls="instructions">
                      <a className="nav-link" data-toggle="tab" href="#instructions" role="tab">Instructions</a>
                    </li>
                    <li id="glossary-tab" className="nav-item" role="tab" onClick={() => this.selectTab('glossary')} aria-selected={this.state.selectedTab === 'glossary'} aria-controls="glossary">
                      <a className="nav-link" data-toggle="tab" href="#glossary" role="tab">Glossary</a>
                    </li>
                    <li id="faq-tab" className="nav-item" role="tab" onClick={() => this.selectTab('faq')} aria-selected={this.state.selectedTab === 'faq'} aria-controls="faq">
                      <a className="nav-link" data-toggle="tab" href="#faq" role="tab">FAQs</a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {this.instructionsTab()}
                    <div className="tab-pane" id="faq" role="tabpanel" aria-hidden={this.state.selectedTab !== 'faq'} aria-labelledby="faq-tab">
                      <h1 className="help-section-title">FAQs</h1>
                      <p>This section has not been added. Please check back later.</p>
                    </div>
                    {this.glossaryTab()}
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
  setSteps: PropTypes.func
};

export default connect(null, mapDispatchToProps)(Help);
