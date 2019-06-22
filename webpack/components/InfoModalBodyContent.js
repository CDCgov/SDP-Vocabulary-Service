import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Provides a content based library for the InfoModal 'body' to reduce duplication of content
export default class InfoModalBodyContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  getContentStageInfoBody() {
    if(this.props.contentStage == 'Draft')        {
      return <p>Content is being worked on by its Authors and Publisher. It is generally not considered to be “complete” and unlikely ready for comment. Content at this Level should not be used. This is the initial status assigned to newly created content.</p>;
    }   else if(this.props.contentStage == 'Comment Only')     {
      return <p>Content is being worked on by its Authors and Publisher. It is generally not considered to be “complete” but is ready for viewing and comment. Content at this Level should not be used.</p>;
    }   else if(this.props.contentStage == 'Trial Use')        {
      return <p>Content that the Authors and Publisher believe is ready for User viewing, testing and/or comment. It is generally “complete”, but not final. Content at this Level should not be used to support public health response.</p>;
    }   else if(this.props.contentStage == 'Published')        {
      return <p>A publicly available version of content that is ready for viewing, downloading, comments, and use for public health response.  Content is automatically updated to this stage at the time it is made public.</p>;
    }    else if(this.props.contentStage == 'Retired')         {
      return <p>Content that is no longer the most recent version (not latest). However, this content could be used with no known risk.</p>;
    }    else if(this.props.contentStage == 'Duplicate')       {
      return <p>Content that the Author and Publisher believe is either syntactically or conceptually a duplicate of other content in the SDP-V repository. Content marked as “Duplicate” should not be used when creating new SDP-V Surveys. If content marked as “Duplicate” is used on an existing SDP-V Survey, it should be replaced during the next revision. This content stage is assigned whenever users curate their public Surveys using the   curation wizard. This content stage cannot be assigned by users outside of the curation wizard.</p>;
    }
  }

  getVisibilityInfoBody() {
    if(this.props.visibility == 'private')        {
      return <p>When content is initially created or imported in Vocabulary Service, it is created with private visibility. Private content is only visible to the user who authored it, users that belong to a group that the content is added to, and to all Publishers in the system. Content with this visibility can be modified until the author or authoring group is ready to make the content public.</p>;
    }   else if(this.props.visibility == 'public')     {
      return <p>Whenever an author or authoring group is ready to share their content publicly, an author must send a request to their program Publisher to change the visibility in the Vocabulary Service. Public content is visible to everyone who visits the Vocabulary Service website including users without authenticated accounts. This allows for authors to share their Vocabulary Service content with a wide public health audience. Once a version is made public, it cannot be undone.
          <br/>
          <br/>
          An author can use the content stage attribute to indicate the maturity of a specific version of content and can create a new version when necessary. Authors can request that public content is “retired” which hides the content from dashboard search results.</p>;
    }
  }

  getVersionInfoBody() {
    return <p>The version independent ID  is an API parameter that uniquely identifies a particular response set, question, section, or SDP-V survey. If a version is not specified, the API will return the most recent version of vocabulary.</p>;
  }

  getTagInfoBody() {
    return <p>Tags are text strings that are either keywords or short phrases created by users to facilitate content discovery, organization, and reuse. Tags are weighted in the dashboard search result algorithm so users are presented with search results that have been tagged with the same keyword(s) entered in the dashboard search bar.
          <br/>
          <br/>
          Keyword tags can be changed (added or deleted) at any time by the author(s) to meet user needs and to optimize search results. The history of tags is not saved on the change history tab; tags are not versioned.</p>;
  }

  getVersionIndependentIDInfoBody() {
    return <p>The version independent ID is an API parameter that uniquely identifies a particular response set, question, section, or SDP-V survey. If a version is not specified, the API will return the most recent version of vocabulary.</p>;
  }

  getCodeSystemMappingsInfoBody() {
    return <p>FROM MODAL.</p>;
  }

  codeMappingHelpModal(){
    return <div>
    <h2 clasName='no-padding-top'>Purpose</h2>
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
    </div>;
  }

  getMarkAsReviewedInfoBody() {
    return <p>After review, if no good replacements are found in the system, clicking “Mark as Reviewed” will  mark this response set as reviewed on today’s date and will filter out these suggestions from future results. Only new response sets added to SDP-V after the “marked as reviewed” date will be suggested when returning to curate this survey so that the author can focus on the new suggestions.<br/><br/>The date filter may be removed at any time by clicking “Show all past suggestions“.
    </p>;
  }

  getMarkAsReviewedInfoBody() {
    return <p>After review, if no good replacements are found in the system, clicking “Mark as Reviewed” will  mark this response set as reviewed on today’s date and will filter out these suggestions from future results. Only new response sets added to SDP-V after the “marked as reviewed” date will be suggested when returning to curate this survey so that the author can focus on the new suggestions.<br/><br/>The date filter may be removed at any time by clicking “Show all past suggestions“.
    </p>
    }

  render() {
    if(this.props.enum == 'contentStage') {
      return this.getContentStageInfoBody();
    } else if (this.props.enum == 'visibility') {
      return this.getVisibilityInfoBody();
    } else if (this.props.enum == 'version') {
      return this.getVersionInfoBody();
    } else if (this.props.enum == 'tags') {
      return this.getTagInfoBody();
    } else if (this.props.enum == 'versionIndependentID') {
      return this.getVersionIndependentIDInfoBody();
    } else if (this.props.enum == 'codeSystemMappings') {
      return this.getCodeSystemMappingsInfoBody();
    } else if (this.props.enum == 'codeMappingHelpModal') {
      return this.codeMappingHelpModal();
    } else if (this.props.enum == 'markAsReviewed') {
      return this.getMarkAsReviewedInfoBody();
    }
  }
}

InfoModalBodyContent.propTypes = {
  enum: PropTypes.string,
  contentStage: PropTypes.string,
  visibility: PropTypes.string
};
