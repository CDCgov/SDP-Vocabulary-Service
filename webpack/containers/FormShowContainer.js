import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm } from '../actions/form_actions';
import FormShow from '../components/FormShow';
import { formProps } from '../prop-types/form_props';

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
            <FormShow form={this.props.form} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.form = state.forms[ownProps.params.formId];
  if (props.form) {
    props.questions = props.form.questions.map((qId) => state.questions[qId]);
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchForm}, dispatch);
}

FormShowContainer.propTypes = {
  form: formProps,
  fetchForm: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(FormShowContainer);
