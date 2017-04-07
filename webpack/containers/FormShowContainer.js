import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, publishForm, deleteForm } from '../actions/form_actions';
import { fetchQuestions } from '../actions/questions_actions';
import { fetchResponseSets } from '../actions/response_set_actions';
import FormShow from '../components/FormShow';
import { formProps } from '../prop-types/form_props';
import CommentList from '../containers/CommentList';
import currentUserProps from '../prop-types/current_user_props';

class FormShowContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.formId);
    this.props.fetchQuestions();
    this.props.fetchResponseSets();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.formId != this.props.params.formId){
      this.props.fetchForm(this.props.params.formId);
      this.props.fetchQuestions();
      this.props.fetchResponseSets();
    }
  }

  render() {
    if(!this.props.form){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <FormShow form={this.props.form}
                      formQuestions={this.props.formQuestions}
                      formResponseSets={this.props.formResponseSets}
                      router={this.props.router}
                      currentUser={this.props.currentUser}
                      publishForm={this.props.publishForm}
                      deleteForm ={this.props.deleteForm} />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
            <CommentList commentableType='Form' commentableId={this.props.form.id} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.currentUser = state.currentUser;
  props.form = state.forms[ownProps.params.formId];
  if (props.form && props.form.formQuestions && props.form.formQuestions.length > 0) {
    props.formQuestions = props.form.formQuestions.map((fq) => state.questions[fq.questionId]);
    props.formResponseSets = props.form.formQuestions.map((fq) => {
      let rs;
      if (fq.responseSetId) {
        if(state.responseSets[fq.responseSetId]) {
          rs = state.responseSets[fq.responseSetId];
        } else {
          rs = {name: 'Loading...'};
        }
      } else {
        rs = {name: 'None'};
      }
      return rs;
    });
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchForm, fetchQuestions, fetchResponseSets, publishForm, deleteForm}, dispatch);
}

FormShowContainer.propTypes = {
  form: formProps,
  params: PropTypes.object,
  router: PropTypes.object.isRequired,
  currentUser: currentUserProps,
  fetchForm:  PropTypes.func,
  fetchQuestions:  PropTypes.func,
  fetchResponseSets: PropTypes.func,
  formQuestions: PropTypes.array,
  formResponseSets: PropTypes.array,
  deleteForm: PropTypes.func,
  publishForm: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(FormShowContainer);
