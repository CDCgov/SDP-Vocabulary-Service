import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { fetchPublicInfo } from "../actions/error_actions";

class NotFoundAlert extends Component {
  componentWillMount() {
    this.props.fetchPublicInfo(this.props.id,this.props.type);
  }

  render() {
    if(!this.props.item) {
      return (
        <div className={`alert alert-${severity}`}>
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {msg}
        </div>
      );
    } else {
      return (
        <div className={`alert alert-${severity}`}>
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {msg}<br/>
          {this.props.type} #{this.props.id} <br/>
          {this.props.item.name && <a>Name: Demo</a>}
          <br/><br/>
          {this.props.item.author ? (
            <p>If you are interested in learning more or collaborating on this content contact the owner, {this.props.item.author.name} <a href="mailto:surveillanceplatform@cdc.gov">({this.props.item.author.email})</a> to request the content be added to a collaborative authoring group.</p>
          ) : (
            <p>If you are interested in learning more or collaborating on this content please contact <a href="mailto:surveillanceplatform@cdc.gov">surveillanceplatform@cdc.gov</a> to request author access to the vocabulary service.</p>
          )}
        </div>
      );
    }
  };
}

function mapStateToProps(state) {
  return {
    item: state.publicInfo
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchPublicInfo }, dispatch);
}

NotFoundAlert.propTypes = {
  msg: PropTypes.string,
  severity: PropTypes.string,
  item: PropTypes.object,
  fetchPublicInfo: PropTypes.func,
  id: PropTypes.number,
  type: PropTypes.string
};

export default connect(mapStateToProps,mapDispatchToProps)(NotFoundAlert);
