import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';

export default class VersionInfo extends Component {

  render() {
    const {versionable} = this.props;
    if(!versionable.allVersions || versionable.allVersions.length < 1){
      return null;
    }
    return (
      <div>
        <p>
          <strong>Most Recent Version: </strong>
          {versionable.mostRecent} {versionable.version === versionable.mostRecent ? '(Currently Selected)' : ''}
        </p>
        <p>
          <strong>Versions:</strong>
        </p>
        <ol>
          {versionable.allVersions && versionable.allVersions.map((v)=>{
            if(versionable.version == v.version){
              return (
                <li key={v.id}>Version: {versionable.version} - Created {moment(v.createdAt,'').fromNow()} (Currently Selected)
                </li>
              );
            }else{
              return (
                <li key={v.id}><Link to={`/${this.props.versionableType}s/${v.id}`}>Version: {v.version}</Link> - Created {moment(v.createdAt,'').fromNow()}</li>
              );
            }
          })}
        </ol>
      </div>
    );
  }
}

VersionInfo.propTypes = {
  versionable:  PropTypes.object,
  versionableType:  PropTypes.string
};
