import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Routes from "../routes";
import moment from 'moment';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import VersionInfo from './VersionInfo';

export default class ResponseSetDetails extends Component {
  render() {
    const {responseSet} = this.props;
    if(!responseSet){
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div className="panel">
        <p>
          <strong>Name: </strong>
          { responseSet.name }
        </p>
        <p>
          <strong>Description:</strong><br/>
          { responseSet.description }
        </p>
        <p>
          <strong>Responses:</strong><br/>
        </p>
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
        </table><br/>
        <p>
          <strong>Questions:</strong><br/>
        </p>
        { this.props.questions && this.props.questions.map((q) => {
          return (
            <div key={"rs_question_" + q.id}>
              <a href={Routes.questionPath(q.id)}>{q.content}</a><br/>
            </div>
          );
        })}
        <br/>
        <p>
          <strong>Oid: </strong>
          { responseSet.oid }
        </p>
        <p>
          <strong>Author: </strong>
          { responseSet.createdBy && responseSet.createdBy.email }
        </p>
        { responseSet.parent &&
          <p>
            <strong>Extended from: </strong>
            <Link to={`/responseSets/${responseSet.parent.id}`}>{ responseSet.parent.name }</Link>
          </p>
        }
        <p>
          <strong>Created: </strong>
          { moment(responseSet.createdAt,'').format('MMMM Do YYYY, h:mm:ss a') }
        </p>
        <p>
          <strong>Updated: </strong>
          { responseSet.updated_by && responseSet.updated_by.email }
          { moment(responseSet.updatedAt,'').format('MMMM Do YYYY, h:mm:ss a') }
        </p>
        <VersionInfo versionable={responseSet} versionableType='ResponseSet' />
        <Link to={`/responseSets/${this.props.responseSet.id}/revise`}>
          Revise
        </Link> |
        <Link to={`/responseSets/${this.props.responseSet.id}/extend`}>
          Extend
        </Link>
      </div>
    );
  }
}

ResponseSetDetails.propTypes = {
  responseSet: responseSetProps,
  questions: PropTypes.arrayOf(questionProps)
};
