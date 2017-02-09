import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
    let action = this.props.params.action;
    if (action === undefined) {
      action = 'new';
    }
    return (
      <div className="container">
        <ResponseSetForm responseSet={this.props.responseSet}
                         responseSetSubmitter={this.props.saveResponseSet}
                         action={action}
                         route ={this.props.route}
                         router={this.props.router} />
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

ResponseSetEditContainer.propTypes = {
  responseSet: responseSetProps,
  fetchResponseSet: PropTypes.func,
  saveResponseSet: PropTypes.func,
  params: PropTypes.object,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {fetchResponseSet, saveResponseSet})(ResponseSetEditContainer);