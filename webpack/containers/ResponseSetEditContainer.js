import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSet, saveResponseSet } from '../actions/response_set_actions';
import ResponseSetForm from '../components/ResponseSetForm';
import { responseSetProps } from '../prop-types/response_set_props';

class ResponseSetEditContainer extends Component {
  componentWillMount() {
    if (this.props.params.rsId) {
      this.props.fetchResponseSet(this.props.params.rsId);
    }
  }

  render() {
    if(!this.props.responseSet){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <ResponseSetForm responseSet={this.props.responseSet}
                         responseSetSubmitter={saveResponseSet}
                         action={this.props.params.action}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  if (ownProps.params.rsId) {
    props.responseSet = state.responseSets[ownProps.params.rsId];
  } else {
    props.responseSet = {version: 1};
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSet, saveResponseSet}, dispatch);
}

ResponseSetEditContainer.propTypes = {
  responseSet: responseSetProps,
  fetchResponseSet: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetEditContainer);
