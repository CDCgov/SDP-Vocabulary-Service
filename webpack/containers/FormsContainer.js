import React, { Component } from 'react';
import FormList from '../components/FormList';
import Routes from '../routes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForms } from '../actions/form_actions';

class FormsContainer extends Component {
  render() {
    this.dummy_data = [{"id":1,"name":"Bloop","createdById":1,"createdAt":"2016-12-27T23:40:54.505Z","updatedAt":"2016-12-27T23:40:54.505Z","versionIndependentId":"F-1","version":1,"controlNumber":"","oid":null,"questions":[],"createdBy":{"id":1,"email":"testAuthor@gmail.com","createdAt":"2016-12-27T23:40:07.817Z","updatedAt":"2017-01-18T16:53:18.388Z","provider":null,"uid":null,"admin":false,"firstName":null,"lastName":null}}];
    return (
      <div>
        <FormList forms={this.dummy_data} routes={Routes} />
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
export default connect(mapStateToProps, mapDispatchToProps)(FormsContainer);
