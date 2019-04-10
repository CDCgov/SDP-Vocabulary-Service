import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { fetchPublicInfo } from "../actions/error_actions";
import strictUriEncode from 'strict-uri-encode';

class NotFoundAlert extends Component {
  componentWillMount() {
    this.props.fetchPublicInfo(this.props.id, this.props.type);
  }

  render() {
    if(!this.props.item) {
      return (
        <div className={`alert alert-${this.props.severity}`}>
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {this.props.msg}
        </div>
      );
    } else {
      return (
        <div className={`alert alert-${this.props.severity}`}>
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {this.props.msg}<br/>
          {this.props.type} #{this.props.id} <br/>
          {this.props.item.name && <a href={`/#/${this.props.type}s/${this.props.id}`}>Name: {this.props.item.name}</a>}
          <br/><br/>
          {this.props.item.author ? (
            <p>If you are interested in learning more or collaborating on this content contact the owner, {this.props.item.author.name} <a href={`mailto:${this.props.item.author.email}?subject=${strictUriEncode("Collaboration Request")}&body=${strictUriEncode(`I would like to request access to collaborate on the following ${this.props.type}: ${window.location.href}`)}`}>({this.props.item.author.email})</a> to request the content be added to a collaborative authoring group.</p>
          ) : (
            <p>If you are interested in learning more or collaborating on this content please contact <a href="mailto:surveillanceplatform@cdc.gov">surveillanceplatform@cdc.gov</a> to request author access to the vocabulary service.</p>
          )}
        </div>
      );
    }
  }
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
