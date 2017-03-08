import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { questionProps }  from "../prop-types/question_props";
import { deleteQuestion } from "../actions/questions_actions";
import currentUserProps from "../prop-types/current_user_props";

class QuestionWidget extends Component {
  constructor(props){
    super(props);
    this.deleteQuestionClick = this.deleteQuestionClick.bind(this);
  }

  deleteQuestionClick(){
    if(confirm('Are you sure?')){
      this.props.deleteQuestion(this.props.question.id, document.head.querySelector("[name=csrf-token]").content);
    }
  }

  dropdownMenu(){
    if(this.props.currentUser && this.props.currentUser.id){
      return (
        <ul className="dropdown-menu dropdown-menu-right">
          {this.props.question.status && this.props.question.status === 'published' && <li>
            <Link to={`/questions/${this.props.question.id}/revise`}>Revise</Link>
          </li>}
          {this.props.question.status && this.props.question.status === 'draft' && <li>
            <Link to={`/questions/${this.props.question.id}/edit`}>Edit</Link>
          </li>}
          <li>
            <Link to={`/questions/${this.props.question.id}`}>Details</Link>
          </li>
        </ul>
      );
    }else{
      return (
        <ul className="dropdown-menu dropdown-menu-right">
          <li>
            <Link to={`/questions/${this.props.question.id}`}>Details</Link>
          </li>
        </ul>
      );
    }
  }

  render() {
    return (
      <div className="question-group" id={`question_id_${this.props.question.id}`}>
        <div className="panel panel-default">
          <div className="question-container">
            <ul className="list-inline">
              <li><Link to={`/questions/${this.props.question.id}`}>{this.props.question.content}</Link></li>
              <li className="pull-right">
                <a>
                  <span className="fa fa-signal"></span>
                </a>
              </li>
            </ul>
          </div>
          <div className="response-set-details">
            <ul className="list-inline">
              <li className="reponse-number panel-toggle" data-toggle="collapse" href={`#collapse${this.props.question.id}`}>
                <span className="fa fa-list-ul"></span>
              </li>
              <li className="pull-right question-menu">
                <div className="dropdown">
                  <a id={`question_${this.props.question.id}_menu`} className="dropdown-toggle" type="" data-toggle="dropdown">
                    <span className="fa fa-ellipsis-h"></span>
                  </a>
                  {this.dropdownMenu()}
                </div>
              </li>
            </ul>
          </div>
          <div className="panel-collapse panel-details collapse" id={`collapse${this.props.question.id}`}>
            <div className="panel-body">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({deleteQuestion}, dispatch);
}

QuestionWidget.propTypes = {
  question: questionProps,
  currentUser: currentUserProps,
  deleteQuestion: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionWidget);
