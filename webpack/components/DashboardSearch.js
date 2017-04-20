import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';
import _ from 'lodash';

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
    let newState = {}
    newState[filterType] = _.values(e.target.selectedOptions).map((opt) => opt.value);
    this.props.setFiltersParent(newState);
    return this.setState(newState);
  }

  surveillanceProgramsSelect() {
    if (_.isEmpty(this.props.surveillancePrograms)) {
      return <p>No surveillance programs loaded in the database</p>;
    } else {
      return (
        <div className="form-group">
          <label>Select Programs:</label>
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
          <label>Select Systems:</label>
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
      <Modal show={this.state.showAdvSearchModal} onHide={this.hideAdvSearch}>
        <Modal.Header closeButton bsStyle='search'>
          <Modal.Title>Advanced Search Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="adv-filter-modal-body">
            <div className="col-md-6">
              {this.surveillanceProgramsSelect()}
            </div>
            <div className="col-md-6">
              {this.surveillanceSystemsSelect()}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.clearAdvSearch} bsStyle="primary">Clear Filters</Button>
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
            <label htmlFor="search" className="hidden">Search</label>
            <input onChange={this.onInputChange} type="text" id="search" name="search" className="search-input" placeholder="Search..."/>
            <span className="input-group-btn">
              <button id="search-btn" className="search-btn search-btn-default" aria-label="search-btn" type="submit"><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
            </span>
          </div>
          {this.props.searchSource === 'simple_search' ? (<text className="adv-filter-list">Could not connect to elasticsearch, advanced searching disabled.</text>) : (
            <div>
              {(this.state.progFilters.length > 0 || this.state.sysFilters.length > 0) && <a href="#" className="adv-search-link pull-right" onClick={(e) => {
                e.preventDefault();
                this.clearAdvSearch();
              }}>Clear Filters</a>}
              <a className="adv-search-link pull-right" title="Advanced Search" href="#" onClick={(e) => {
                e.preventDefault();
                this.showAdvSearch();
              }}>Advanced</a>
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
            </div>
          )}<br/>
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
  searchSource: PropTypes.string
};

export default DashboardSearch;
