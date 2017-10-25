import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import NestedSearchBar from './NestedSearchBar';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';
import values from 'lodash/values';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import $ from 'jquery';

class DashboardSearch extends Component {
  constructor(props){
    super(props);
    this.state={
      searchTerms: '',
      progFilters: [],
      sysFilters: [],
      showAdvSearchModal: false,
      mostRecentFilter: false,
      surveillancePrograms: {},
      surveillanceSystems: {}
    };
    this.showAdvSearch = this.showAdvSearch.bind(this);
    this.hideAdvSearch = this.hideAdvSearch.bind(this);
    this.clearAdvSearch = this.clearAdvSearch.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.selectFilters = this.selectFilters.bind(this);
    this.onFormSubmit  = this.onFormSubmit.bind(this);
    this.surveillanceProgramsSelect = this.surveillanceProgramsSelect.bind(this);
    this.surveillanceSystemsSelect = this.surveillanceSystemsSelect.bind(this);
    this.programSearch = this.programSearch.bind(this);
    this.systemSearch  = this.systemSearch.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (this.state.surveillancePrograms !== nextProps.surveillancePrograms || this.state.surveillanceSystems !== nextProps.surveillanceSystems) {
      var surveillanceSystems  = values(nextProps.surveillanceSystems);
      var surveillancePrograms = values(nextProps.surveillancePrograms);
      this.setState({surveillanceSystems: surveillanceSystems,
        surveillancePrograms: surveillancePrograms
      });
    }
  }

  componentWillMount() {
    if(this.props.lastSearch) {
      var lastSearch = this.props.lastSearch;
      var searchTerms = lastSearch.search || '';
      var progFilters = lastSearch.programs || [];
      var sysFilters = lastSearch.systems || [];
      var mostRecentFilter = lastSearch.mostrecent || false;
      this.setState({searchTerms, progFilters, sysFilters, mostRecentFilter});
    }
  }

  showAdvSearch() {
    this.setState({ showAdvSearchModal: true });
  }

  hideAdvSearch() {
    this.setState({ showAdvSearchModal: false });
  }

  clearAdvSearch() {
    this.props.setFiltersParent({
      progFilters: [],
      sysFilters: [],
      mostRecentFilter: false,
      contentSince: null
    });
    this.setState({
      progFilters: [],
      sysFilters: [],
      mostRecentFilter: false,
      contentSince: null
    });
  }

  selectFilters(e, filterType) {
    var newState = {};
    newState[filterType] = $(e.target).val().map((opt) => parseInt(opt));
    this.props.setFiltersParent(newState);
    return this.setState(newState);
  }

  handleDateChange(date) {
    this.setState({
      contentSince: date
    });
    this.props.setFiltersParent({contentSince: date});
  }

  programSearch(programSearchTerm){
    var surveillancePrograms = values(this.props.surveillancePrograms);
    if(programSearchTerm && programSearchTerm.length > 1){
      surveillancePrograms = filter(surveillancePrograms, (sp) => sp.name.toLowerCase().includes(programSearchTerm.toLowerCase()) || this.state.progFilters.includes(sp.id));
    }
    this.setState({surveillancePrograms: surveillancePrograms});
  }

  systemSearch(systemSearchTerm){
    var surveillanceSystems = values(this.props.surveillanceSystems);
    if(systemSearchTerm && systemSearchTerm.length > 1){
      surveillanceSystems = filter(surveillanceSystems, (ss) => ss.name.toLowerCase().includes(systemSearchTerm.toLowerCase()) || this.state.sysFilters.includes(ss.id));
    }
    this.setState({surveillanceSystems: surveillanceSystems});
  }

  surveillanceProgramsSelect() {
    if (isEmpty(this.state.surveillancePrograms)) {
      return <p>No surveillance programs loaded in the database</p>;
    } else {
      return (
        <div className="form-group" id="search-programs">
          <label htmlFor="select-prog">Select Programs:</label>
          <NestedSearchBar onSearchTermChange={this.programSearch} modelName="Program" />
          <select multiple className="form-control" id="select-prog" value={this.state.progFilters} onChange={(e) => this.selectFilters(e, 'progFilters')}>
            {this.state.surveillancePrograms && values(this.state.surveillancePrograms).map((sp) => {
              return <option key={sp.id} value={sp.id}>{sp.name}</option>;
            })}
          </select>
        </div>
      );
    }
  }

  surveillanceSystemsSelect() {
    if (isEmpty(this.state.surveillanceSystems)) {
      return <p>No surveillance systems loaded in the database</p>;
    } else {
      return (
        <div className="form-group" id="search-systems">
          <label htmlFor="select-sys">Select Systems:</label>
          <NestedSearchBar onSearchTermChange={this.systemSearch} modelName="System" />
          <select multiple className="form-control" id="select-sys" value={this.state.sysFilters} onChange={(e) => this.selectFilters(e, 'sysFilters')}>
            {this.state.surveillanceSystems && values(this.state.surveillanceSystems).map((ss) => {
              return <option key={ss.id} value={ss.id}>{ss.name}</option>;
            })}
          </select>
        </div>
      );
    }
  }

  toggleMostRecentFilter() {
    var newState = {mostRecentFilter: !this.state.mostRecentFilter};
    this.props.search(this.state.searchTerms, this.state.progFilters, this.state.sysFilters, !this.state.mostRecentFilter);
    this.props.setFiltersParent(newState);
    this.setState(newState);
  }

  advSearchModal() {
    return (
      <Modal animation={false} show={this.state.showAdvSearchModal} onHide={this.hideAdvSearch} aria-label="Advanced Search Filters">
        <Modal.Header closeButton bsStyle='search'>
          <Modal.Title componentClass="h1">Advanced Search Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.searchSource === 'simple_search' ? (
            <div>
              <p className="adv-filter-list">Could not connect to advanced search - this feature should return shortly. Please contact your system admin if this issue persists. You may continue to use search with basic functionality.</p>
              <p className="adv-filter-list">For more information see the search section on the <Link to="/help">Help Page.</Link></p>
            </div>
            ) : (
            <div className="adv-filter-modal-body">
              <div className="col-md-12 adv-filter-instr">Select programs and systems to filter by. You may hold down control (CTRL), command (CMD), or shift on your keyboard to select multiple filters.</div>
              <div className="col-md-12">
                {this.surveillanceProgramsSelect()}
              </div>
              <div className="col-md-12">
                {this.surveillanceSystemsSelect()}
              </div>
              <div className="col-md-12">
                <h2>Additonal Filters:</h2>
                <input type='checkbox' className='form-check-input' name='most-recent-filter' id='most-recent-filter' checked={this.state.mostRecentFilter} onChange={() => this.toggleMostRecentFilter()} />
                <label htmlFor="most-recent-filter">Most Recent Versions Only</label>
                Content Changed Since: <DatePicker selected={this.state.contentSince} onChange={this.handleDateChange} />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.clearAdvSearch} disabled={this.props.searchSource === 'simple_search'} bsStyle="primary">Clear Filters</Button>
          <Button onClick={this.hideAdvSearch} bsStyle="primary">Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  onInputChange(event){
    this.setState({searchTerms: event.target.value});
  }

  onFormSubmit(event){
    event.preventDefault();
    let contentSince;
    if (this.state.contentSince) {
      contentSince = this.state.contentSince.format('M/D/YYYY');
    }
    this.props.search(this.state.searchTerms, this.state.progFilters, this.state.sysFilters, this.state.mostRecentFilter, contentSince);
  }

  render() {
    return (
    <form onSubmit={this.onFormSubmit}>
      {this.advSearchModal()}
      <div className="row">
        <div className="col-md-12">
          <div className="input-group search-group">
            <input onChange={this.onInputChange} value={this.state.searchTerms} type="text" id="search" tabIndex="4" name="search" aria-label="Dashboard Search Bar" className="search-input" placeholder="Search..."/>
            <span className="input-group-btn">
              <button id="search-btn" tabIndex="4" className="search-btn search-btn-default" aria-label="Click to submit search" type="submit"><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
            </span>
          </div>
          <div>
            {(this.state.progFilters.length > 0 || this.state.sysFilters.length > 0 || this.state.mostRecentFilter || this.state.contentSince) && <a href="#" tabIndex="4" className="adv-search-link pull-right" onClick={(e) => {
              e.preventDefault();
              this.clearAdvSearch();
            }}>Clear Adv. Filters</a>}
            <a className="adv-search-link pull-right" title="Advanced Search" href="#" tabIndex="4" onClick={(e) => {
              e.preventDefault();
              this.showAdvSearch();
            }}>{this.props.searchSource === 'simple_search' && <i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"></i>} Advanced</a>
            {this.state.progFilters.length > 0 &&
              <div className="adv-filter-list">Program Filters: {this.state.progFilters.map((id, i) => {
                return <row key={i} className="adv-filter-list-item col-md-12">{this.props.surveillancePrograms[id].name}</row>;
              })}
              </div>
            }
            {this.state.sysFilters.length > 0 &&
              <div className="adv-filter-list">System Filters: {this.state.sysFilters.map((id, i) => {
                return <row key={i} className="adv-filter-list-item col-md-12">{this.props.surveillanceSystems[id].name}</row>;
              })}
              </div>
            }
            {this.state.mostRecentFilter &&
              <div className="adv-filter-list">Filtering by most recent version</div>
            }
            {this.state.contentSince &&
              <div className="adv-filter-list">Content Since Filter:
                <row className="adv-filter-list-item col-md-12">{this.state.contentSince.format('M/D/YYYY')}</row>
              </div>
            }
          </div><br/>
        </div>
      </div>
    </form>
    );
  }
}

DashboardSearch.propTypes = {
  search: PropTypes.func.isRequired,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  setFiltersParent: PropTypes.func,
  searchSource: PropTypes.string,
  lastSearch: PropTypes.object
};

export default DashboardSearch;
