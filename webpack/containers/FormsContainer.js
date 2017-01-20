import React, { Component, PropTypes } from 'react';
import FormList from '../components/FormList';
import Routes from '../routes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForms } from '../actions/form_actions';

class FormsContainer extends Component {
  componentWillMount() {
    this.props.fetchForms();
  }
  render() {
    if(this.props.forms.loading == true){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div>
        <FormList forms={this.props.forms} routes={Routes} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchForms}, dispatch);
}
function mapStateToProps(state) {
  return {
    forms: state.forms
  };
}
FormsContainer.propTypes = {
  forms: FormList.propTypes.forms,
  fetchForms: PropTypes.func
};
export default connect(mapStateToProps, mapDispatchToProps)(FormsContainer);
