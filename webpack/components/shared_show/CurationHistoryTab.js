import React, {Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { Link } from 'react-router';
import Linkify from 'react-linkify';
import CodedSetTable from "../CodedSetTable";

class CurationHistoryTab extends Component {
  render() {
    if(this.props.contentStage !== 'Duplicate'){
      return (
        <div className={`basic-c-box panel-default ${this.props.type}-type`}>
          <div className="panel-heading">
            <h2 className="panel-title">Curation</h2>
          </div>
          <div className="box-content">
            No curation history available.
          </div>
        </div>
      );
    }

function GetDuplicateLink(sEvent, nDuplicateOf) {
  switch(sEvent)
  {
    case 'Response Set':
      return <Link to={`/responseSets/${nDuplicateOf}`}>Response Set #{nDuplicateOf}</Link>
    case 'Question':
      return <Link to={`/questions/${nDuplicateOf}`}>Question #{nDuplicateOf}</Link>
    default:
      return 'Duplicate not found.';
  }
}

    return (
            <div className={`basic-c-box panel-default ${this.props.type}-type`}>
              <div className="panel-heading">
                <h2 className="panel-title">Curation</h2>
                <br/>
                  The Curation Wizard promotes harmonization in data collection by identifying similar questions and response sets in SDP-V and suggesting them to the author of SDP-V surveys to consider for reuse. The author may decide to replace one or more questions and/or response sets on their survey with the suggested content if it is found to meet the author’s data collection needs. The following summarizes decisions by authors who have used the Curation Wizard to catalog their public SDP-V surveys.
                </div>
      <div className="box-content">
                  Authors have selected the following {this.props.objSetName}s as replacements for this {this.props.objSetName}:
                  <br/>
                  <br/>
                    {this.props.duplicateOf && this.props.contentStage && this.props.contentStage === 'Duplicate' &&
                      <div className="box-content">
                        {GetDuplicateLink(this.props.objSetName, this.props.duplicateOf)}
                        <br/>
                      </div>
                    }
                </div>
                <div className="box-content">
                  This {this.props.objSetName} has been selected by authors as a replacement for the following {this.props.objSetName}s:
                  <br/>
                  <br/>
                  <u>PlaceHolder for Link.</u>
                </div>
            </div>
        );
      }
    }

CurationHistoryTab.propTypes = {
  duplicateOf: PropTypes.number,
  contentStage: PropTypes.string,
  type: PropTypes.string
};

export default CurationHistoryTab;
