import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSet } from '../actions/response_set_actions';
import ResponseSetDetails from '../components/ResponseSetDetails';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import _ from 'lodash';

class ResponseSetShowContainer extends Component {
  componentWillMount() {
    this.props.fetchResponseSet(this.props.params.rsId);
  }

  render() {
    if(!this.props.responseSet){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="basic-bg">
        <ResponseSetDetails responseSet={this.props.responseSet} questions={this.props.questions}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.responseSet = state.responseSets[ownProps.params.rsId];
  if (props.responseSet) {
    props.questions = _.compact(props.responseSet.questions.map((qId) => state.questions[qId]));
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSet}, dispatch);
}

ResponseSetShowContainer.propTypes = {
  responseSet: responseSetProps,
  questions: PropTypes.arrayOf(questionProps),
  fetchResponseSet: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetShowContainer);
