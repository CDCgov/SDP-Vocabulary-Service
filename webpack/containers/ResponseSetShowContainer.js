import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSet } from '../actions/response_set_actions';
import ResponseSetDetails from '../components/ResponseSetDetails';

class ResponseSetShowContainer extends Component {
  componentWillMount() {
    this.props.fetchResponseSet(this.props.params.rsId);
  }

  render() {
    return (
      <div>
        <ResponseSetDetails responseSet={(this.props.responseSets)[this.props.params.rsId]} />
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
  return bindActionCreators({fetchResponseSet}, dispatch);
}

ResponseSetShowContainer.propTypes = {
  responseSets: PropTypes.object,
  fetchResponseSet: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetShowContainer);
