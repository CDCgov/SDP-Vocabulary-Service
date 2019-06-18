import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Provides a content based library for the InfoModal 'body' to reduce duplication of content
export default class InfoModalBodyContent extends Component {
  constructor(props) {
    super(props);
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
    return <p>Description test.</p>;
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
    }
  }
}

InfoModalBodyContent.propTypes = {
  enum: PropTypes.string,
  contentStage: PropTypes.string,
  visibility: PropTypes.string
};
