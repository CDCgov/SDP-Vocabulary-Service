import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { fetchResponseSet, saveResponseSet, saveDraftResponseSet } from '../../actions/response_set_actions';
import ResponseSetEdit from '../../components/response_sets/ResponseSetEdit';
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';

import { responseSetProps } from '../../prop-types/response_set_props';

class ResponseSetEditContainer extends Component {
  constructor(props) {
    super(props);
    let selectedResponseSetSaver = this.props.saveResponseSet;
    if (this.props.params.rsId) {
      this.props.fetchResponseSet(this.props.params.rsId, true);
      if (this.props.params.action === 'edit') {
        selectedResponseSetSaver = this.props.saveDraftResponseSet;
      }
    }
    this.state = {selectedResponseSetSaver};
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
        title: 'Response Set Details',
        text: 'Use the input fields to edit content of the response set.',
        selector: '.panel-title',
        position: 'right',
      },
      {
        title: 'Find Coded Responses',
        text: 'Click the search icon to search for and add coded responses to the response set.',
        selector: '.fa-search',
        position: 'right',
      },
      {
        title: 'Create Your Own Responses',
        text: 'Alternatively, you can manually add a response - click the plus sign to add additional responses to associate with the response set.',
        selector: '.fa-plus',
        position: 'top',
      },
      {
        title: 'Create Your Own Responses (Name)',
        text: 'The Display Name field is what the user will see on the page.',
        selector: '.display-name-column',
        position: 'top',
      },
      {
        title: 'Create Your Own Responses (Response / Code)',
        text: 'Optionally, you can enter a code and a code system for the response you are adding if it belongs to an external system (such as LOINC or SNOMED).',
        selector: '.code-system-column',
        position: 'top',
      },
      {
        title: 'Action Buttons',
        text: 'Click save to save a private draft of the edited content (this content will not be public until it is published).',
        selector: '.panel-footer',
        position: 'top',
      }]);
  }

  componentDidUpdate(prevProps) {
    if(this.props.params.rsId && (prevProps.params.rsId != this.props.params.rsId || prevProps.params.action != this.props.params.action)) {
      this.props.fetchResponseSet(this.props.params.rsId, true);
    }
  }

  render() {
    if(!this.props.responseSet || this.props.isLoading || this.props.loadStatus == 'failure'){
      return (
        <Grid className="basic-bg">
          <Row>
            <Col xs={12}>
              {this.props.isLoading && <LoadingSpinner msg="Loading response set..." />}
              {this.props.loadStatus == 'failure' &&
                <BasicAlert msg={this.props.loadStatusText} severity='danger' />
              }
              {this.props.loadStatus == 'success' &&
               <BasicAlert msg="Sorry, there is a problem loading this response set." severity='warning' />
              }
            </Col>
          </Row>
        </Grid>
      );
    }


    let action = this.props.params.action;
    if (action === undefined) {
      action = 'new';
    }
    return (
      <Grid>
        <ResponseSetEdit responseSet={this.props.responseSet}
                         responseSetSubmitter={this.state.selectedResponseSetSaver}
                         action={action}
                         stats={this.props.stats}
                         setStats={this.props.setStats}
                         route ={this.props.route}
                         router={this.props.router} />
      </Grid>
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
  props.stats = state.stats;
  props.isLoading = state.ajaxStatus.responseSet.isLoading;
  props.loadStatus = state.ajaxStatus.responseSet.loadStatus;
  props.loadStatusText = state.ajaxStatus.responseSet.loadStatusText;
  return props;
}

ResponseSetEditContainer.propTypes = {
  responseSet: responseSetProps,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  fetchResponseSet: PropTypes.func,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  saveResponseSet: PropTypes.func,
  saveDraftResponseSet: PropTypes.func,
  params: PropTypes.object,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {setSteps, setStats, fetchResponseSet, saveResponseSet, saveDraftResponseSet})(ResponseSetEditContainer);
