import React, { Component, PropTypes } from 'react';
import Routes  from '../routes';
import FormList from '../components/FormList';
import QuestionList from '../components/QuestionList';
import ResponseSetList  from '../components/ResponseSetList';
import { formsProps } from "../prop-types/form_props";
import { questionsProps } from "../prop-types/question_props";
import { responseSetsProps } from "../prop-types/response_set_props";
import currentUserProps from "../prop-types/current_user_props";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchMyForms } from '../actions/form_actions';
import { fetchMyQuestions } from '../actions/questions_actions';
import { fetchMyResponseSets } from '../actions/response_set_actions';
import _ from 'lodash';


class MyStuffContainer extends Component {
  componentWillMount() {
    this.props.fetchMyForms();
    this.props.fetchMyQuestions();
    this.props.fetchMyResponseSets();
  }

  render() {
    if(!this.props.forms || !this.props.questions || !this.props.responseSets ){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className='container my-stuff'>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">My Questions</h3>
                </div>
                <div className="panel-body">
                  {_.keys(this.props.questions).length > 0 ? (<QuestionList questions={this.props.questions} routes={Routes} />) : ('No Questions Found')}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">My Response Sets</h3>
                </div>
                <div className="panel-body">
                  {_.keys(this.props.responseSets).length > 0 ? <ResponseSetList responseSets={this.props.responseSets} routes={Routes} /> : 'No Response Sets Found'}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">My Forms</h3>
                </div>
                <div className="panel-body">
                  {_.keys(this.props.forms).length > 0 ? <FormList forms={this.props.forms}  routes={Routes} /> : 'No Forms Found'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchMyForms, fetchMyQuestions, fetchMyResponseSets}, dispatch);
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    forms: filterForUser(state.currentUser, state.forms),
    questions: filterForUser(state.currentUser, state.questions),
    responseSets: filterForUser(state.currentUser, state.responseSets)
  };
}

function filterForUser(user, items){
  return  _.pickBy(items, (i)=>{
    return (i.createdById === user.id || (i.createdBy && i.createdBy.id === user.id));
  });
}

MyStuffContainer.propTypes = {
  currentUser:  currentUserProps,
  forms: formsProps,
  questions: questionsProps,
  responseSets: responseSetsProps,
  fetchMyForms: PropTypes.func,
  fetchMyQuestions:  PropTypes.func,
  fetchMyResponseSets: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(MyStuffContainer);