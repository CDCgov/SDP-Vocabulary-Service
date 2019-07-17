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
import $ from 'jquery';

class DashboardSearch extends SearchStateComponent {
  constructor(props){
    super(props);
    this.state={
      type: [],
      myStuffFilter: false,
      searchTerms: '',
      programFilter: [],
      systemFilter: [],
      methodsFilter: [],
      sort: '',
      sourceFilter: '',
      statusFilter: '',
      stageFilter: [],
      categoryFilter: '',
      rtFilter: '',
      retiredFilter: false,
      preferredFilter: false,
      ombFilter: false,
      showAdvSearchModal: false,
      mostRecentFilter: false,
      groupFilterId: 0,
      surveillancePrograms: {},
      surveillanceSystems: {}
    };
    this.showAdvSearch = this.showAdvSearch.bind(this);
    this.hideAdvSearch = this.hideAdvSearch.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.selectType = this.selectType.bind(this);
    this.selectAuthor = this.selectAuthor.bind(this);
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
    let clearedParams = {
      programFilter: [],
      systemFilter: [],
      methodsFilter: [],
      mostRecentFilter: false,
      contentSince: null,
      ombDate: null,
      sourceFilter: '',
      statusFilter: '',
      stageFilter: [],
      categoryFilter: '',
      rtFilter: '',
      type: [],
      myStuffFilter: false,
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

  surveillanceSystemsSelect() {
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
    let newState = {};
    let stage = this.state.stageFilter || [];
    if(stage.includes(e.target.value)) {
      newState.stageFilter = stage.filter((i) => i !== e.target.value);
      newState.retiredFilter = this.state.retiredFilter;
    } else {
      stage.push(e.target.value);
      newState.stageFilter = stage;
      newState.retiredFilter = this.state.retiredFilter;
    }
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

  toggleCategory(val) {
    let newState = {categoryFilter: val};
    this.setState(newState);
    let searchParams = this.currentSearchParameters();
    searchParams.categoryFilter = newState.categoryFilter;
    this.props.search(searchParams);
    this.props.changeFiltersCallback(newState);
  }

  toggleResponseType(val) {
    let newState = {rtFilter: val};
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
                    <ControlLabel htmlFor="status-filter">Visibility Status: </ControlLabel><br/>
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
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <FormGroup>
                    <label htmlFor="rt-filter">Response Type <span className="label-note">(Questions Only):</span></label>
                    <select className="input-select" name="rt-filter" id="rt-filter" value={this.state.rtFilter} onChange={(e) => this.toggleResponseType(e.target.value)} >
                      <option value="">Select Response Type...</option>
                      {values(this.props.responseTypes).map((rt, i) => {
                        return <option key={i} value={rt.name}>{rt.name}</option>;
                      })}
                    </select>
                    <br />
                    <label htmlFor="category-filter">Category <span className="label-note">(Questions Only):</span></label>
                    <select className="input-select" name="category-filter" id="category-filter" value={this.state.categoryFilter} onChange={(e) => this.toggleCategory(e.target.value)} >
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

  selectGroup(gid=0) {
    let newState = {};
    newState.groupFilterId = gid;
    this.setState(newState);
    let newSearchParams = Object.assign(this.currentSearchParameters(), newState);
    this.props.search(newSearchParams);
  }

  selectAuthor() {
    let newState = {};
    if(this.state.myStuffFilter) {
      newState.myStuffFilter = false;
    } else {
      newState.myStuffFilter = true;
    }
    this.setState(newState);
    let newSearchParams = Object.assign(this.currentSearchParameters(), newState);
    this.props.search(newSearchParams);
  }

  selectType(searchType) {
    let newState = {};
    let type = this.state.type || [];
    if(type.includes(searchType)) {
      newState.type = type.filter((i) => i !== searchType);
      newState.page = 1;
    } else {
      type.push(searchType);
      newState.type = type;
      newState.page = 1;
    }
    this.setState(newState);
    let newSearchParams = Object.assign(this.currentSearchParameters(), newState);
    this.props.search(newSearchParams);
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
            <nav className="filter-navbar">
                <div className="navbar-header">
                  <i className="fa fa-filter filter-brand"><text className="sr-only">Filter navbar</text></i>
                </div>
                <div className="collapse navbar-collapse" id="filter-nav">
                  {this.props.isDash && <ul className="filter-nav filter-utlt-navbar-nav">
                    <li className="dropdown">
                      <a href="#" id="type-filter" tabIndex="2" className="dropdown-toggle filter-navbar-item help-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Type<span className="caret"></span></a>
                      <ul className="cdc-nav-dropdown">
                        <li className="nav-dropdown-item"><a href='#' className='response-set-green' onClick={()=>this.selectType('response_set')}>{this.state.type && this.state.type.includes('response_set') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' /> } <i className='fa fa-list' aria-hidden="true" /> Response Sets</a></li>
                        <li className="nav-dropdown-item"><a href='#' className='question-blue' onClick={()=>this.selectType('question')}>{this.state.type && this.state.type.includes('question') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' /> } <i className='fa fa-question-circle' aria-hidden="true" /> Questions</a></li>
                        <li className="nav-dropdown-item"><a href='#' className='section-purple' onClick={()=>this.selectType('section')}>{this.state.type && this.state.type.includes('section') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' /> } <i className='fa fa-window-maximize' aria-hidden="true" /> Sections</a></li>
                        <li className="nav-dropdown-item"><a href='#' className='survey-teal' onClick={()=>this.selectType('survey')}>{this.state.type && this.state.type.includes('survey') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' /> } <i className='fa fa-clipboard' aria-hidden="true" /> Surveys</a></li>
                      </ul>
                    </li>
                  </ul>}
                  {this.props.loggedIn &&
                    <ul className="filter-nav filter-utlt-navbar-nav">
                      <li className="dropdown">
                        <a href="#" id="owner-filter" tabIndex="2" className="dropdown-toggle filter-navbar-item help-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Owner<span className="caret"></span></a>
                        <ul className="cdc-nav-dropdown">
                          <li className="nav-dropdown-item"><a href='#' onClick={()=>this.selectAuthor()}>Filter to items owned by me</a></li>
                        </ul>
                      </li>
                    </ul>
                  }
                  {this.props.loggedIn && this.props.groups.length > 0 && this.props.searchSource !== 'simple_search' &&
                    <ul className="filter-nav filter-utlt-navbar-nav">
                      <li className="dropdown">
                        <a href="#" id="group-filter" tabIndex="2" className="dropdown-toggle filter-navbar-item help-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Group<span className="caret"></span></a>
                        <ul className="cdc-nav-dropdown">
                          {this.props.groups.map((g, i) => {
                            return <li key={i} className="nav-dropdown-item" onClick={(e) => {
                              e.preventDefault();
                              this.selectGroup(g.id);
                            }}><a href='#'>{g.name}</a></li>;
                          })}
                          <li role="separator" className="divider"></li>
                          <li className="nav-dropdown-item"><a href='#' onClick={(e) => {
                            e.preventDefault();
                            this.selectGroup('-1');
                          }}>All My Groups</a></li>
                        </ul>
                      </li>
                    </ul>
                  }
                  <ul className="filter-nav filter-utlt-navbar-nav">
                    <li className="dropdown">
                      <a href="#" id="stage-filter" tabIndex="2" className="dropdown-toggle filter-navbar-item help-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Stage<span className="caret"></span></a>
                      <ul className="cdc-nav-dropdown">
                        <li className="nav-dropdown-item"><a href='#' onClick={(e) => {
                          e.preventDefault();
                          this.toggleStageFilter({target: {value: 'Published'}});
                        }}>{this.state.stageFilter && this.state.stageFilter.includes('Published') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' />} <i className='fa fa-check-square-o status-green' aria-hidden="true" /> Published</a></li>
                        <li className="nav-dropdown-item"><a href='#' onClick={(e) => {
                          e.preventDefault();
                          this.toggleStageFilter({target: {value: 'Draft'}});
                        }}>{this.state.stageFilter && this.state.stageFilter.includes('Draft') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' />} <i className='fa fa-pencil' aria-hidden="true" /> Draft</a></li>
                        <li className="nav-dropdown-item"><a href='#' onClick={(e) => {
                          e.preventDefault();
                          this.toggleStageFilter({target: {value: 'Comment Only'}});
                        }}>{this.state.stageFilter && this.state.stageFilter.includes('Comment Only') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' />} <i className='fa fa-comments' aria-hidden="true" /> Comment Only</a></li>
                        <li className="nav-dropdown-item"><a href='#' onClick={(e) => {
                          e.preventDefault();
                          this.toggleStageFilter({target: {value: 'Trial Use'}});
                        }}>{this.state.stageFilter && this.state.stageFilter.includes('Trial Use') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' />} <i className='fa fa-gavel' aria-hidden="true" /> Trial Use</a></li>
                        <li className="nav-dropdown-item"><a href='#' onClick={(e) => {
                          e.preventDefault();
                          this.toggleStageFilter({target: {value: 'Duplicate'}});
                        }}>{this.state.stageFilter && this.state.stageFilter.includes('Duplicate') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' />} <i className='fa fa-files-o' aria-hidden="true" /> Duplicate</a></li>
                        <li className="nav-dropdown-item"><a href='#' onClick={(e) => {
                          e.preventDefault();
                          this.toggleStageFilter({target: {value: 'Retired'}});
                        }}>{this.state.stageFilter && this.state.stageFilter.includes('Retired') ? <i className='fa fa-check-square-o' aria-hidden='true' /> : <i className='fa fa-square-o' aria-hidden='true' />} <i className='fa fa-ban' aria-hidden="true" /> Retired</a></li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="filter-nav filter-utlt-navbar-nav">
                    <li className="dropdown">|</li>
                  </ul>
                  <ul className="filter-nav filter-utlt-navbar-nav">
                    <li className="dropdown">
                      <a href="#" id="clear-filter" tabIndex="2" className="filter-navbar-item help-link" role="button" onClick={(e) => {
                        e.preventDefault();
                        this.clearAdvSearch();
                      }}>Clear</a>
                    </li>
                  </ul>
                  <a className="adv-search-link pull-right" title="Advanced Search" href="#" tabIndex="4" onClick={(e) => {
                    e.preventDefault();
                    this.showAdvSearch();
                  }}>{this.props.searchSource === 'simple_search' && <i className="fa fa-exclamation-triangle simple-search-icon" aria-hidden="true"></i>} Advanced</a>
                </div>
            </nav>
            {this.state.type && this.state.type.length > 0 && <div className='col-md-12'>
              {this.state.type && this.state.type.includes('survey') &&
                <div className='adv-filter-survey col-md-3'><i className='fa important-white fa-clipboard' aria-hidden="true"></i><text className='sr-only'>Filtering by type: </text> Survey <a href='#' onClick={() => this.selectType('survey')}><i className="fa fa-times" style={{'color': 'white'}} aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
              }
              {this.state.type && this.state.type.includes('section')&&
                <div className='adv-filter-section col-md-3'><i className='fa important-white fa-window-maximize' aria-hidden="true"></i><text className='sr-only'>Filtering by type: </text> Section <a href='#' onClick={() => this.selectType('section')}><i className="fa fa-times" style={{'color': 'white'}} aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
              }
              {this.state.type && this.state.type.includes('question') &&
                <div className='adv-filter-question col-md-3'><i className='fa important-white fa-question-circle' aria-hidden="true"></i><text className='sr-only'>Filtering by type: </text> Question <a href='#' onClick={() => this.selectType('question')}><i className="fa fa-times" style={{'color': 'white'}} aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
              }
              {this.state.type && this.state.type.includes('response_set') &&
                <div className='adv-filter-response_set col-md-3'><i className='fa important-white fa-list' aria-hidden="true"></i><text className='sr-only'>Filtering by type: </text> Response Set <a href='#' onClick={() => this.selectType('response_set')}><i className="fa fa-times" style={{'color': 'white'}} aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
              }
            </div>}
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
              <div className="adv-filter-list">Data Collection Method Filters: <ul>{this.state.methodsFilter.map((method, i) => {
                return <li key={i} className="adv-filter-list-item col-md-12">{method}</li>;
              })}
              </ul></div>
            }
            {this.state.stageFilter.length > 0 &&
              <div className="adv-filter-list">Content Stage Filters: <ul>{this.state.stageFilter.map((stage, i) => {
                return <li key={i} className="adv-filter-list-item col-md-12">{stage} <a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.toggleStageFilter({ target: { value: stage } });
                }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></li>;
              })}
              </ul></div>
            }
            {this.state.mostRecentFilter &&
              <div className="adv-filter-list">Filtering by most recent version <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleMostRecentFilter();
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.preferredFilter &&
              <div className="adv-filter-list">Filtering by CDC preferred content <a href='#' onClick={(e) => {
                e.preventDefault();
                this.togglePreferredFilter();
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.retiredFilter &&
              <div className="adv-filter-list">Including retired content in search results <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleRetiredFilter();
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.myStuffFilter &&
              <div className="adv-filter-list">Filtering to content you own <a href='#' onClick={(e) => {
                e.preventDefault();
                this.selectAuthor();
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {!this.state.retiredFilter &&
              <div className="adv-filter-list">Hiding retired content from search results <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleRetiredFilter();
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.ombFilter &&
              <div className="adv-filter-list">Filtering by OMB approved content <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleOmbFilter();
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.contentSince &&
              <div className="adv-filter-list">Content Since Filter:
                <div className="adv-filter-list-item col-md-12">{this.state.contentSince.format('M/D/YYYY')} <a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.handleDateChange(null);
                }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
              </div>
            }
            {this.state.ombDate &&
              <div className="adv-filter-list">Filtering to surveys with OMB approval date after:
                <div className="adv-filter-list-item col-md-12">{this.state.ombDate.format('M/D/YYYY')} <a href='#' onClick={(e) => {
                  e.preventDefault();
                  this.handleOmbDateChange(null);
                }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
              </div>
            }
            {this.state.sort !== '' &&
              <div className="adv-filter-list">Sorting results by {this.state.sort} <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleSort('');
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.categoryFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.categoryFilter} category <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleCategory('');
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.statusFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.statusFilter === 'draft' ? 'private' : 'public'} visibility status <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleStatus('');
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.sourceFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.sourceFilter} source <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleSource('');
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
            {this.state.rtFilter !== '' &&
              <div className="adv-filter-list">Filtering results by {this.state.rtFilter} response type <a href='#' onClick={(e) => {
                e.preventDefault();
                this.toggleResponseType('');
              }}><i className="fa fa-times search-btn-icon" aria-hidden="true"></i><text className='sr-only'>Click to remove filter</text></a></div>
            }
          </div>
        </Col>
      </Row>
    </div>
    );
  }
}

DashboardSearch.propTypes = {
  search: PropTypes.func.isRequired,
  categories: PropTypes.object,
  loggedIn: PropTypes.bool,
  isDash: PropTypes.bool,
  groups: PropTypes.array,
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
