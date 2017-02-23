import React, { Component } from 'react';
import {formProps} from '../prop-types/form_props';
import QuestionList from './QuestionList';
import Routes from '../routes';
import _ from 'lodash';
import VersionInfo from './VersionInfo';
import { hashHistory } from 'react-router';
import currentUserProps from '../prop-types/current_user_props';

class FormShow extends Component {
  render() {
    const {form} = this.props;
    if(!form){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div id={"form_id_"+form.id}>
        <div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-arrow-left fa-2x" aria-hidden="true" onClick={hashHistory.goBack}></span></li>
            <li className="showpage_title">Form Details</li>
          </ul>
        </div>
        {this.historyBar(form)}
        {this.mainContent(form)}
      </div>
    );
  }

  historyBar(form) {
    return (
      <div className="col-md-3 nopadding no-print">
        <div className="showpage_sidenav_subtitle">
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </div>
        <VersionInfo versionable={form} versionableType='form' />
      </div>
    );
  }

  mainContent(form) {
    return (
      <div className="col-md-9 nopadding maincontent">
        <div className="action_bar no-print">
          {this.props.currentUser && this.props.currentUser.id &&
              <a className="btn btn-default" href={`/landing#/forms/${form.id}/revise`}>Revise</a>
          }
          <button className="btn btn-default" onClick={() => window.print()}>Print</button>
          {this.props.currentUser && this.props.currentUser.id && <a className="btn btn-default" href={Routes.redcapFormPath(form)}>Export to Redcap</a>}
        </div>
        <div className="maincontent-details">
          <h3 className="maincontent-item-name"><strong>Name:</strong> {form.name} </h3>
          <p className="maincontent-item-info">Version: {form.version} - Author: {form.userId} </p>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Description</h3>
            </div>
            <div className="box-content">
              {form.description}
            </div>
          </div>
          <QuestionList questions={_.keyBy(form.questions, 'id')} routes={Routes} />
        </div>
      </div>
    );
  }
}

FormShow.propTypes = {
  currentUser: currentUserProps,
  form: formProps
};

export default FormShow;
