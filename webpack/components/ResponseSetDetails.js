import React, { Component, PropTypes } from 'react';
import Routes from "../routes";
import moment from 'moment';

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
                  <td>{ response.code_system }</td>
                  <td>{ response.display_name }</td>
                </tr>
              );
            })}
          </tbody>
        </table><br/>
        <p>
          <strong>Questions:</strong><br/>
        </p>
        { responseSet.questions && responseSet.questions.map((q) => {
          return (
            <div key={"rs_question_" + q.id}>
              <a href={Routes.question_path(q.id)}>{q.content}</a><br/>
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
          { responseSet.created_by && responseSet.created_by.email }
        </p>
        <p>
          <strong>Created: </strong>
          { moment(responseSet.created_at,'').format('MMMM Do YYYY, h:mm:ss a') }
        </p>
        <p>
          <strong>Updated: </strong>
          { responseSet.updated_by && responseSet.updated_by.email }
          { moment(responseSet.updated_at,'').format('MMMM Do YYYY, h:mm:ss a') }
        </p>
      </div>
    );
  }
}

ResponseSetDetails.propTypes = {
  responseSet:  PropTypes.object
};
