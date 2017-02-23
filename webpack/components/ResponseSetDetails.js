import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Routes from "../routes";
import moment from 'moment';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import VersionInfo from './VersionInfo';
import { hashHistory } from 'react-router';
import QuestionList from './QuestionList';
import currentUserProps from "../prop-types/current_user_props";
import _ from 'lodash';

export default class ResponseSetDetails extends Component {
  render() {
    const {responseSet} = this.props;
    if(!responseSet){
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div id={"response_set_id_"+responseSet.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title">Response Set Details</li>
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
        <div className="showpage_sidenav_subtitle">
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </div>
        <VersionInfo versionable={responseSet} versionableType='ResponseSet' />
      </div>
    );
  }

  mainContent(responseSet) {
    return (
      <div className="col-md-9 nopadding maincontent">
        {this.props.currentUser && this.props.currentUser.id &&
          <div className="action_bar no-print">
            {responseSet.mostRecent == responseSet.version && <a className="btn btn-default" href={`/landing#/responseSets/${responseSet.id}/revise`}>Revise</a>}
            <a className="btn btn-default" href={`/landing#/responseSets/${responseSet.id}/extend`}>Extend</a>
          </div>
        }
        <div className="maincontent-details">
          <h3 className="maincontent-item-name"><strong>Name:</strong> {responseSet.name} </h3>
          <p className="maincontent-item-info">Version: {responseSet.version} - Author: {responseSet.createdBy && responseSet.createdBy.email} </p>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Details</h3>
            </div>
            <div className="box-content">
              <strong>Description: </strong>
              {responseSet.description}
            </div>
            <div className="box-content">
              <strong>Created: </strong>
              { moment(responseSet.createdAt,'').format('MMMM Do YYYY, h:mm:ss a') }
            </div>
            { responseSet.parent &&
              <div className="box-content">
                <strong>Extended from: </strong>
                <Link to={`/responseSets/${responseSet.parent.id}`}>{ responseSet.parent.name }</Link>
              </div>
            }
            <div className="box-content">
              <strong>OID: </strong>
              {responseSet.oid}
            </div>
          </div>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Responses</h3>
            </div>
            <div className="box-content">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Response Code</th>
                    <th>Code System</th>
                    <th>Display Name</th>
                  </tr>
                </thead>
                <tbody>
                  { responseSet.responses && responseSet.responses.map((response) => {
                    return (
                      <tr key={"response_" + response.id}>
                        <td>{ response.value }</td>
                        <td>{ response.codeSystem }</td>
                        <td>{ response.displayName }</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {this.props.questions && this.props.questions.length > 0 &&
            <div className="basic-c-box panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Linked Questions</h3>
              </div>
              <div className="box-content">
                <QuestionList questions={_.keyBy(this.props.questions, 'id')} routes={Routes} />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

ResponseSetDetails.propTypes = {
  responseSet: responseSetProps,
  currentUser: currentUserProps,
  questions: PropTypes.arrayOf(questionProps)
};
