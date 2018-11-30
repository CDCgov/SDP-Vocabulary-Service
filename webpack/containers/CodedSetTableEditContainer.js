import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Modal, Checkbox, Button, ControlLabel, FormGroup, InputGroup, DropdownButton, MenuItem} from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import filter from 'lodash/filter';
import concat from 'lodash/concat';

import NestedSearchBar from '../components/NestedSearchBar';
import { fetchConcepts, fetchConceptSystems, fetchTags } from '../actions/concepts_actions';


class CodedSetTableEditContainer extends Component {
  constructor(props) {
    super(props);
    var items = props.initialItems.length < 1 ? [{value: '', codeSystem: '', displayName: ''}] : props.initialItems;
    this.state = {items: items, parentName: props.parentName, childName: props.childName, showConceptModal: false, showCodeMappingModal: false, selectedSystem: '', selectedConcepts: [], searchTerm: ''};
    this.search = this.search.bind(this);
    this.hideCodeSearch = this.hideCodeSearch.bind(this);
  }

  componentWillMount() {
    this.props.fetchConceptSystems();
    this.props.fetchTags();
  }

  addItemRow(displayName='', codeSystem='', value='') {
    let newItems = concat(this.state.items, [{displayName: displayName, codeSystem: codeSystem, value: value}]);
    this.setState({items: newItems});
    if (this.props.itemWatcher) {
      this.props.itemWatcher(newItems);
    }
  }

  addItemRows(items) {
    let newItems = concat(this.state.items, items);
    newItems = newItems.filter((i) => (i.displayName!=='' || i.codeSystem!=='' || i.value!==''));
    this.setState({items: newItems});
    if (this.props.itemWatcher) {
      this.props.itemWatcher(newItems);
    }
  }

  removeItemRow(rowNumber) {
    let newItems = this.state.items;
    newItems.splice(rowNumber, 1);
    this.setState({items: newItems});
    if (this.props.itemWatcher) {
      this.props.itemWatcher(newItems);
    }
  }

  handleChange(rowNumber, field) {
    return (event) => {
      let newItems = this.state.items;
      newItems[rowNumber][field] = event.target.value;
      this.setState({items: newItems});
      if (this.props.itemWatcher) {
        this.props.itemWatcher(newItems);
      }
    };
  }

  showCodeSearch(){
    this.setState({ showConceptModal: true});
  }

  hideCodeSearch(){
    this.setState({showConceptModal: false});
    this.setState({selectedSystem: ''});
    this.setState({selectedConcepts: []});
  }

  search(searchTerms) {
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({selectedConcepts: [], searchTerm: searchTerms});
    this.props.fetchConcepts(this.state.selectedSystem.oid, searchTerms, 1);
  }

  searchConcepts(oid){
    if(!oid){
      this.setState({selectedSystem: null });
      this.props.fetchConcepts('', this.state.searchTerm, 1);
    } else {
      let system = this.props.conceptSystems[oid];
      this.setState({selectedSystem: system});
      this.props.fetchConcepts(oid, this.state.searchTerm, 1);
    }
  }

  selectConcept(e,i){
    var newConcepts = [];
    var selectedConcept = this.props.concepts[this.state.selectedSystem.oid][i];
    if(e.target.checked){
      newConcepts = concat(this.state.selectedConcepts, selectedConcept);
    }else{
      newConcepts = filter(this.state.selectedConcepts, (c) => {
        return (c.code !== selectedConcept.code);
      });
    }
    this.setState({selectedConcepts: newConcepts});
  }

  addSelectedConcepts(){
    this.addItemRows(this.state.selectedConcepts.map((c) => {
      return {displayName: c.display, codeSystem: c.system, value: c.code};
    }));
    this.hideCodeSearch();
  }

  resultsTable(){
    if(this.props.concepts.error || this.props.conceptSystems.error){
      return (
        <div className='table-scrolling-div'>
          <br/>
          <center>{this.props.concepts.error || this.props.conceptSystems.error}</center>
        </div>
      );
    } else {
      return (
        <div className='table-scrolling-div'>
          <table className="table table-striped scroll-table-header">
            <thead>
              <tr>
                <th id="add-code-checkboxes-column" scope="col">Add</th>
                <th id="modal-code-display-name-column" scope="col">Display Name / Concept Name</th>
                <th id="modal-code-column" scope="col">Code / Value</th>
                <th id="modal-code-system-column" scope="col">Code System</th>
              </tr>
            </thead>
          </table>
          <table className="table table-striped scroll-table-body">
            <tbody>
              {values(this.props.concepts[this.state.selectedSystem.oid]).map((c, i) => {
                return (
                  <tr key={i}>
                    <td headers="add-code-checkboxes-column"><ControlLabel bsClass='checkbox-label'><Checkbox onChange={(e) => this.selectConcept(e,i)} name={`checkbox_${i}`}></Checkbox></ControlLabel></td>
                    <td headers="modal-code-display-name-column">{c.display}</td>
                    <td headers="modal-code-column"><span title={`${c.code}`}>{c.code}</span></td>
                    <td headers="modal-code-system-column">{c.system}</td>
                  </tr>);
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }

  codeMappingHelpModal(){
    return (
      <Modal animation={false} show={this.state.showCodeMappingModal} onHide={() => this.setState({ showCodeMappingModal: false })} aria-label="Code System Mapping Info">
        <Modal.Header closeButton bsStyle='concept'>
          <Modal.Title componentClass="h1">Code System Mappings Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className="no-padding-top">Purpose</h2>
          <p>The purpose of Code System Mappings is to facilitate content discovery and reuse.</p>
          <h2>Definitions</h2>
          <p><strong>Concept Name: </strong>Keywords from a controlled vocabulary. A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies.</p>
          <p><strong>Concept Identifier: </strong>This may be a text or coded value that comes from a controlled vocabulary. Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.</p>
          <p><strong>Code System Identifier: </strong>The Code System used if you are using a coded value (e.g., LOINC, SNOMED-CT, RxNorm). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.</p>
          <h2>Example Code System Mappings Table</h2>
          <table className="set-table">
            <caption>Add, search, and create associated code system mappings</caption>
            <thead>
              <tr>
                <th scope="col" className="display-name-column" id="display-name-column-ex">Concept Name</th>
                <th scope="col" className="code-column" id="code-column-ex">Concept Identifier</th>
                <th scope="col" className="code-system-column" id="code-system-column-ex">Code System Identifier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="display-name-column-ex">Genus Salmonella (organism)</td>
                <td headers="code-column-ex">27268008</td>
                <td headers="code-system-column-ex">SNOMED-CT</td>
              </tr>
              <tr>
                <td headers="display-name-column-ex">Genus Campylobacter (organism)</td>
                <td headers="code-column-ex">35408001</td>
                <td headers="code-system-column-ex">SNOMED-CT</td>
              </tr>
            </tbody>
          </table><br/>
          <p><strong>How to Search for Previously Used Code Mappings</strong><br/>To determine if a code mapping has been used before in SDP-V, start typing in the concept name column of the table. A drop-down list of all previously used code mappings that match the text entered in the field will appear. A user can navigate the list and select a code mapping that was previously used. If a code system mapping is selected from the list, the concept identifier and code system identifier fields will be populated with existing values.</p>
          <p><strong>How to Search for code mappings from an External Code Systems</strong><br/>Rather than requiring you to copy and paste codes from other code systems, SDP-V allows you to search for codes from specific external code systems by clicking on the “Search for external coded items” magnifying glass icon to the right of the code mappings header. This opens the Search Codes dialog box. You may select a particular code system from the drop-down menu, or enter a search term to search across multiple code systems. This code search functionality searches codes from PHIN VADS. You may add coded values from these search results to the code mappings table by clicking the “Add” selection beside each result.</p>
          <p><strong>How to Create a New Code System Mapping</strong><br/>A new code system mapping may be created by simply typing a new concept name, concept identifier, and code system identifier (if applicable). A new code mapping should only be created if an existing code mapping does not meet a user’s needs.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.setState({ showCodeMappingModal: false })} bsStyle="primary">Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  conceptModal(){
    return (
      <Modal animation={false} bsSize="large" show={this.state.showConceptModal} onHide={this.hideCodeSearch} aria-label="Search Codes">
        <Modal.Header closeButton bsStyle='concept'>
          <Modal.Title componentClass="h1">Search Codes</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='concept'>
          <FormGroup controlId="formControlsSelect">
            <InputGroup>
              <DropdownButton
                componentClass={InputGroup.Button}
                id="system-select-dropdown"
                title={this.state.selectedSystem ? this.state.selectedSystem.name : 'Code System'} onSelect={(key, e) => this.searchConcepts(e.target.attributes.value.value)} >
                <MenuItem key={0} value={''}>None</MenuItem>
                {values(this.props.conceptSystems).map((s, i) => {
                  if(s.name) {
                    return <MenuItem key={i} value={s.oid}>{s.name}</MenuItem>;
                  }
                })}
              </DropdownButton>
              <NestedSearchBar onSearchTermChange={this.search} modelName="Code" />
            </InputGroup>
          </FormGroup>
          {this.resultsTable()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.hideCodeSearch()} bsStyle="default">Cancel</Button>
          <Button onClick={() => this.addSelectedConcepts()} bsStyle="primary">Add</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    var tableType = this.state.childName[0].toUpperCase() + this.state.childName.slice(1);
    return (
      <div>
        <table className="set-table">
          <caption>
            Add, search, and create associated {tableType === 'Response' ? 'responses' : <a title="See Code System Mapping Help" tabIndex="3" href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({ showCodeMappingModal: true });
            }}>code system mappings <i className="fa fa-info-circle"></i><text className='sr-only'>(Click for more info)</text></a>}
            <a className="pull-right" tabIndex="3" title="Search Codes" href="#" onClick={(e) => {
              e.preventDefault();
              this.showCodeSearch();
            }}><i className="fa fa-search"></i> Search for external coded items</a>
          </caption>
          {this.conceptModal()}
          {this.codeMappingHelpModal()}
          <thead>
            <tr>
              <th scope="col" className="display-name-column" id="display-name-column">{tableType === 'Response' ? 'Display Name' : 'Concept Name'}</th>
              <th scope="col" className="code-column" id="code-column">{tableType === 'Response' ? tableType : 'Concept Identifier'}</th>
              <th scope="col" className="code-system-column" id="code-system-column">Code System Identifier{tableType === 'Response' ? ' (Optional)' : ''}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((r, i) => {
              if(!r) {
                return ;
              }
              return (
                <tr key={i}>
                  <td headers="display-name-column">
                    <label className="hidden" htmlFor={`displayName_${i}`}>{tableType === 'Response' ? 'Display Name' : 'Concept Name'}</label>
                    {tableType === 'Response' ? (
                      <input className="input-format" tabIndex="3" type="text" value={r.displayName} name="displayName" id={`displayName_${i}`} onChange={this.handleChange(i, 'displayName')}/>
                    ) : (
                      <Autocomplete
                        value={r.displayName}
                        inputProps={{ id: `displayName_${i}`, className: 'input-format', name: 'displayName', type: 'text', tabIndex: '3' }}
                        wrapperStyle={{}}
                        items={sortBy(this.props.tags, 'displayName')}
                        getItemValue={(item) => item.displayName}
                        shouldItemRender={(item, value) => {
                          let name = item.displayName || '';
                          let val = item.value || '';
                          let cs = item.codeSystem || '';
                          return (
                            name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
                            val.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
                            cs.toLowerCase().indexOf(value.toLowerCase()) !== -1
                          );
                        }}
                        onSelect={(value, item) => {
                          let newItems = this.state.items;
                          newItems[i]['displayName'] = value;
                          newItems[i]['value'] = item.value || '';
                          newItems[i]['codeSystem'] = item.codeSystem || '';
                          this.setState({items: newItems});
                          if (this.props.itemWatcher) {
                            this.props.itemWatcher(newItems);
                          }
                        }}
                        onChange={this.handleChange(i, 'displayName')}
                        renderItem={(item, isHighlighted) => (
                          <div
                            className={`tag-item ${isHighlighted ? 'tag-item-highlighted' : ''}`}
                            key={item.id}
                          >{item.displayName}</div>
                        )}
                        renderMenu={children => (
                          <div className="tag-item-menu">
                            {children}
                          </div>
                        )}
                      />
                    )}
                  </td>
                  <td headers="code-column">
                    <label className="hidden" htmlFor={`value_${i}`}>Value</label>
                    <input className="input-format" tabIndex="3" type="text" value={r.value} name="value" id={`value_${i}`} onChange={this.handleChange(i, 'value')}/>
                  </td>
                  <td headers="code-system-column">
                    <label className="hidden" htmlFor={`codeSystem_${i}`}>Code system</label>
                    <input className="input-format" tabIndex="3" type="text" value={r.codeSystem}  name="codeSystem" id={`codeSystem_${i}`} onChange={this.handleChange(i, 'codeSystem')}/>
                  </td>
                  <a href="#" title={`Delete row number ${i+1}`} tabIndex="3" aria-label={`Remove row number ${i+1}`} id={`remove_${i}`} onClick={(e) => {
                    e.preventDefault();
                    this.removeItemRow(i);
                  }}><i className="table-row-delete fa fa-2x fa-trash"></i><span className="sr-only">{`Delete row number ${i+1}`}</span></a>
                </tr>
              );
            })}
          </tbody>
        </table>
        <a className="pull-right" tabIndex="3" title="Add Row" href="#" onClick={(e) => {
          e.preventDefault();
          this.addItemRow();
        }}><i className="fa fa-plus"></i> {`Add a new ${tableType}`}</a><br/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {concepts: state.concepts, conceptSystems: state.conceptSystems, tags: state.tags};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchConcepts, fetchConceptSystems, fetchTags}, dispatch);
}

CodedSetTableEditContainer.propTypes = {
  initialItems: PropTypes.arrayOf(PropTypes.shape({
    value:       PropTypes.string,
    codeSystem:  PropTypes.string,
    displayName: PropTypes.string
  })),
  concepts:  PropTypes.object,
  tags: PropTypes.array,
  childName: PropTypes.string,
  parentName:  PropTypes.string,
  itemWatcher: PropTypes.func,
  fetchConcepts:  PropTypes.func,
  conceptSystems: PropTypes.object,
  fetchConceptSystems: PropTypes.func,
  fetchTags: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(CodedSetTableEditContainer);
