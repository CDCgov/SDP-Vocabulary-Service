import { SingleDatePicker } from 'react-dates';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Modal, Button, Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';

import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';

import Autocomplete from 'react-autocomplete';
import NestedSearchBar from './NestedSearchBar';
import DataCollectionSelect from './DataCollectionSelect';
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
      methodsFilter: [],
      sort: '',
      sourceFilter: '',
      statusFilter: '',
      categoryFilter: '',
      rtFilter: '',
      preferredFilter: false,
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
    this.selectMethods = this.selectMethods.bind(this);
    this.onFormSubmit  = this.onFormSubmit.bind(this);
    this.surveillanceProgramsSelect = this.surveillanceProgramsSelect.bind(this);
    this.surveillanceSystemsSelect = this.surveillanceSystemsSelect.bind(this);
    this.programSearch = this.programSearch.bind(this);
    this.systemSearch  = this.systemSearch.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleOmbDateChange = this.handleOmbDateChange.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
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

  componentDidMount() {
    $(document).off('click.bs.button.data-api', '[data-toggle^="button"]')
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
      methodsFilter: [],
      mostRecentFilter: false,
      contentSince: null,
      ombDate: null,
      sourceFilter: '',
      statusFilter: '',
      categoryFilter: '',
      rtFilter: '',
      preferredFilter: false,
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

  selectMethods(e) {
    let newState = { methodsFilter: $(e.target).val() };
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

  handleOmbDateChange(date) {
    let newState = { ombDate: date };
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
        <FormGroup id="search-programs">
          <label htmlFor="select-prog">Select Programs:</label>
          <NestedSearchBar onSearchTermChange={this.programSearch} modelName="Program" />
          <select multiple className="form-control" id="select-prog" value={this.state.programFilter} onChange={(e) => this.selectFilters(e, 'programFilter')}>
            {this.state.surveillancePrograms && values(this.state.surveillancePrograms).map((sp) => {
              return <option key={sp.id} value={sp.id}>{sp.name}</option>;
            })}
          </select>
        </FormGroup>
      );
    }
  }

  surveillanceSystemsSelect() {
    if (isEmpty(this.state.surveillanceSystems)) {
      return <p>No surveillance systems loaded in the database</p>;
    } else {
      return (
        <FormGroup id="search-systems">
          <label htmlFor="select-sys">Select Systems:</label>
          <NestedSearchBar onSearchTermChange={this.systemSearch} modelName="System" />
          <select multiple className="form-control" id="select-sys" value={this.state.systemFilter} onChange={(e) => this.selectFilters(e, 'systemFilter')}>
            {this.state.surveillanceSystems && values(this.state.surveillanceSystems).map((ss) => {
              return <option key={ss.id} value={ss.id}>{ss.name}</option>;
            })}
          </select>
        </FormGroup>
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

  togglePreferredFilter() {
    let newState = {preferredFilter: !this.state.preferredFilter};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.preferredFilter = newState.preferredFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleSource(e) {
    let newState = {sourceFilter: e.target.value};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.sourceFilter = newState.sourceFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleStatus(val) {
    let newState = {statusFilter: val};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.statusFilter = newState.statusFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleCategory(e) {
    let newState = {categoryFilter: e.target.value};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.categoryFilter = newState.categoryFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleResponseType(e) {
    let newState = {rtFilter: e.target.value};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.rtFilter = newState.rtFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleSort(val) {
    let newState = {sort: val};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.sort = newState.sort;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  advSearchModal() {
    return (
      <Modal animation={false} bsSize="large" show={this.state.showAdvSearchModal} onHide={this.hideAdvSearch} aria-label="Advanced Search Filters">
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
              <p>Select programs and systems to filter by. You may hold down control (CTRL), command (CMD), or shift on your keyboard to select multiple filters.</p>
              <Row>
                <Col sm="6">
                  {this.surveillanceProgramsSelect()}
                </Col>
                <Col sm="6">
                  {this.surveillanceSystemsSelect()}
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <FormGroup className="sort-by-group">
                    <ControlLabel htmlFor="sort-by">Sort By:</ControlLabel>
                    <ToggleButtonGroup
                      type="radio"
                      name="sort-by"
                      onChange={this.toggleSort}
                      value={this.state.sort}
                      className="form-btn-group"
                      >
                      <ToggleButton value={''}>Default</ToggleButton>
                      <ToggleButton value={'System Usage'}>System Usage</ToggleButton>
                      <ToggleButton value={'Program Usage'}>Program Usage</ToggleButton>
                    </ToggleButtonGroup>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label htmlFor='content-since'>Content Changed Since:</label>
                    <SingleDatePicker id="content-since"
                                      date={this.state.contentSince}
                                      onDateChange={this.handleDateChange}
                                      focused={this.state.focused}
                                      onFocusChange={({ focused }) => this.setState({ focused })}
                                      isOutsideRange={(day) => day.isAfter()}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="additional-filters">
                
                <h3 className="h4 col-xs-12">Additonal Filters:</h3>

                <Col sm="6">
                  <FormGroup row>
                    <label htmlFor="most-recent-filter">
                      <input type='checkbox' className='form-check-input' name='most-recent-filter' id='most-recent-filter' checked={this.state.mostRecentFilter} onChange={() => this.toggleMostRecentFilter()} />
                      Most Recent Versions Only
                    </label>
                    <br />
                    <label htmlFor="preferred-filter">
                      <input type='checkbox' className='form-check-input' name='preferred-filter' id='preferred-filter' checked={this.state.preferredFilter} onChange={() => this.togglePreferredFilter()} />
                      CDC Preferred Content Only
                    </label>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <ControlLabel htmlFor="status-filter">Status: </ControlLabel>
                    <ToggleButtonGroup
                      type="radio"
                      name="status-filter"
                      onChange={this.toggleStatus}
                      value={this.state.statusFilter}
                      className="form-btn-group"
                      >
                      <ToggleButton value={''}>Any</ToggleButton>
                      <ToggleButton value={'draft'}>Draft</ToggleButton>
                      <ToggleButton value={'published'}>Published</ToggleButton>
                    </ToggleButtonGroup>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor='omb-date'>OMB Approval Date (Surveys Only):</label>
                    <SingleDatePicker id="omb-date"
                                      date={this.state.ombDate}
                                      onDateChange={this.handleOmbDateChange}
                                      focused={this.state.ombFocused}
                                      onFocusChange={({ focused }) => this.setState({ ombFocused: focused })}
                                      isOutsideRange={(day) => day.isAfter()}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <label htmlFor="rt-filter">Response Type <span className="label-note">(Questions Only):</span></label>
                    <select className="input-select" name="rt-filter" id="rt-filter" value={this.state.rtFilter} onChange={(e) => this.toggleResponseType(e)} >
                      <option value="" disabled hidden>Select Response Type...</option>
                      {values(this.props.responseTypes).map((rt, i) => {
                        return <option key={i} value={rt.name}>{rt.name}</option>;
                      })}
                    </select>
                    <br />
                    <label htmlFor="category-filter">Category <span className="label-note">(Questions Only):</span></label>
                    <select className="input-select" name="category-filter" id="category-filter" value={this.state.categoryFilter} onChange={(e) => this.toggleCategory(e)} >
                      <option value="" disabled hidden>Select Category...</option>
                      {values(this.props.categories).map((category, i) => {
                        return <option key={i} value={category.name}>{category.name}</option>;
                      })}
                    </select>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <label htmlFor="source-filter">Source <span className="label-note">(Response Sets Only):</span></label>
                  <select className="input-select" name="source-filter" id="source-filter" value={this.state.sourceFilter} onChange={(e) => this.toggleSource(e)} >
                    <option value="" disabled hidden>Select Source...</option>
                    <option value=""></option>
                    <option value="local">SDPV Local</option>
                    <option value="PHIN_VADS">PHIN VADS</option>
                  </select>
                  <br />
                  <label className="input-label" htmlFor="dataCollectionMethod">Data Collection Method (Questions Only):</label>
                  <DataCollectionSelect onChangeFunc={this.selectMethods} methods={this.state.methodsFilter} />
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.clearAdvSearch} disabled={this.props.searchSource === 'simple_search'} bsStyle="default">Clear Filters</Button>
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
              inputProps={{ id: 'search', className: 'search-input', name: 'search', type: 'text', tabIndex: '4', 'aria-label': 'Dashboard Search Bar', placeholder: `${this.props.placeholder || "Search..."}` }}
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
            {(this.state.programFilter.length > 0 || this.state.systemFilter.length > 0 || this.state.methodsFilter.length > 0 || this.state.mostRecentFilter || this.state.preferredFilter || this.state.contentSince || this.state.ombDate || this.state.sort !== '' || this.state.statusFilter !== '' || this.state.sourceFilter !== '' || this.state.categoryFilter !== '' || this.state.rtFilter !== '') && <a href="#" tabIndex="4" className="adv-search-link pull-right" onClick={(e) => {
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
            {this.state.methodsFilter.length > 0 &&
              <div className="adv-filter-list">Data Collection Method Filters: {this.state.methodsFilter.map((method, i) => {
                return <row key={i} className="adv-filter-list-item col-md-12">{method}</row>;
              })}
              </div>
            }
            {this.state.mostRecentFilter &&
              <div className="adv-filter-list">Filtering by most recent version</div>
            }
            {this.state.preferredFilter &&
              <div className="adv-filter-list">Filtering by CDC preferred content</div>
            }
            {this.state.contentSince &&
              <div className="adv-filter-list">Content Since Filter:
                <row className="adv-filter-list-item col-md-12">{this.state.contentSince.format('M/D/YYYY')}</row>
              </div>
            }
            {this.state.ombDate &&
              <div className="adv-filter-list">Filtering to surveys with OMB approval date after:
                <row className="adv-filter-list-item col-md-12">{this.state.ombDate.format('M/D/YYYY')}</row>
              </div>
            }
            {this.state.sort !== '' &&
              <div className="adv-filter-list">Sorting results by {this.state.sort}</div>
            }
            {this.state.categoryFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.categoryFilter} category</div>
            }
            {this.state.statusFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.statusFilter} status</div>
            }
            {this.state.sourceFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.sourceFilter} source</div>
            }
            {this.state.rtFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.rtFilter} response type</div>
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
  categories: PropTypes.object,
  responseTypes: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  changeFiltersCallback: PropTypes.func,
  searchSource: PropTypes.string,
  lastSearch: PropTypes.object,
  suggestions: PropTypes.array,
  fetchSuggestions: PropTypes.func
};

export default DashboardSearch;
