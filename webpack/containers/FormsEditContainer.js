import React, { Component, PropTypes } from 'react';
import FormList from '../components/FormList';
import Routes from '../routes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm } from '../actions/form_actions';

class FormsContainer extends Component {
  componentWillMount() {
    this.props.fetchForm(this.props.params.id);
  }
  render() {
    if(this.props.forms.loading == true){
      return (
        <div>Loading...</div>
      );
    }
    return <div>{this.props.params.id}</div>
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchForm}, dispatch);
}
function mapStateToProps(state) {
  return {
    forms: state.forms
  };
}
FormsContainer.propTypes = {
  forms: FormList.propTypes.forms,
  fetchForm: PropTypes.func
};
export default connect(mapStateToProps, mapDispatchToProps)(FormsContainer);
