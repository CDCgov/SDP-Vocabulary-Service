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
      stageFilter: '',
      categoryFilter: '',
      rtFilter: '',
      retiredFilter: false,
      preferredFilter: false,
      ombFilter: false,
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
      stageFilter: '',
      categoryFilter: '',
      rtFilter: '',
      preferredFilter: false,
      retiredFilter: false,
      ombFilter: false,
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

  toggleRetiredFilter() {
    let newState = {retiredFilter: !this.state.retiredFilter};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.retiredFilter = newState.retiredFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleOmbFilter() {
    let newState = {ombFilter: !this.state.ombFilter};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.ombFilter = newState.ombFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleSource(val) {
    let newState = {sourceFilter: val};
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

  toggleStageFilter(e) {
    let newState = {stageFilter: e.target.value, retiredFilter: this.state.retiredFilter};
    if (e.target.value === 'Retired' && !this.state.retiredFilter) {
      newState['retiredFilter'] = true;
    }
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.stageFilter = newState.stageFilter;
    searchParams.retiredFilter = newState.retiredFilter;
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
              <p className="adv-filter-list">Advanced search functionality is currently unavailable. You may continue to search by exact string match. If this issue persists, please contact: <a href="mailto:surveillanceplatform@cdc.gov">surveillanceplatform@cdc.gov</a></p>
              <p className="adv-filter-list">For more information see the search section on the <Link to="/help">Help Page.</Link></p>
            </div>
            ) : (
            <div className="adv-filter-modal-body">
              <p>Select programs and systems to filter by. You may hold down control (CTRL), command (CMD), or shift on your keyboard to select multiple filters.</p>
              <Row>
                <Col sm={6}>
                  {this.surveillanceProgramsSelect()}
                </Col>
                <Col sm={6}>
                  {this.surveillanceSystemsSelect()}
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <FormGroup className="sort-by-group">
                    <ControlLabel htmlFor="sort-by">Sort By:</ControlLabel>
                    <ToggleButtonGroup
                      type="radio"
                      name="sort-by"
                      defaultValue={this.state.sort}
                      className="form-btn-group"
                      >
                      <ToggleButton value={''} onClick={() => this.toggleSort('')}>Default</ToggleButton>
                      <ToggleButton value={'System Usage'} onClick={() => this.toggleSort('System Usage')}>System Usage</ToggleButton>
                      <ToggleButton value={'Program Usage'} onClick={() => this.toggleSort('Program Usage')}>Program Usage</ToggleButton>
                    </ToggleButtonGroup>
                  </FormGroup>
                </Col>
                <Col sm={6}>
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

                <Col sm={6}>
                  <FormGroup>
                    <label htmlFor="most-recent-filter">
                      <input type='checkbox' className='form-check-input' name='most-recent-filter' id='most-recent-filter' checked={this.state.mostRecentFilter} onChange={() => this.toggleMostRecentFilter()} />
                      Most Recent Versions Only
                    </label>
                    <br />
                    <label htmlFor="preferred-filter">
                      <input type='checkbox' className='form-check-input' name='preferred-filter' id='preferred-filter' checked={this.state.preferredFilter} onChange={() => this.togglePreferredFilter()} />
                      CDC Preferred Content Only
                    </label>
                    <label htmlFor="retired-filter">
                      <input type='checkbox' className='form-check-input' name='retired-filter' id='retired-filter' checked={this.state.retiredFilter} onChange={() => this.toggleRetiredFilter()} />
                      Include Retired Content
                    </label>
                    <label htmlFor="omb-filter">
                      <input type='checkbox' className='form-check-input' name='omb-filter' id='omb-filter' checked={this.state.ombFilter} onChange={() => this.toggleOmbFilter()} />
                      OMB Approved Content Only
                    </label>
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
                <Col sm={6}>
                  <FormGroup>
                    <ControlLabel htmlFor="status-filter">Visibility Status: </ControlLabel>
                    <ToggleButtonGroup
                      type="radio"
                      name="status-filter"
                      defaultValue={this.state.statusFilter}
                      className="form-btn-group"
                      >
                      <ToggleButton value={''} onClick={() => this.toggleStatus('')}>Any</ToggleButton>
                      <ToggleButton value={'draft'} onClick={() => this.toggleStatus('draft')}>Private (Authors Only)</ToggleButton>
                      <ToggleButton value={'published'} onClick={() => this.toggleStatus('published')}>Public</ToggleButton>
                    </ToggleButtonGroup>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel htmlFor="source-filter">Source (Response Sets Only):</ControlLabel><br/>
                    <ToggleButtonGroup
                      type="radio"
                      name="source-filter"
                      defaultValue={this.state.sourceFilter}
                      className="form-btn-group"
                      >
                      <ToggleButton value={''} onClick={() => this.toggleSource('')}>Any</ToggleButton>
                      <ToggleButton value={'local'} onClick={() => this.toggleSource('local')}>SDPV Local</ToggleButton>
                      <ToggleButton value={'phin_vads'} onClick={() => this.toggleSource('phin_vads')}>PHIN VADS</ToggleButton>
                    </ToggleButtonGroup>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="stage-filter">Content Stage: </label>
                    <select className="input-select" name="stage-filter" id="stage-filter" value={this.state.stageFilter} onChange={(e) => this.toggleStageFilter(e)} >
                      <option value="">Select Stage...</option>
                      <option value="Draft">Draft</option>
                      <option value="Comment Only">Comment Only</option>
                      <option value="Trial Use">Trial Use</option>
                      <option value="Published">Published</option>
                      <option value="Retired">Retired</option>
                      <option value="Duplicate">Duplicate</option>
                    </select>
                    <br />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <FormGroup>
                    <label htmlFor="rt-filter">Response Type <span className="label-note">(Questions Only):</span></label>
                    <select className="input-select" name="rt-filter" id="rt-filter" value={this.state.rtFilter} onChange={(e) => this.toggleResponseType(e)} >
                      <option value="">Select Response Type...</option>
                      {values(this.props.responseTypes).map((rt, i) => {
                        return <option key={i} value={rt.name}>{rt.name}</option>;
                      })}
                    </select>
                    <br />
                    <label htmlFor="category-filter">Category <span className="label-note">(Questions Only):</span></label>
                    <select className="input-select" name="category-filter" id="category-filter" value={this.state.categoryFilter} onChange={(e) => this.toggleCategory(e)} >
                      <option value="">Select Category...</option>
                      {values(this.props.categories).map((category, i) => {
                        return <option key={i} value={category.name}>{category.name}</option>;
                      })}
                    </select>
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <label htmlFor="dataCollectionMethod">Data Collection Method (Questions Only):</label>
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

  onEnter(e) {
    if(e.key === 'Enter') {
      e.preventDefault();
      this.onFormSubmit(e);
    }
  }

  render() {
    return (
    <div>
      {this.advSearchModal()}
      <Row>
        <Col md={12}>
          <div className="input-group search-group">
            <Autocomplete
              value={this.state.searchTerms}
              inputProps={{ id: 'search', className: 'search-input', name: 'search', type: 'text', tabIndex: '4', 'aria-label': 'Dashboard Search Bar', placeholder: `${this.props.placeholder || "Search..."}`, onKeyPress: event => this.onEnter(event) }}
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
              <button id="search-btn" tabIndex="4" className="search-btn search-btn-default" aria-label="Click to submit search" onClick={(e)=>this.onFormSubmit(e)}><i className="fa fa-search search-btn-icon" aria-hidden="true"></i></button>
            </span>
          </div>
          <div>
            {(this.state.programFilter.length > 0 || this.state.systemFilter.length > 0 || this.state.methodsFilter.length > 0 || this.state.mostRecentFilter || this.state.ombFilter || this.state.preferredFilter || this.state.retiredFilter || this.state.contentSince || this.state.ombDate || this.state.sort !== '' || this.state.statusFilter !== '' || this.state.stageFilter !== '' || this.state.sourceFilter !== '' || this.state.categoryFilter !== '' || this.state.rtFilter !== '') && <a href="#" tabIndex="4" className="adv-search-link pull-right" onClick={(e) => {
              e.preventDefault();
              this.clearAdvSearch();
            }}>Clear Adv. Filters</a>}
            <a className="adv-search-link pull-right" title="Advanced Search" href="#" tabIndex="4" onClick={(e) => {
              e.preventDefault();
              this.showAdvSearch();
            }}>{this.props.searchSource === 'simple_search' && <i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"></i>} Advanced</a>
            {this.state.programFilter.length > 0 &&
              <div className="adv-filter-list">Program Filters: {this.state.programFilter.map((id, i) => {
                return <div key={i} className="adv-filter-list-item col-md-12">{this.props.surveillancePrograms[id].name}</div>;
              })}
              </div>
            }
            {this.state.systemFilter.length > 0 &&
              <div className="adv-filter-list">System Filters: {this.state.systemFilter.map((id, i) => {
                return <div key={i} className="adv-filter-list-item col-md-12">{this.props.surveillanceSystems[id].name}</div>;
              })}
              </div>
            }
            {this.state.methodsFilter.length > 0 &&
              <div className="adv-filter-list">Data Collection Method Filters: {this.state.methodsFilter.map((method, i) => {
                return <div key={i} className="adv-filter-list-item col-md-12">{method}</div>;
              })}
              </div>
            }
            {this.state.mostRecentFilter &&
              <div className="adv-filter-list">Filtering by most recent version</div>
            }
            {this.state.preferredFilter &&
              <div className="adv-filter-list">Filtering by CDC preferred content</div>
            }
            {this.state.retiredFilter &&
              <div className="adv-filter-list">Including retired content in search results</div>
            }
            {this.state.ombFilter &&
              <div className="adv-filter-list">Filtering by OMB approved content</div>
            }
            {this.state.contentSince &&
              <div className="adv-filter-list">Content Since Filter:
                <div className="adv-filter-list-item col-md-12">{this.state.contentSince.format('M/D/YYYY')}</div>
              </div>
            }
            {this.state.ombDate &&
              <div className="adv-filter-list">Filtering to surveys with OMB approval date after:
                <div className="adv-filter-list-item col-md-12">{this.state.ombDate.format('M/D/YYYY')}</div>
              </div>
            }
            {this.state.sort !== '' &&
              <div className="adv-filter-list">Sorting results by {this.state.sort}</div>
            }
            {this.state.categoryFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.categoryFilter} category</div>
            }
            {this.state.statusFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.statusFilter} visibility status</div>
            }
            {this.state.stageFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.stageFilter} content stage</div>
            }
            {this.state.sourceFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.sourceFilter} source</div>
            }
            {this.state.rtFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.rtFilter} response type</div>
            }
          </div><br/>
        </Col>
      </Row>
    </div>
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
