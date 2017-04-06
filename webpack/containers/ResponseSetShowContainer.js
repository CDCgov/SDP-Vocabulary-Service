import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSet, publishResponseSet, deleteResponseSet, fetchResponseSetUsage } from '../actions/response_set_actions';
import ResponseSetDetails from '../components/ResponseSetDetails';
import { responseSetProps } from '../prop-types/response_set_props';
import { questionProps } from '../prop-types/question_props';
import CommentList from '../containers/CommentList';
import currentUserProps from "../prop-types/current_user_props";
import _ from 'lodash';

class ResponseSetShowContainer extends Component {
  componentWillMount() {
    this.props.fetchResponseSet(this.props.params.rsId);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.rsId != this.props.params.rsId){
      this.props.fetchResponseSet(this.props.params.rsId);
    } else {
      if (this.props.responseSet && this.props.responseSet.status === 'published' &&
          this.props.responseSet.surveillancePrograms === undefined) {
        this.props.fetchResponseSetUsage(this.props.params.rsId);
      }
    }
  }

  render() {
    if(this.props.responseSet === undefined || this.props.responseSet.name === undefined){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <ResponseSetDetails responseSet={this.props.responseSet}
                                currentUser={this.props.currentUser}
                                publishResponseSet={this.props.publishResponseSet}
                                questions={this.props.questions}
                                deleteResponseSet={this.props.deleteResponseSet}
                                router={this.props.router} />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
            <CommentList commentableType='ResponseSet' commentableId={this.props.responseSet.id} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.currentUser = state.currentUser;
  props.responseSet = state.responseSets[ownProps.params.rsId];
  if (props.responseSet && props.responseSet.questions) {
    props.questions = _.compact(props.responseSet.questions.map((qId) => state.questions[qId]));
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSet, publishResponseSet, deleteResponseSet, fetchResponseSetUsage}, dispatch);
}

ResponseSetShowContainer.propTypes = {
  responseSet: responseSetProps,
  currentUser: currentUserProps,
  questions: PropTypes.arrayOf(questionProps),
  fetchResponseSet: PropTypes.func,
  publishResponseSet: PropTypes.func,
  fetchResponseSetUsage: PropTypes.func,
  deleteResponseSet:  PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetShowContainer);
