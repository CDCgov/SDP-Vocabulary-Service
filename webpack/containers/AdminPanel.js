import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import values from 'lodash/values';
import { setSteps } from '../actions/tutorial_actions';
import { revokeAdmin } from '../actions/admin_actions';

class AdminPanel extends Component {
  constructor(props){
    super(props);
    this.selectTab = this.selectTab.bind(this);
    this.state = {
      selectedTab: 'admin-list'
    };
  }

  selectTab(tabName) {
    this.setState({
      selectedTab: tabName
    });
  }

  componentDidMount() {
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      },
      {
        title: 'Tabs',
        text: 'Select a tab to view various administrator functionality.',
        selector: '.step-focus',
        position: 'right',
      }]);
  }

  adminTab() {
    var adminList = values(this.props.adminList);
    return(
      <div className="tab-pane active step-focus" id="admin-list" role="tabpanel" aria-hidden={this.state.selectedTab !== 'admin-list'} aria-labelledby="admin-list-tab">
        <h2 id="admin-list">Admin List</h2>
        {adminList.map((admin) => {
          return (
          <p key={admin.id}>{admin.name} - {admin.email}<button className="btn btn-default" onClick={() => {
            this.props.revokeAdmin(admin.id);
          }}>Remove</button>
          </p>);
        })}
      </div>
    );
  }

  publisherTab() {
    var publisherList = values(this.props.publisherList);
    return(
      <div className="tab-pane" id="publisher-list" role="tabpanel" aria-hidden={this.state.selectedTab !== 'publisher-list'} aria-labelledby="publisher-list-tab">
        <h2 id="publisher-list">Publisher List</h2>
        {publisherList.map((pub) => {
          return (<p key={pub.id}>{pub.name} - {pub.email}</p>);
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <div className="showpage_header_container no-print">
              <ul className="list-inline">
                <li className="showpage_button"><span className="fa fa-cogs fa-2x" aria-hidden="true"></span></li>
                <li className="showpage_title"><h1>Admin Panel</h1></li>
              </ul>
            </div>
            <div className="container col-md-12">
              <div className="row">
                <div className="col-md-12 nopadding">
                  <ul className="nav nav-tabs" role="tablist">
                    <li id="admin-list-tab" className="nav-item active" role="tab" onClick={() => this.selectTab('admin-list')} aria-selected={this.state.selectedTab === 'admin-list'} aria-controls="admin-list">
                      <a className="nav-link" data-toggle="tab" href="#admin-list" role="tab">Admin List</a>
                    </li>
                    <li id="publisher-list-tab" className="nav-item" role="tab" onClick={() => this.selectTab('publisher-list')} aria-selected={this.state.selectedTab === 'publisher-list'} aria-controls="publisher-list">
                      <a className="nav-link" data-toggle="tab" href="#publisher-list" role="tab">Publisher List</a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {this.adminTab()}
                    {this.publisherTab()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const props = {};
  props.adminList = state.admins;
  props.publisherList = state.publishers;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, revokeAdmin}, dispatch);
}

AdminPanel.propTypes = {
  adminList: PropTypes.object,
  publisherList: PropTypes.object,
  setSteps: PropTypes.func,
  revokeAdmin: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
