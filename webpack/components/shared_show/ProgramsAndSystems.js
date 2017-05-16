import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

class ProgramsAndSystems extends Component {
  render() {
    return (<div className="basic-c-box panel-default">
      <div className="panel-heading">
        <h2 className="panel-title">Usage</h2>
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
       {item.surveillancePrograms.length > 0 ? ` - ${_.join(item.surveillancePrograms)}` : ''}</span>;
    } else {
      return 'Loading';
    }
  }

  surveillanceSystems(item) {
    if (item.surveillanceSystems) {
      return <span>{item.surveillanceSystems.length}
       {item.surveillanceSystems.length > 0 ? ` - ${_.join(item.surveillanceSystems)}` : ''}</span>;
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

export default ProgramsAndSystems;
