import React, { Component, PropTypes } from 'react';
import { hashHistory, Link } from 'react-router';

import FormQuestionList from './FormQuestionList';
import Routes from '../routes';
import VersionInfo from './VersionInfo';
import PublisherLookUp from "./shared_show/PublisherLookUp";

import { formProps } from '../prop-types/form_props';
import currentUserProps from '../prop-types/current_user_props';
import { publishersProps } from "../prop-types/publisher_props";
import { isEditable, isRevisable, isPublishable, isExtendable } from '../utilities/componentHelpers';

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
            <li className="showpage_title">Form Details {form.status === 'draft' && <text>[DRAFT]</text>}</li>
          </ul>
        </div>
        {this.historyBar(form)}
        {this.mainContent(form)}
      </div>
    );
  }

  historyBar(form){
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
          {isEditable(form, this.props.currentUser) &&
            <PublisherLookUp publishers={this.props.publishers}
                           itemType="Form" />
          }
          {isPublishable(form, this.props.currentUser) &&
              <a className="btn btn-default" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.publishForm(form.id);
                return false;
              }}>Publish</a>
          }
          {isRevisable(form, this.props.currentUser) &&
            <Link className="btn btn-default" to={`forms/${form.id}/revise`}>Revise</Link>
          }
          {isEditable(form, this.props.currentUser) &&
            <Link className="btn btn-default" to={`forms/${form.id}/edit`}>Edit</Link>
          }
          {isEditable(form, this.props.currentUser) &&
            <a className="btn btn-default" href="#" onClick={(e) => {
              e.preventDefault();
              if(confirm('Are you sure you want to delete this Form?')){
                this.props.deleteForm(form.id, (response) => {
                  if (response.status == 200) {
                    this.props.router.push('/');
                  }
                });
              }
              return false;
            }}>Delete</a>
          }
          {isExtendable(form, this.props.currentUser) &&
            <Link className="btn btn-default" to={`/forms/${form.id}/extend`}>Extend</Link>
          }
          <button className="btn btn-default" onClick={() => window.print()}>Print</button>
          {this.props.currentUser && this.props.currentUser.id &&
            <a className="btn btn-default" href={Routes.redcapFormPath(form)}>Export to Redcap</a>
          }
        </div>
        <div className="maincontent-details">
          <h1 className="maincontent-item-name"><strong>Name:</strong> {form.name} </h1>
          <p className="maincontent-item-info">Version: {form.version} - Author: {form.userId} </p>
          <div className="basic-c-box panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">Description</h1>
            </div>
            <div className="box-content">
              {form.description}
            </div>
            { form.status === 'published' && form.publishedBy && form.publishedBy.email &&
            <div className="box-content">
              <strong>Published By: </strong>
              {form.publishedBy.email}
            </div>
            }
            { form.parent &&
            <div className="box-content">
              <strong>Extended from: </strong>
              <Link to={`/forms/${form.parent.id}`}>{ form.parent.name }</Link>
            </div>
            }
          </div>
          {this.props.form.formQuestions && this.props.form.formQuestions.length > 0 &&
            <FormQuestionList questions={this.props.form.formQuestions} />
          }
        </div>
      </div>
    );
  }
}

FormShow.propTypes = {
  form: formProps,
  router: PropTypes.object,
  currentUser: currentUserProps,
  publishForm: PropTypes.func,
  deleteForm:  PropTypes.func.isRequired,
  publishers: publishersProps
};

export default FormShow;
