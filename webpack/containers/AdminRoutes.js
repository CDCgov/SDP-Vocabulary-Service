import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class AdminRoutes extends Component {
  render() {
    if (this.props.isAdmin) {
      return this.props.children;
    } else {
      return (
        <div className="container">
          <div className="row basic-bg">
            <div className="col-md-12">
              <div className="showpage_header_container no-print">
                You are not authorized to see this content - this area is only for administrators.
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    isAdmin: state.currentUser.admin ? true : false,
  };
}

AdminRoutes.propTypes = {
  isAdmin: PropTypes.bool,
  children: PropTypes.object
};

export default connect(mapStateToProps)(AdminRoutes);
