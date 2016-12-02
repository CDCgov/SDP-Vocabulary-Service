import React, { Component, PropTypes } from 'react';
import QuestionItem from './QuestionItem';

export default class QuestionList extends Component {
  render() {
    return (
      <div className="question-group">
        <div className="row">
          <div className="col-md-1"><b>ID</b></div>
            {(() => {
              if(this.props.btn_type == 'add') {
                return(
                  <div className="col-md-11"><b>Content</b></div>
                );
              } else if (this.props.btn_type == 'remove') {
                return(
                  <div>
                    <div className="col-md-5"><b>Content</b></div>
                    <div className="col-md-6"><b>Response Sets</b></div>
                  </div>
                );
              }
            })()}
        </div><br/>
        {this.props.questions.map((q, i) => {
          return (
            <div className="row" key={i}>
              <QuestionItem question={q} response_sets={this.props.response_sets} btn_type={this.props.btn_type}/>
            </div>
          );
        })}
      </div>
    );
  }
}
