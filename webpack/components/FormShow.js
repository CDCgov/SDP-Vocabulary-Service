import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashHistory, Link } from 'react-router';
import Pagination from 'rc-pagination';

import FormQuestionList from './FormQuestionList';
import Routes from '../routes';
import VersionInfo from './VersionInfo';
import PublisherLookUp from "./shared_show/PublisherLookUp";

import { formProps } from '../prop-types/form_props';
import currentUserProps from '../prop-types/current_user_props';
import { publishersProps } from "../prop-types/publisher_props";
import { isEditable, isRevisable, isPublishable, isExtendable } from '../utilities/componentHelpers';

const PAGE_SIZE = 10;

class FormShow extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 1};
    this.questionsForPage = this.questionsForPage.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

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
            <li className="showpage_title"><h1>Form Details {form.status === 'draft' && <text>[DRAFT]</text>}</h1></li>
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
        <h2 className="showpage_sidenav_subtitle">
          <text className="sr-only">Version History Navigation Links</text>
          <ul className="list-inline">
            <li className="subtitle_icon"><span className="fa fa-history" aria-hidden="true"></span></li>
            <li className="subtitle">History</li>
          </ul>
        </h2>
        <VersionInfo versionable={form} versionableType='form' />
      </div>
    );
  }

  pageChange(nextPage) {
    this.setState({page: nextPage});
  }

  questionsForPage() {
    const startIndex = (this.state.page - 1) * PAGE_SIZE;
    const endIndex = this.state.page * PAGE_SIZE;
    return this.props.form.formQuestions.slice(startIndex, endIndex);
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
              if(confirm('Are you sure you want to delete this Form? This action cannot be undone.')){
                this.props.deleteForm(form.id, (response) => {
                  if (response.status == 200) {
                    let stats = Object.assign({}, this.props.stats);
                    stats.formCount = this.props.stats.formCount - 1;
                    stats.myFormCount = this.props.stats.myFormCount - 1;
                    this.props.setStats(stats);
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
              <h2 className="panel-title">Description</h2>
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
              <Link to={`/forms/${form.parent.id}`}>{ form.parent.name && form.parent.name }</Link>
            </div>
            }
          </div>
          {this.props.form.formQuestions && this.props.form.formQuestions.length > 0 &&
            <div>
              <FormQuestionList questions={this.questionsForPage()} />
              {this.props.form.formQuestions.length > 10 &&
              <Pagination onChange={this.pageChange} current={this.state.page} total={this.props.form.formQuestions.length} />
              }
            </div>
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
  setStats: PropTypes.func,
  stats: PropTypes.object,
  publishers: publishersProps
};

export default FormShow;
