import React, { Component, PropTypes } from 'react';
import FormList from '../components/FormList';
import FormListSearch from '../components/FormListSearch';
import Routes from '../routes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForms } from '../actions/form_actions';

class FormsIndexContainer extends Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    this.props.fetchForms();
  }

  search(searchTerms){
    this.props.fetchForms(searchTerms);
  }

  render() {
    if(this.props.forms.loading == true){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className='row basic-bg'>
      <div className='col-md-12'>
        <FormListSearch search={this.search} />
        <FormList forms={this.props.forms} routes={Routes} />
      </div>
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
FormsIndexContainer.propTypes = {
  forms: FormList.propTypes.forms,
  fetchForms: PropTypes.func
};
export default connect(mapStateToProps, mapDispatchToProps)(FormsIndexContainer);
