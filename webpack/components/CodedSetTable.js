import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { Modal, Button } from 'react-bootstrap';

import InfoModal from '../components/InfoModal';

export default class CodedSetTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        show: false
      };
    }

    getInfoButtonBody(colHeader) {
      var rName = this.props.itemName;
      if (rName == 'Response') {
        if(colHeader == 'Display Name')        {
          return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoDisplayName: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;
        }        else if(colHeader == 'Response')        {
          return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoResponse: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;
        }        else if (colHeader == ' (Optional)')        {
          return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoCodeSystemIdentifierOptional: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;
        }
      }    else if (rName == 'Code System Mapping') {
        if(colHeader == 'Concept Name')        {
          return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoConceptName: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;
        }        else if(colHeader == 'Concept Identifier')        {
          return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoConceptID: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;
        }        else if(colHeader == '')        {
          return <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoCodeSystemIdentifier: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>;
        }
      }
    }

  render() {
    var rName = this.props.itemName;
    if(!this.props.items || this.props.items.length < 1){
      return (<strong>No {this.props.itemName}s Selected</strong>);
    }

    return (
      <table className="table table-striped coded-set-table">
        <caption>Table of {this.props.itemName}s:</caption>
        <InfoModal show={this.state.showInfoDisplayName} header="Display Name" body={<p>This is the human-readable value for the response (Example: Abdominal Pain, Vomiting, Diarrhea, etc.).</p>} hideInfo={()=>this.setState({showInfoDisplayName: false})} />
        <InfoModal show={this.state.showInfoResponse} header="Response" body={<p>If applicable, this is the Response Code. This may come from an external code system such as LOINC or SNOMED-CT or a program’s internal coding scheme.</p>} hideInfo={()=>this.setState({showInfoResponse: false})} />
        <InfoModal show={this.state.showInfoCodeSystemIdentifierOptional} header="Code System Identifier (Optional)" body={<p>If a coded response is being used, specifies the Code System used (Example: identifiers for LOINC, SNOMED-CT, RxNorm, the program’s coding scheme etc.). </p>} hideInfo={()=>this.setState({showInfoCodeSystemIdentifierOptional: false})} />
        <InfoModal show={this.state.showInfoConceptName} header="Concept Name" body={<p>Term from a controlled vocabulary to designate a unit of meaning or idea (e.g., ‘Genus Salmonella (organism)’). A controlled vocabulary includes external code systems, such as LOINC or SNOMED-CT, or internally developed vocabularies such as PHIN VADS.</p>} hideInfo={()=>this.setState({showInfoConceptName: false})} />
        <InfoModal show={this.state.showInfoConceptID} header="Concept Identifier" body={<p>This is text or a code used to uniquely identify a concept in a controlled vocabulary (e.g., 27268008). Note that if you have selected a code system mapping that has already been used in SDP-V or is selected from the results from "Search for external coded items", this field will be automatically populated.</p>} hideInfo={()=>this.setState({showInfoConceptID: false})} />
        <InfoModal show={this.state.showInfoCodeSystemIdentifier} header="Code System Identifier" body={<p>This is the unique designator for a code system also referred to as a controlled vocabulary, in which concepts and value sets are defined (e.g. 2.16.840.1.113883.6.96). LOINC, SNOMED-CT, and RxNorm are code systems. Note that if you have mapped a code system to a question or response set that has already been mapped in SDP-V or returned from an external code system search, the code
        system identifier field will be automatically populated.</p>} hideInfo={()=>this.setState({showInfoCodeSystemIdentifier: false})} />
        <thead>
          <tr>
            <th scope="col" id="display-name-column">{this.props.itemName === 'Response' ? 'Display Name' : 'Concept Name'}{this.getInfoButtonBody(rName === 'Response' ? 'Display Name' : 'Concept Name')}</th>
            <th scope="col" id="code-column">{this.props.itemName === 'Response' ? 'Response' : 'Concept Identifier'}{this.getInfoButtonBody(rName === 'Response' ? rName : 'Concept Identifier')}</th>
            <th scope="col" id="code-system-column">Code System Identifier {this.props.itemName === 'Response' && '(Optional)'}{this.getInfoButtonBody(rName === 'Response' ? ' (Optional)' : '')}</th>
          </tr>
        </thead>
        <tbody>
          {this.sortedItems().map((item,i) => {
            return (
              <tr key={i}>
                <td headers="display-name-column">{item.displayName}</td>
                <td headers="code-column">{item.value}</td>
                <td headers="code-system-column">{item.codeSystem}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  sortedItems() {
    return sortBy(this.props.items, ['codeSystem', 'value']);
  }
}

CodedSetTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    value:    PropTypes.string,
    codeSystem:  PropTypes.string,
    displayName: PropTypes.string
  })),
  itemName:  PropTypes.string
};
