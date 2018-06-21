import React, {Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

class ChangeHistoryTab extends Component {
  render() {
    if(this.props.versions === undefined || this.props.versions.length === 0){
      return (
        <div className={`basic-c-box panel-default ${this.props.type}-type`}>
          <div className="panel-heading">
            <h2 className="panel-title">Changes</h2>
          </div>
          <div className="box-content">
            No changes have been made to this version.
          </div>
        </div>
      );
    }
    let numberOfVersions = this.props.versions.length;
    let reversedVersions = this.props.versions.slice(0).reverse();
    return (
      <div className={`basic-c-box panel-default ${this.props.type}-type`}>
        <div className="panel-heading">
          <h2 className="panel-title">Changes</h2>
        </div>
        {reversedVersions.map((version, i) => {
          return (
            <div key={i} className="box-content">
              <strong>{`${this.props.majorVersion}.${numberOfVersions-i}: `}</strong>
              Changes by <strong>{version.author}</strong> on { format(parse(version.createdAt,''), 'MMMM Do YYYY, h:mm:ss a') }:
              <ul>
                {Object.keys(version.changeset).map((key) => {
                  return (<li key={key}><strong>{`"${key}"`}</strong>{` field changed from "${version.changeset[key][0]}" to "${version.changeset[key][1]}"`}</li>);
                })}
              </ul>
              {version.comment && <p><strong>Notes / Comments:</strong> {version.comment}</p>}
            </div>
          );
        })}
      </div>
    );
  }
}

ChangeHistoryTab.propTypes = {
  versions: PropTypes.array,
  majorVersion: PropTypes.number,
  type: PropTypes.string
};

export default ChangeHistoryTab;
