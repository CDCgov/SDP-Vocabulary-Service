import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Modal, Glyphicon, Checkbox, Button, ControlLabel, FormGroup, InputGroup, FormControl, DropdownButton, MenuItem} from 'react-bootstrap';
import { fetchConcepts, fetchConceptSystems } from '../actions/concepts_actions';
import _ from 'lodash';

class CodedSetTableEditContainer extends Component {
  constructor(props) {
    super(props);
    var items = props.initialItems.length < 1 ? [{value: '', codeSystem: '', displayName: ''}] : props.initialItems;
    this.state = {items: items, parentName: props.parentName, childName: props.childName, showConceptModal: false, selectedSystem: '', selectedConcepts: [], searchTerm: ''};
    this.handleSearchChange = this.handleSearchChange.bind(this);
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

  searchConcepts(system){
    if(system=='None'){
      this.setState({selectedSystem: ''});
      this.props.fetchConcepts('', this.state.searchTerm, 1);
    } else {
      this.setState({selectedSystem: system});
      this.props.fetchConcepts(system, this.state.searchTerm, 1);
    }
  }

  handleSearchChange(e){
    var value = e.target.value;
    this.setState({selectedConcepts: [], searchTerm: value});
    this.props.fetchConcepts(this.state.selectedSystem, value, 1);
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
                    <td><ControlLabel bsClass='checkbox-label'><Checkbox onChange={(e) => this.selectConcept(e,i)} name={`checkbox_${i}`}></Checkbox></ControlLabel></td>
                    <td>{c.display}</td>
                    <td>{c.code}</td>
                    <td>{c.system}</td>
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
      <Modal show={this.state.showConceptModal} onHide={this.hideCodeSearch} >
        <Modal.Header closeButton bsStyle='concept'>
          <Modal.Title>Search Codes</Modal.Title>
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
                  return <MenuItem key={i} value={s.name}>{s.name}</MenuItem>;
                })}
              </DropdownButton>
              <FormControl type="text" onChange={(e) => this.handleSearchChange(e)} placeholder="Search Codes"/>
              <FormControl.Feedback>
                <Glyphicon glyph="search"/>
              </FormControl.Feedback>
            </InputGroup>
          </FormGroup>
          <table className="table table-striped scroll-table-header">
            <thead>
              <tr>
                <th style={{width: '9%', paddingRight:' 0px', paddingBottom: '0px'}}>Add</th>
                <th style={{width: '50%', padding:' 0px'}}>Display Name</th>
                <th style={{width: '10%', padding:' 0px'}}>Code</th>
                <th style={{width: '30%', padding:' 0px'}}>Code System</th>
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
        {this.conceptModal()}
        <thead>
          <tr>
            <th>
              <a title="Search Codes" href="#" onClick={(e) => {
                e.preventDefault();
                this.showCodeSearch();
              }}><i className="fa fa-search fa-2x"></i></a>
            </th>
            <th>{this.state.childName[0].toUpperCase() + this.state.childName.slice(1)} Code</th>
            <th>Code System</th>
            <th>Display Name</th>
            <th>
              <a title="Add Row" href="#" onClick={(e) => {
                e.preventDefault();
                this.addItemRow();
              }}><i className="fa fa-plus fa-2x"></i></a>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.items.map((r, i) => {
            return (
              <tr key={i}>
                <td>
                </td>
                <td>
                  <label className="hidden" htmlFor={`value_${i}`}>Value</label>
                  <input className="input-format" type="text" value={r.value} name="value" id={`value_${i}`} onChange={this.handleChange(i, 'value')}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`codeSystem_${i}`}>Code system</label>
                  <input className="input-format" type="text" value={r.codeSystem}  name="codeSystem" id={`codeSystem_${i}`} onChange={this.handleChange(i, 'codeSystem')}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`displayName_${i}`}>Display name</label>
                  <input className="input-format" type="text" value={r.displayName} name="displayName" id={`displayName_${i}`} onChange={this.handleChange(i, 'displayName')}/>
                </td>
                <td>
                  <label className="hidden" htmlFor={`remove_${i}`}>Remove</label>
                  <a href="#" title="Remove" id={`remove_${i}`} onClick={(e) => {
                    e.preventDefault();
                    this.removeItemRow(i);
                  }}><i className="fa fa-2x fa-trash"></i></a>
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
