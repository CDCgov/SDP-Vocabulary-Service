import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, publishForm } from '../actions/form_actions';
import FormShow from '../components/FormShow';
import { formProps } from '../prop-types/form_props';
import CommentList from '../containers/CommentList';
import currentUserProps from '../prop-types/current_user_props';

class FormShowContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.formId);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.formId != this.props.params.formId){
      this.props.fetchForm(this.props.params.formId);
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
            <FormShow currentUser={this.props.currentUser} form={this.props.form}
                      publishForm={this.props.publishForm} />
            <div className="col-md-12 showpage-comments-title">Comments:</div>
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
  if (props.form) {
    props.questions = props.form.questions.map((qId) => state.questions[qId]);
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchForm, publishForm}, dispatch);
}

FormShowContainer.propTypes = {
  form: formProps,
  currentUser: currentUserProps,
  fetchForm: PropTypes.func,
  publishForm: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(FormShowContainer);
