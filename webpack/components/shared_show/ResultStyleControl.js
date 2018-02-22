import React, {Component } from 'react';
import { setResultStyle } from '../../actions/display_style_actions';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ResultStyleControl extends Component {
  render() {
    return (
      <div className={this.props.resultControlVisibility == 'visible' ? 'result-style-control visible' : 'result-style-control'}>
        <button id='set_condensed_btn' onClick={() => this.props.setResultStyle('condensed')} className={this.props.resultStyle == 'condensed' ? "btn btn-info" : "btn btn-default"}>
          <text className="sr-only">Switch to condensed item view</text><i className="fa fa-list-ul" aria-hidden="true"></i>
        </button>
        <button id='set_expanded_btn' className={this.props.resultStyle == 'expanded' ? "btn btn-info" : "btn btn-default"} onClick={() => this.props.setResultStyle('expanded')}>
          <text className="sr-only">Switch to expanded item view</text><i className="fa fa-th-list" aria-hidden="true"></i>
        </button>
      </div>
    );
  }
}

ResultStyleControl.propTypes = {
  resultControlVisibility: PropTypes.string,
  resultStyle: PropTypes.string,
  setResultStyle: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setResultStyle }, dispatch);
}

export default connect(null, mapDispatchToProps)(ResultStyleControl);
