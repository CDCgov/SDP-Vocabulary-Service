import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import VersionInfo from './VersionInfo';
import { hashHistory } from 'react-router';
import FormQuestionList from './FormQuestionList';
import CodedSetTable from "./CodedSetTable";
import ProgramsAndSystems from "./shared_show/ProgramsAndSystems";
import PublisherLookUp from "./shared_show/PublisherLookUp";
import currentUserProps from "../prop-types/current_user_props";
import { publishersProps } from "../prop-types/publisher_props";
import { isEditable, isRevisable, isPublishable, isExtendable } from '../utilities/componentHelpers';

export default class ResponseSetDetails extends Component {
  render() {
    const {responseSet} = this.props;
    if(responseSet === undefined || responseSet.name === undefined){
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div id={"response_set_id_"+responseSet.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title"><h1>Response Set Details {responseSet.status === 'draft' && <text>[DRAFT]</text>}</h1></li>
          </ul>
        </div>
        {this.historyBar(responseSet)}
        {this.mainContent(responseSet)}
      </div>
    );
  }

  historyBar(responseSet) {
    return (
      <div className="col-md-3 nopadding no-print">
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={responseSet} versionableType='ResponseSet' />
      </div>
    );
  }

  sourceLink(responseSet) {
    if(responseSet.source === 'PHIN_VADS' &&  responseSet.oid && responseSet.version === responseSet.mostRecent) {
      return <a href={`https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=${responseSet.oid}`}>PHIN VADS</a>;
    } else if (responseSet.source === 'PHIN_VADS') {
      return <a href="https://phinvads.cdc.gov">PHIN VADS</a>;
    } else {
      return <text>{responseSet.source[0].toUpperCase() + responseSet.source.slice(1)}</text>;
    }
  }

  mainContent(responseSet) {
    return (
      <div className="col-md-9 nopadding maincontent">
        {this.props.currentUser && this.props.currentUser.id &&
          <div className="action_bar no-print">
            {isEditable(responseSet, this.props.currentUser) &&
              <PublisherLookUp publishers={this.props.publishers}
                             itemType="Response Set" />
            }
            {isRevisable(responseSet, this.props.currentUser) &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/revise`}>Revise</Link>
            }
            {isEditable(responseSet, this.props.currentUser) &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/edit`}>Edit</Link>
            }
            {isExtendable(responseSet, this.props.currentUser) &&
              <Link className="btn btn-default" to={`/responseSets/${responseSet.id}/extend`}>Extend</Link>
            }
            {isPublishable(responseSet, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.publishResponseSet(responseSet.id);
                return false;
              }}>Publish</a>
            }
            {isEditable(responseSet, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              if(confirm('Are you sure you want to delete this Response Set? This action cannot be undone.')){
                this.props.deleteResponseSet(responseSet.id, (response) => {
                  if (response.status == 200) {
                    let stats = Object.assign({}, this.props.stats);
                    stats.responseSetCount = this.props.stats.responseSetCount - 1;
                    stats.myResponseSetCount = this.props.stats.myResponseSetCount - 1;
                    this.props.setStats(stats);
                    this.props.router.push('/');
                  }
                });
              }
              return false;
            }}>Delete</a>
          }
          </div>
        }
        <div className="maincontent-details">
          <h1 className="maincontent-item-name"><strong>Name:</strong> {responseSet.name} </h1>
          <p className="maincontent-item-info">Version: {responseSet.version} - Author: {responseSet.createdBy && responseSet.createdBy.email} </p>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">Details</h2>
            </div>
            <div className="box-content">
              <strong>Description: </strong>
              {responseSet.description}
            </div>
            <div className="box-content">
              <strong>Created: </strong>
              { format(parse(responseSet.createdAt,''), 'MMMM Do YYYY, h:mm:ss a') }
            </div>
            { responseSet.parent &&
              <div className="box-content">
                <strong>Extended from: </strong>
                <Link to={`/responseSets/${responseSet.parent.id}`}>{ responseSet.parent.name }</Link>
              </div>
            }
            { responseSet.source &&
              <div className="box-content">
                <strong>Import / Source: </strong>
                {this.sourceLink(responseSet)}
              </div>
            }
            { responseSet.status === 'published' && responseSet.publishedBy && responseSet.publishedBy.email &&
            <div className="box-content">
              <strong>Published By: </strong>
              {responseSet.publishedBy.email}
            </div>
            }
          </div>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">Responses</h2>
            </div>
            <div className="box-content">
            <CodedSetTable items={responseSet.responses} itemName={'Response'} />
            </div>
          </div>
          {this.props.questions && this.props.questions.length > 0 &&
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Linked Questions</h2>
              </div>
              <div className="box-content">
                <FormQuestionList questions={this.props.questions} />
              </div>
            </div>
          }
          {responseSet.status === 'published' &&
            <ProgramsAndSystems item={responseSet} />
          }
        </div>
      </div>
    );
  }
}

ResponseSetDetails.propTypes = {
  responseSet: responseSetProps,
  router: PropTypes.object,
  currentUser: currentUserProps,
  publishResponseSet: PropTypes.func,
  deleteResponseSet:  PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  questions: PropTypes.arrayOf(questionProps),
  publishers: publishersProps
};
