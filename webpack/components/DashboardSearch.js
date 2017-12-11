import { SingleDatePicker } from 'react-dates';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';
import NestedSearchBar from './NestedSearchBar';
import SearchStateComponent from './SearchStateComponent';
import { SearchParameters } from '../actions/search_results_actions';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';
import values from 'lodash/values';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import $ from 'jquery';

class DashboardSearch extends SearchStateComponent {
  constructor(props){
    super(props);
    this.state={
      searchTerms: '',
      programFilter: [],
      systemFilter: [],
      sort: '',
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
    if (nextProps.lastSearch &&
      (nextProps.lastSearch.type !== this.state.type
        || nextProps.lastSearch.myStuffFilter !== this.state.myStuffFilter)) {
      this.setState({myStuffFilter: nextProps.lastSearch.myStuffFilter, type: nextProps.lastSearch.type});
    }
  }

  componentWillMount() {
    if(this.props.lastSearch) {
      let searchParameters = new SearchParameters(this.props.lastSearch);
      this.setState(searchParameters);
    }
  }

  showAdvSearch() {
    this.setState({ showAdvSearchModal: true });
  }

  hideAdvSearch() {
    this.setState({ showAdvSearchModal: false });
  }

  clearAdvSearch() {
    const clearedParams = {
      programFilter: [],
      systemFilter: [],
      mostRecentFilter: false,
      contentSince: null,
      sort: '',
      groupFilterId: 0
    };
    let newParams = Object.assign(this.currentSearchParameters(), clearedParams);
    this.props.search(newParams);
    this.props.changeFiltersCallback(clearedParams);
    this.setState(clearedParams);
  }

  selectFilters(e, filterType) {
    var newState = {};
    newState[filterType] = $(e.target).val().map((opt) => parseInt(opt));
    let newParams = Object.assign(this.currentSearchParameters(), newState);
    this.props.search(newParams);
    this.props.changeFiltersCallback(newState);
    return this.setState(newState);
  }

  handleDateChange(date) {
    let newState = { contentSince: date };
    this.setState(newState);
    let newParams = Object.assign(this.currentSearchParameters(), newState);
    this.props.search(newParams);
    this.props.changeFiltersCallback(newState);
  }

  programSearch(programSearchTerm){
    var surveillancePrograms = values(this.props.surveillancePrograms);
    if(programSearchTerm && programSearchTerm.length > 1){
      surveillancePrograms = filter(surveillancePrograms, (sp) => sp.name.toLowerCase().includes(programSearchTerm.toLowerCase()) || this.state.programFilter.includes(sp.id));
    }
    this.setState({surveillancePrograms: surveillancePrograms});
  }

  systemSearch(systemSearchTerm){
    var surveillanceSystems = values(this.props.surveillanceSystems);
    if(systemSearchTerm && systemSearchTerm.length > 1){
      surveillanceSystems = filter(surveillanceSystems, (ss) => ss.name.toLowerCase().includes(systemSearchTerm.toLowerCase()) || this.state.systemFilter.includes(ss.id));
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
          <select multiple className="form-control" id="select-prog" value={this.state.programFilter} onChange={(e) => this.selectFilters(e, 'programFilter')}>
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
          <select multiple className="form-control" id="select-sys" value={this.state.systemFilter} onChange={(e) => this.selectFilters(e, 'systemFilter')}>
            {this.state.surveillanceSystems && values(this.state.surveillanceSystems).map((ss) => {
              return <option key={ss.id} value={ss.id}>{ss.name}</option>;
            })}
          </select>
        </div>
      );
    }
  }

  toggleMostRecentFilter() {
    let newState = {mostRecentFilter: !this.state.mostRecentFilter};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.mostRecentFilter = newState.mostRecentFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleSort(e) {
    let newState = {sort: e.target.value};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.sort = newState.sort;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
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
              <div className = "col-md-12">
                <label className="input-label" htmlFor="sort-by">Sort By:</label>
                <select className="input-select" name="sort-by" id="sort-by" value={this.state.sort} onChange={(e) => this.toggleSort(e)} >
                  <option value=""></option>
                  <option value="System Usage">System Usage</option>
                  <option value="Program Usage">Program Usage</option>
                </select>
              </div>
              <div className="col-md-12">
                <h2>Additonal Filters:</h2>
                <input type='checkbox' className='form-check-input' name='most-recent-filter' id='most-recent-filter' checked={this.state.mostRecentFilter} onChange={() => this.toggleMostRecentFilter()} />
                <label htmlFor="most-recent-filter">Most Recent Versions Only</label>
                <div>
                  <label htmlFor='content-since'>Content Changed Since</label>
                  <SingleDatePicker id="content-since"
                                    date={this.state.contentSince}
                                    onDateChange={this.handleDateChange}
                                    focused={this.state.focused}
                                    onFocusChange={({ focused }) => this.setState({ focused })}
                                    isOutsideRange={(day) => day.isAfter()}/>
                </div>
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
    this.props.fetchSuggestions(event.target.value);
    this.setState({searchTerms: event.target.value});
  }

  onFormSubmit(event){
    event.preventDefault();
    this.props.search(this.currentSearchParameters());
  }

  render() {
    return (
    <form onSubmit={this.onFormSubmit}>
      {this.advSearchModal()}
      <div className="row">
        <div className="col-md-12">
          <div className="input-group search-group">
            <Autocomplete
              value={this.state.searchTerms}
              inputProps={{ id: 'search', className: 'search-input', name: 'search', type: 'text', tabIndex: '4', 'aria-label': 'Dashboard Search Bar', placeholder: 'Search...' }}
              wrapperStyle={{}}
              autoHighlight={false}
              items={this.props.suggestions || []}
              getItemValue={(item) => item.text}
              onSelect={(value) => {
                this.setState({searchTerms: value});
              }}
              onChange={this.onInputChange}
              renderItem={(item, isHighlighted) => (
                <div
                  className={`tag-item ${isHighlighted ? 'tag-item-highlighted' : ''}`}
                  key={item.text}
                >{item.text}</div>
              )}
              renderMenu={children => (
                <div className="input-autocomplete-menu">
                  {children}
                </div>
              )}
            />
            <span className="input-group-btn">
              <button id="search-btn" tabIndex="4" className="search-btn search-btn-default" aria-label="Click to submit search" type="submit"><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
            </span>
          </div>
          <div>
            {(this.state.programFilter.length > 0 || this.state.systemFilter.length > 0 || this.state.mostRecentFilter || this.state.contentSince || this.state.sort !== '') && <a href="#" tabIndex="4" className="adv-search-link pull-right" onClick={(e) => {
              e.preventDefault();
              this.clearAdvSearch();
            }}>Clear Adv. Filters</a>}
            <a className="adv-search-link pull-right" title="Advanced Search" href="#" tabIndex="4" onClick={(e) => {
              e.preventDefault();
              this.showAdvSearch();
            }}>{this.props.searchSource === 'simple_search' && <i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"></i>} Advanced</a>
            {this.state.programFilter.length > 0 &&
              <div className="adv-filter-list">Program Filters: {this.state.programFilter.map((id, i) => {
                return <row key={i} className="adv-filter-list-item col-md-12">{this.props.surveillancePrograms[id].name}</row>;
              })}
              </div>
            }
            {this.state.systemFilter.length > 0 &&
              <div className="adv-filter-list">System Filters: {this.state.systemFilter.map((id, i) => {
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
            {this.state.sort !== '' &&
              <div className="adv-filter-list">Sorting results by {this.state.sort}</div>
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
  changeFiltersCallback: PropTypes.func,
  searchSource: PropTypes.string,
  lastSearch: PropTypes.object,
  suggestions: PropTypes.array,
  fetchSuggestions: PropTypes.func
};

export default DashboardSearch;
