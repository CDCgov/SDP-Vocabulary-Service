import React, {Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import CodedSetTable from "../CodedSetTable";

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
                {version.sections &&  version.sections.original &&  version.sections.updated &&
                  <li>Linked sections original list:
                    <ul>
                      {version.sections.original.length == 0 && <li>No sections linked</li>}
                      {version.sections.original.map((ss) => <li><a href={`/#/sections/${ss.id}`}>{ss.name}</a></li>)}
                    </ul>
                    Updated List:
                    <ul>
                      {version.sections.updated.length == 0 && <li>No sections linked</li>}
                      {version.sections.updated.map((ss) => <li><a href={`/#/sections/${ss.id}`}>{ss.name}</a></li>)}
                    </ul>
                  </li>
                }
                {version.pdv &&
                  <li>Updates to program defined variables:
                    <ul>
                      {Object.keys(version.pdv).map((key) => <li>PDV for item number {key} was updated from "{version.pdv[key].original}" to "{version.pdv[key].updated}"</li>)}
                    </ul>
                  </li>
                }
                {version.nestedItems &&  version.nestedItems.original &&  version.nestedItems.updated &&
                  <li>Linked items original list:
                    <ul>
                      {version.nestedItems.original.length == 0 && <li>No nested items linked</li>}
                      {version.nestedItems.original.map((sni) => <li><a href={`/#/${sni.type}s/${sni.id}`}>{sni.name}</a></li>)}
                    </ul>
                    Updated List:
                    <ul>
                      {version.nestedItems.updated.length == 0 && <li>No nested items linked</li>}
                      {version.nestedItems.updated.map((sni) => <li><a href={`/#/${sni.type}s/${sni.id}`}>{sni.name}</a></li>)}
                    </ul>
                  </li>
                }
                {version.responseSets &&  version.responseSets.original &&  version.responseSets.updated &&
                  <li>Recommended response sets original list:
                    <ul>
                      {version.responseSets.original.length == 0 && <li>No response sets associated</li>}
                      {version.responseSets.original.map((rs) => <li><a href={`/#/responseSets/${rs.id}`}>{rs.name}</a></li>)}
                    </ul>
                    Updated List:
                    <ul>
                      {version.responseSets.updated.length == 0 && <li>No response sets associated</li>}
                      {version.responseSets.updated.map((rs) => <li><a href={`/#/responseSets/${rs.id}`}>{rs.name}</a></li>)}
                    </ul>
                  </li>
                }
                { version.tags &&
                  <li>Tags updated:
                    <ul>
                      <li><strong>Original:</strong><CodedSetTable items={version.tags.original} itemName={'Tag'} /></li>
                      <li><strong>Updated:</strong><CodedSetTable items={version.tags.updated} itemName={'Tag'} /></li>
                    </ul>
                  </li>
                }
                { version.responses &&
                  <li>Responses updated:
                    <ul>
                      <li><strong>Original:</strong><CodedSetTable items={version.responses.original} itemName={'Response'} /></li>
                      <li><strong>Updated:</strong><CodedSetTable items={version.responses.updated} itemName={'Response'} /></li>
                    </ul>
                  </li>
                }
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
