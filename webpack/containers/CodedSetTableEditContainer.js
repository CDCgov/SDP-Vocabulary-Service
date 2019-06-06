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
import { gaSend } from '../utilities/GoogleAnalytics';
import InfoModal from '../components/InfoModal';

class CodedSetTableEditContainer extends Component {
  constructor(props) {
    super(props);
    var items = props.initialItems.length < 1 ? [{value: '', codeSystem: '', displayName: ''}] : props.initialItems;
    this.state = {items: items, parentName: props.parentName, childName: props.childName, showConceptModal: false, showCodeMappingModal: false, selectedSystem: '', selectedConcepts: [], searchTerm: ''};
    this.search = this.search.bind(this);
    this.hideCodeSearch = this.hideCodeSearch.bind(this);
  }

  componentWillMount() {
    gaSend('send', 'pageview', window.location.toString());
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
        <h2 clasName='no-padding-top'>Purpose</h2>
        <p>The purpose of the Code System Mappings table is to identify the governed concepts from code systems like LOINC, SNOMED, PHIN VADS, etc that are associated with response sets, questions, sections, or surveys in SDP-V. That is, the Code System Mappings table identifies how content in SDP-V is represented in another code system.<br/>The Code System Mappings table should only include mapping to governed concepts. Non-governed concepts or keywords should not be added to the Code System Mappings table. If you would like to add keywords to your response set, question, section, or survey to facilitate content discovery or organization, please see the “Keyword Tags” help documentation for information on how to use the “Tags” feature.</p>
        <p><strong>Mutability: </strong>Any changes to entries in the Code System Mappings table are versioned since code system mappings are a property of the vocabulary itself. This allows users to update the Code System Mappings while maintaining legacy mappings in older SDP-V content versions if needed.</p>
        <p><strong>Discoverability: </strong>Code System Mappings table fields are included in the dashboard search algorithm so other users can find questions, sections, and surveys with specific concept names, concept identifiers or code system identifiers in SDP-V. For instance, a user can enter “27268008” into the dashboard search box to find content in SDP-V associated with that concept identifier. </p>

        <h2>Definitions</h2>
        <p><strong>Concept Name: </strong>Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS.</p>
        <p><strong>Concept Identifier: </strong>This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.</p>
        <p><strong>Code System Identifier: </strong>This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code system identifier field will be automatically populated.</p>

        <h2>Example Code System Mappings Table</h2>
        <table className="set-table table">
          <caption><strong></strong></caption>
          <thead>
            <tr>
              <th  id="concept-name">Concept Name</th>
              <th  id="concept-identifier">Concept Identifier</th>
              <th  id="code-sytem-identifier">Code System Identifier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td headers="concept-name">Genus Salmonella (organism)</td>
              <td headers="concept-identifier">27268008</td>
              <td headers="code-sytem-identifier">2.16.840.1.113883.6.96</td>
            </tr>
            <tr>
              <td headers="concept-name">Genus Campylobacter (organism)</td>
              <td headers="concept-identifier">35408001</td>
              <td headers="code-sytem-identifier">2.16.840.1.113883.6.96</td>
            </tr>
          </tbody>
        </table><br/>
        <p><strong>How to Search for Previously Used Code Mappings</strong><br/>To determine if a code system mapping has been used before in SDP-V, start typing in the concept name column of the table. A drop-down list of all previously used concept names that match the text entered in the field will appear. A user can navigate the list and select a concept name that was previously used. If a concept name is selected from the list, the concept identifier and code system identifier fields will be populated with existing values already entered in SDP-V.</p>
        <p><strong>How to Search for Code Mappings from an External Code Systems</strong><br/>Rather than requiring you to copy and paste codes from other code systems, SDP-V allows you to search for codes from specific external code systems by clicking on the “Search for external coded items” magnifying glass icon to the right of the code system mappings header. This opens the Search Codes dialog box. You may select a particular code system from the drop-down menu, or enter a search term to search across multiple code systems. This code search functionality searches codes from PHIN VADS. You may add coded values from these search results to the code mappings table by clicking the “Add” selection beside each result.</p>
        <p><strong>How to Create a New Code System Mapping</strong><br/>A new code system mapping may be created by simply typing a new concept name, concept identifier, and code system identifier. A new code mapping should only be created if an existing code mapping does not meet a user’s needs.</p>
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

  getInfoButtonBody(colHeader) {
    var tableType = this.state.childName[0].toUpperCase() + this.state.childName.slice(1);
    if (tableType == 'Response') {
      if(colHeader == 'Display Name')
        { return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoDisplayName: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;}
        else if(colHeader == 'Response')
        {return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoResponse: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;}
        else if (colHeader == ' (Optional)')
        {return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoCodeSystemIdentifierOptional: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;}
      }
    else if (tableType == 'Code System Mapping') {
      if(colHeader == 'Concept Name')
        { return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoConceptName: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;}
        else if(colHeader == 'Concept Identifier')
        { return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoConceptID: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;}
        else if(colHeader == '')
        { return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoCodeSystemIdentifier: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;}
    }
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
          <InfoModal show={this.state.showInfoDisplayName} header="Display Name" body={<p>Add a Display Name (Example: Abdominal Pain, Vomiting, Diarrhea, etc.). This is the human-readable value for the response.</p>} hideInfo={()=>this.setState({showInfoDisplayName: false})} />
          <InfoModal show={this.state.showInfoResponse} header="Response" body={<p>If applicable, add a Response Code. This may come from an external code system such as LOINC or SNOMED-CT or your program’s internal coding scheme.</p>} hideInfo={()=>this.setState({showInfoResponse: false})} />
          <InfoModal show={this.state.showInfoCodeSystemIdentifierOptional} header="Code System Identifier (Optional)" body={<p>If you are using a coded response, specify the Code System used (Example: identifiers for LOINC, SNOMED-CT, RxNorm, your program’s coding scheme etc.).</p>} hideInfo={()=>this.setState({showInfoCodeSystemIdentifierOptional: false})} />
          <InfoModal show={this.state.showInfoConceptName} header="Concept Name" body={<p>Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS.</p>} hideInfo={()=>this.setState({showInfoConceptName: false})} />
          <InfoModal show={this.state.showInfoConceptID} header="Concept Identifier" body={<p>This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.</p>} hideInfo={()=>this.setState({showInfoConceptID: false})} />
          <InfoModal show={this.state.showInfoCodeSystemIdentifier} header="Code System Identifier" body={<p>This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code system identifier field will be automatically populated.</p>} hideInfo={()=>this.setState({showInfoCodeSystemIdentifier: false})} />
          <thead>
            <tr>
              <th scope="col" className="display-name-column" id="display-name-column">{tableType === 'Response' ? 'Display Name' : 'Concept Name'} {this.getInfoButtonBody(tableType === 'Response' ? 'Display Name' : 'Concept Name')}</th>
              <th scope="col" className="code-column" id="code-column">{tableType === 'Response' ? tableType : 'Concept Identifier'} {this.getInfoButtonBody(tableType === 'Response' ? tableType : 'Concept Identifier')}</th>
              <th scope="col" className="code-system-column" id="code-system-column">Code System Identifier{tableType === 'Response' ? ' (Optional)' : ''} {this.getInfoButtonBody(tableType === 'Response' ? ' (Optional)' : '')}</th>
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
