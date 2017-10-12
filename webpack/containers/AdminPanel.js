import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import values from 'lodash/values';
import { setSteps } from '../actions/tutorial_actions';
import { revokeAdmin, grantAdmin } from '../actions/admin_actions';
import { addProgram } from '../actions/surveillance_program_actions';
import { addSystem } from '../actions/surveillance_system_actions';
import { revokePublisher, grantPublisher } from '../actions/publisher_actions';
import currentUserProps from '../prop-types/current_user_props';

class AdminPanel extends Component {
  constructor(props){
    super(props);
    this.selectTab = this.selectTab.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit  = this.onFormSubmit.bind(this);
    this.state = {
      selectedTab: 'admin-list',
      searchEmail: '',
      name: '',
      description: '',
      acronym: ''
    };
  }

  selectTab(tabName) {
    this.setState({
      selectedTab: tabName,
      error: {}
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

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      newState['error'] = {};
      this.setState(newState);
    };
  }

  onFormSubmit(event) {
    event.preventDefault();
    switch (this.state.selectedTab) {
      case 'admin-list':
        this.props.grantAdmin(this.state.searchEmail, null, (failureResponse) => {
          this.setState({error: failureResponse.response.data});
        });
        break;
      case 'publisher-list':
        this.props.grantPublisher(this.state.searchEmail, null, (failureResponse) => {
          this.setState({error: failureResponse.response.data});
        });
        break;
      case 'program-list':
        this.props.addProgram(this.state.name, this.state.description, this.state.acronym, null, (failureResponse) => {
          this.setState({error: failureResponse.response.data});
        });
        break;
      default:
        this.props.addSystem(this.state.name, this.state.description, this.state.acronym, null, (failureResponse) => {
          this.setState({error: failureResponse.response.data});
        });
        break;
    }
  }

  emailInput() {
    return(
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            {this.state.error && this.state.error.msg &&
              <div className="alert alert-danger">
                {this.state.error.msg}
              </div>
            }
            <div className="input-group search-group">
              <input onChange={this.handleChange('searchEmail')} value={this.state.searchEmail} type="text" id="email-input" name="email" aria-label="Enter email of user to grant permissions" className="search-input" placeholder="Enter email of user to add to list.. (Format: example@gmail.com)"/>
              <span className="input-group-btn">
                <button id="submit-email" className="search-btn search-btn-default" aria-label="Click to submit user email and grant permissions" type="submit"><i className="fa fa-plus search-btn-icon" aria-hidden="true"></i></button>
              </span>
            </div><br/>
          </div>
        </div>
      </form>
    );
  }

  progSysForm(type) {
    return(
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            {this.state.error && this.state.error.msg &&
              <div className="alert alert-danger">
                {this.state.error.msg}
              </div>
            }
            <div className="input-group search-group">
              <div className="col-md-6 question-form-group">
                <label className="input-label" htmlFor={`${type}-name`}>Name</label>
                <input className="input-format" type="text" value={this.state.name} name={`${type}-name`} id={`${type}-name`} aria-label={`Enter name for new ${type}`} placeholder={`Enter name of new ${type}...`} onChange={this.handleChange('name')}/>
              </div>
              <div className="col-md-6 question-form-group">
                <label className="input-label" htmlFor={`${type}-description`}>Description (Optional)</label>
                <input className="input-format" type="text" value={this.state.description} name={`${type}-description`} id={`${type}-description`} aria-label={`Enter a description for new ${type}`} placeholder={`Description...`} onChange={this.handleChange('description')}/>
              </div>
              <div className="col-md-3 question-form-group">
                <label className="input-label" htmlFor={`${type}-acronym`}>Acronym (Optional)</label>
                <input className="input-format" type="text" value={this.state.acronym} name={`${type}-acronym`} id={`${type}-acronym`} aria-label={`Enter acronym for new ${type}`} placeholder={`Ex: CDC`} onChange={this.handleChange('acronym')}/>
              </div>
            </div>
            <button id="submit-prog-sys" className="btn btn-default pull-right" aria-label={`Click to add new ${type} to list`} type="submit"><i className="fa fa-plus search-btn-icon" aria-hidden="true"><text className="sr-only">Click button to add new item to list</text></i> {`Add new ${type}`}</button>
          </div><br/>
        </div>
      </form>
    );
  }

  adminTab() {
    var adminList = values(this.props.adminList);
    return(
      <div className="tab-pane active step-focus" id="admin-list" role="tabpanel" aria-hidden={this.state.selectedTab !== 'admin-list'} aria-labelledby="admin-list-tab">
        <h2 id="admin-list">Admin List</h2>
        {this.emailInput()}
        {adminList.map((admin) => {
          return (
          <p key={admin.id} className="admin-group"><strong>{admin.name}</strong> ({admin.email}) {admin.email !== this.props.currentUser.email && <button id={`remove_${admin.email}`} className="btn btn-default pull-right" onClick={() => {
            this.props.revokeAdmin(admin.id, null, (failureResponse) => {
              this.setState({error: failureResponse.response.data});
            });
          }}><i className="fa fa-trash search-btn-icon" aria-hidden="true"></i> Remove<text className="sr-only">{`- click to remove ${admin.name} from admin list`}</text></button>}
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
        {this.emailInput()}
        {publisherList.map((pub) => {
          return (<p key={pub.id} className="admin-group"><strong>{pub.name}</strong> ({pub.email}) {pub.email !== this.props.currentUser.email &&<button id={`remove_${pub.email}`} className="btn btn-default pull-right" onClick={() => {
            this.props.revokePublisher(pub.id, null, (failureResponse) => {
              this.setState({error: failureResponse.response.data});
            });
          }}><i className="fa fa-trash search-btn-icon" aria-hidden="true"></i> Remove<text className="sr-only">{`- click to remove ${pub.name} from publisher list`}</text></button>}
          </p>);
        })}
      </div>
    );
  }

  programTab() {
    var programList = values(this.props.programList);
    return(
      <div className="tab-pane" id="program-list" role="tabpanel" aria-hidden={this.state.selectedTab !== 'program-list'} aria-labelledby="program-list-tab">
        <h2 id="program-list">Program List</h2>
        {this.progSysForm('program')}
        {programList.map((prog) => {
          return (<p key={prog.id} className="admin-group"><strong>{prog.name}</strong><br/>{prog.description}</p>);
        })}
      </div>
    );
  }

  systemTab() {
    var systemList = values(this.props.systemList);
    return(
      <div className="tab-pane" id="system-list" role="tabpanel" aria-hidden={this.state.selectedTab !== 'system-list'} aria-labelledby="system-list-tab">
        <h2 id="system-list">System List</h2>
        {this.progSysForm('system')}
        {systemList.map((sys) => {
          return (<p key={sys.id} className="admin-group"><strong>{sys.name}</strong><br/>{sys.description}</p>);
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
                    <li id="program-list-tab" className="nav-item" role="tab" onClick={() => this.selectTab('program-list')} aria-selected={this.state.selectedTab === 'program-list'} aria-controls="program-list">
                      <a className="nav-link" data-toggle="tab" href="#program-list" role="tab">Program List</a>
                    </li>
                    <li id="system-list-tab" className="nav-item" role="tab" onClick={() => this.selectTab('system-list')} aria-selected={this.state.selectedTab === 'system-list'} aria-controls="system-list">
                      <a className="nav-link" data-toggle="tab" href="#system-list" role="tab">System List</a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {this.adminTab()}
                    {this.publisherTab()}
                    {this.programTab()}
                    {this.systemTab()}
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
  props.programList = state.surveillancePrograms;
  props.systemList = state.surveillanceSystems;
  props.currentUser = state.currentUser;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, addProgram, addSystem, revokeAdmin, revokePublisher, grantPublisher, grantAdmin}, dispatch);
}

AdminPanel.propTypes = {
  adminList: PropTypes.object,
  publisherList: PropTypes.object,
  programList: PropTypes.object,
  systemList: PropTypes.object,
  currentUser: currentUserProps,
  setSteps: PropTypes.func,
  addProgram: PropTypes.func,
  addSystem: PropTypes.func,
  revokeAdmin: PropTypes.func,
  revokePublisher: PropTypes.func,
  grantAdmin: PropTypes.func,
  grantPublisher: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
