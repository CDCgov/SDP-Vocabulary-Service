import React, { Component } from 'react';
import QuestionItem from './QuestionItem';

export default class FormsQuestionList extends Component {
  render() {
    return (
      <div className="question-group">
        <div className="row">
          <div className="col-md-1"><b>ID</b></div>
            {(() => {
              if(this.props.btnType == 'add') {
                return(
                  <div className="col-md-11"><b>Content</b></div>
                );
              } else if (this.props.btnType == 'remove') {
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
              <QuestionItem question={q} responseSets={this.props.responseSets} btnType={this.props.btnType}/>
            </div>
          );
        })}
      </div>
    );
  }
}

FormsQuestionList.propTypes = {
  btnType: React.PropTypes.string,
  questions: React.PropTypes.array,
  responseSets: React.PropTypes.array
};
