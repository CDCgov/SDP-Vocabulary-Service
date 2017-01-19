import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSets } from '../actions/response_set_actions';
import ResponseSetList from '../components/ResponseSetList';
import Routes from '../routes';

class ResponseSetsContainer extends Component {
  componentWillMount() {
    this.props.fetchResponseSets();
  }
  render() {
    if(!this.props.responseSets){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div>
        <ResponseSetList responseSets={this.props.responseSets} routes={Routes} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    responseSets: state.responseSets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets}, dispatch);
}

ResponseSetsContainer.propTypes = {
  responseSets: PropTypes.array,
  fetchResponseSets: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetsContainer);
