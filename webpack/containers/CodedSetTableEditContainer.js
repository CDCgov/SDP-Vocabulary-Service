import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Modal, Checkbox, Button, ControlLabel, FormGroup, InputGroup, DropdownButton, MenuItem} from 'react-bootstrap';
import NestedSearchBar from '../components/NestedSearchBar';
import { fetchConcepts, fetchConceptSystems } from '../actions/concepts_actions';
import _ from 'lodash';

class CodedSetTableEditContainer extends Component {
  constructor(props) {
    super(props);
    var items = props.initialItems.length < 1 ? [{value: '', codeSystem: '', displayName: ''}] : props.initialItems;
    this.state = {items: items, parentName: props.parentName, childName: props.childName, showConceptModal: false, selectedSystem: '', selectedConcepts: [], searchTerm: ''};
    this.search = this.search.bind(this);
    this.hideCodeSearch = this.hideCodeSearch.bind(this);
  }

  componentWillMount() {
    this.props.fetchConceptSystems();
  }

  addItemRow(displayName='', codeSystem='', value='') {
    let newItems = _.concat(this.state.items, [{displayName: displayName, codeSystem: codeSystem, value: value}]);
    this.setState({items: newItems});
    if (this.props.itemWatcher) {
      this.props.itemWatcher(newItems);
    }
  }

  addItemRows(items) {
    let newItems = _.concat(this.state.items, items);
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
    this.props.fetchConcepts(this.state.selectedSystem, searchTerms, 1);
  }

  searchConcepts(system){
    if(system=='None'){
      this.setState({selectedSystem: ''});
      this.props.fetchConcepts('', this.state.searchTerm, 1);
    } else {
      this.setState({selectedSystem: system});
      this.props.fetchConcepts(system, this.state.searchTerm, 1);
    }
  }

  selectConcept(e,i){
    var newConcepts = [];
    var selectedConcept = this.props.concepts[this.state.selectedSystem][i];
    if(e.target.checked){
      newConcepts = _.concat(this.state.selectedConcepts, selectedConcept);
    }else{
      newConcepts = _.filter(this.state.selectedConcepts, (c) => {
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
          {this.props.concepts.error || this.props.conceptSystems.error}
        </div>
      );
    } else {
      return (
        <div className='table-scrolling-div'>
          <table className="table table-striped scroll-table-body">
            <tbody>
              {_.values(this.props.concepts[this.state.selectedSystem]).map((c, i) => {
                return (
                  <tr key={i}>
                    <td headers="add-code-checkboxes-column"><ControlLabel bsClass='checkbox-label'><Checkbox onChange={(e) => this.selectConcept(e,i)} name={`checkbox_${i}`}></Checkbox></ControlLabel></td>
                    <td headers="modal-code-display-name-column">{c.display}</td>
                    <td headers="modal-code-column">{c.code}</td>
                    <td headers="modal-code-system-column">{c.system}</td>
                  </tr>);
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }

  conceptModal(){
    return (
      <Modal animation={false} show={this.state.showConceptModal} onHide={this.hideCodeSearch} aria-label="Search Codes">
        <Modal.Header closeButton bsStyle='concept'>
          <Modal.Title componentClass="h1">Search Codes</Modal.Title>
        </Modal.Header>
        <Modal.Body bsStyle='concept'>
          <FormGroup controlId="formControlsSelect">
            <InputGroup>
              <DropdownButton
                componentClass={InputGroup.Button}
                id="system-select-dropdown"
                title={this.state.selectedSystem ? this.state.selectedSystem : 'Code System'} onSelect={(key, e) => this.searchConcepts(e.target.text)} >
                <MenuItem key={0} value={''}>None</MenuItem>
                {_.values(this.props.conceptSystems).map((s, i) => {
                  if(s.name) {
                    return <MenuItem key={i} value={s.name}>{s.name}</MenuItem>;
                  }
                })}
              </DropdownButton>
              <NestedSearchBar onSearchTermChange={this.search} modelName="Code" />
            </InputGroup>
          </FormGroup>
          <table className="table table-striped scroll-table-header">
            <thead>
              <tr>
                <th id="add-code-checkboxes-column" scope="col" style={{width: '9%', paddingRight:' 0px', paddingBottom: '0px'}}>Add</th>
                <th id="modal-code-display-name-column" scope="col" style={{width: '50%', padding:' 0px'}}>Display Name</th>
                <th id="modal-code-column" scope="col" style={{width: '10%', padding:' 0px'}}>Code</th>
                <th id="modal-code-system-column" scope="col" style={{width: '30%', padding:' 0px'}}>Code System</th>
              </tr>
            </thead>
          </table>
          {this.resultsTable()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.hideCodeSearch()} bsStyle="primary">Cancel</Button>
          <Button onClick={() => this.addSelectedConcepts()} bsStyle="primary">Add</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
      <table className="set-table">
        <caption>Add, search, and create associated {this.state.childName[0].toUpperCase() + this.state.childName.slice(1)}s:</caption>
        {this.conceptModal()}
        <thead>
          <tr>
            <td>
              <a title="Search Codes" href="#" onClick={(e) => {
                e.preventDefault();
                this.showCodeSearch();
              }}><i className="fa fa-search fa-2x"></i><span className="sr-only">Open Search Modal</span></a>
            </td>
            <th scope="col" className="display-name-column" id="display-name-column">Display Name</th>
            <th scope="col" className="code-column" id="code-column">{this.state.childName[0].toUpperCase() + this.state.childName.slice(1)} Code</th>
            <th scope="col" className="code-system-column" id="code-system-column">Code System</th>
            <td>
              <a title="Add Row" href="#" onClick={(e) => {
                e.preventDefault();
                this.addItemRow();
              }}><i className="fa fa-plus fa-2x"></i><span className="sr-only">Add a row to the table</span></a>
            </td>
          </tr>
        </thead>
        <tbody>
          {this.state.items.map((r, i) => {
            if(!r) {
              return ;
            }
            return (
              <tr key={i}>
                <td>
                </td>
                <td headers="display-name-column">
                  <label className="hidden" htmlFor={`displayName_${i}`}>Display name</label>
                  <input className="input-format" type="text" value={r.displayName} name="displayName" id={`displayName_${i}`} onChange={this.handleChange(i, 'displayName')}/>
                </td>
                <td headers="code-column">
                  <label className="hidden" htmlFor={`value_${i}`}>Value</label>
                  <input className="input-format" type="text" value={r.value} name="value" id={`value_${i}`} onChange={this.handleChange(i, 'value')}/>
                </td>
                <td headers="code-system-column">
                  <label className="hidden" htmlFor={`codeSystem_${i}`}>Code system</label>
                  <input className="input-format" type="text" value={r.codeSystem}  name="codeSystem" id={`codeSystem_${i}`} onChange={this.handleChange(i, 'codeSystem')}/>
                </td>
                <td>
                  <a href="#" title="Delete this row" aria-label={`remove_row_number_${i+1}`} id={`remove_${i}`} onClick={(e) => {
                    e.preventDefault();
                    this.removeItemRow(i);
                  }}><i className="fa fa-2x fa-trash"></i><span className="sr-only">Delete this row</span></a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

function mapStateToProps(state) {
  return {concepts: state.concepts, conceptSystems: state.conceptSystems};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchConcepts, fetchConceptSystems}, dispatch);
}

CodedSetTableEditContainer.propTypes = {
  initialItems: PropTypes.arrayOf(PropTypes.shape({
    value:       PropTypes.string,
    codeSystem:  PropTypes.string,
    displayName: PropTypes.string
  })),
  concepts:  PropTypes.object,
  childName: PropTypes.string,
  parentName:  PropTypes.string,
  itemWatcher: PropTypes.func,
  fetchConcepts:  PropTypes.func,
  conceptSystems: PropTypes.object,
  fetchConceptSystems: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(CodedSetTableEditContainer);
