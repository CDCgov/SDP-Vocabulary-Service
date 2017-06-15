import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';
import _ from 'lodash';
import $ from 'jquery';

class DashboardSearch extends Component {
  constructor(props){
    super(props);
    this.state={
      searchTerms: '',
      progFilters: [],
      sysFilters: [],
      showAdvSearchModal: false
    };
    this.showAdvSearch = this.showAdvSearch.bind(this);
    this.hideAdvSearch = this.hideAdvSearch.bind(this);
    this.clearAdvSearch = this.clearAdvSearch.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.selectFilters = this.selectFilters.bind(this);
    this.onFormSubmit  = this.onFormSubmit.bind(this);
    this.surveillanceProgramsSelect = this.surveillanceProgramsSelect.bind(this);
    this.surveillanceSystemsSelect = this.surveillanceSystemsSelect.bind(this);
  }

  componentWillMount() {
    if(this.props.lastSearch) {
      var lastSearch = this.props.lastSearch;
      var searchTerms = lastSearch.search || '';
      var progFilters = lastSearch.programs || [];
      var sysFilters = lastSearch.systems || [];
      this.setState({searchTerms: searchTerms, progFilters: progFilters, sysFilters: sysFilters});
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
      sysFilters: []
    });
    this.setState({
      progFilters: [],
      sysFilters: []
    });
  }

  selectFilters(e, filterType) {
    var newState = {};
    newState[filterType] = $(e.target).val().map((opt) => parseInt(opt));
    this.props.setFiltersParent(newState);
    return this.setState(newState);
  }

  surveillanceProgramsSelect() {
    if (_.isEmpty(this.props.surveillancePrograms)) {
      return <p>No surveillance programs loaded in the database</p>;
    } else {
      return (
        <div className="form-group">
          <label htmlFor="select-prog">Select Programs:</label>
          <select multiple className="form-control" id="select-prog" value={this.state.progFilters} onChange={(e) => this.selectFilters(e, 'progFilters')}>
            {this.props.surveillancePrograms && _.values(this.props.surveillancePrograms).map((sp) => {
              return <option key={sp.id} value={sp.id}>{sp.name}</option>;
            })}
          </select>
        </div>
      );
    }
  }

  surveillanceSystemsSelect() {
    if (_.isEmpty(this.props.surveillanceSystems)) {
      return <p>No surveillance systems loaded in the database</p>;
    } else {
      return (
        <div className="form-group">
          <label htmlFor="select-sys">Select Systems:</label>
          <select multiple className="form-control" id="select-sys" value={this.state.sysFilters} onChange={(e) => this.selectFilters(e, 'sysFilters')}>
            {this.props.surveillanceSystems && _.values(this.props.surveillanceSystems).map((ss) => {
              return <option key={ss.id} value={ss.id}>{ss.name}</option>;
            })}
          </select>
        </div>
      );
    }
  }

  advSearchModal() {
    return (
      <Modal animation={false} show={this.state.showAdvSearchModal} onHide={this.hideAdvSearch} aria-label="Advanced Search Filters">
        <Modal.Header closeButton bsStyle='search'>
          <Modal.Title>Advanced Search Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.searchSource === 'simple_search' ? (
            <div>
              <p className="adv-filter-list">Could not connect to advanced search - this feature should return shortly. Please contact your system admin if this issue persists. You may continue to use search with basic functionality.</p>
              <p className="adv-filter-list">For more information see the search section on the <Link to="/help">Help Page.</Link></p>
            </div>
            ) : (
            <div className="adv-filter-modal-body">
              <div className="col-md-6">
                {this.surveillanceProgramsSelect()}
              </div>
              <div className="col-md-6">
                {this.surveillanceSystemsSelect()}
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
    this.props.search(this.state.searchTerms, this.state.progFilters, this.state.sysFilters);
  }

  render() {
    return (
    <form onSubmit={this.onFormSubmit}>
      {this.advSearchModal()}
      <div className="row">
        <div className="col-md-12">
          <div className="input-group search-group">
            <input onChange={this.onInputChange} value={this.state.searchTerms} type="text" id="search" tabIndex="4" name="search" aria-label="search-bar" className="search-input" placeholder="Search..."/>
            <span className="input-group-btn">
              <button id="search-btn" tabIndex="4" className="search-btn search-btn-default" aria-label="search-btn" type="submit"><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
            </span>
          </div>
          <div>
            {(this.state.progFilters.length > 0 || this.state.sysFilters.length > 0) && <a href="#" tabIndex="4" className="adv-search-link pull-right" onClick={(e) => {
              e.preventDefault();
              this.clearAdvSearch();
            }}>Clear Filters</a>}
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
