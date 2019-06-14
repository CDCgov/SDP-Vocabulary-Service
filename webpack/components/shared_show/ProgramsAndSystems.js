import React, { Component } from 'react';
import PropTypes from 'prop-types';
import join from 'lodash/join';

import { Button } from 'react-bootstrap';
import InfoModal from '../../components/InfoModal';

export default class ProgramsAndSystems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoUsage: false
    };
  }

  render() {
    return (<div className="basic-c-box panel-default">
      <div className="panel-heading">
        <InfoModal show={this.state.showInfoUsage} header="Usage" body={<p>Usage is defined as the number of different Programs and Systems that have used this question on a SDP-V Survey that has been made public. This is a system metric and does not necessarily measure adoption of the question by stakeholders.</p>} hideInfo={()=>this.setState({showInfoUsage: false})} />
        <h2 className="panel-title">Usage{<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoUsage: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>}</h2>
      </div>
      <div className="box-content">
        <strong>Surveillance Programs: </strong> {this.surveillancePrograms(this.props.item)}
      </div>
      <div className="box-content">
        <strong>Surveillance Systems: </strong> {this.surveillanceSystems(this.props.item)}
      </div>
    </div>);
  }

  surveillancePrograms(item) {
    if (item.surveillancePrograms) {
      return <span>{item.surveillancePrograms.length}
       {item.surveillancePrograms.length > 0 ? ` - ${join(item.surveillancePrograms, ', ')}` : ''}</span>;
    } else {
      return 'Loading';
    }
  }

  surveillanceSystems(item) {
    if (item.surveillanceSystems) {
      return <span>{item.surveillanceSystems.length}
       {item.surveillanceSystems.length > 0 ? ` - ${join(item.surveillanceSystems, ', ')}` : ''}</span>;
    } else {
      return 'Loading';
    }
  }
}

ProgramsAndSystems.propTypes = {
  item: PropTypes.shape({
    surveillancePrograms: PropTypes.arrayOf(PropTypes.string),
    surveillanceSystems: PropTypes.arrayOf(PropTypes.string),
  })
};
