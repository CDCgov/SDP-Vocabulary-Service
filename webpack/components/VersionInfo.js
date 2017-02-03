import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';

export default class VersionInfo extends Component {

  render() {
    const {versionable} = this.props;
    if(!versionable.otherVersions || versionable.otherVersions.length < 1){
      return null;
    }
    var mostRecent = '';
    if(versionable.mostRecent){
      mostRecent = (
        <p>
          <strong>Most Recent Version: </strong>
          {versionable.version} (Currently Selected)
        </p>
      );
    }else{
      mostRecent = (
        <p>
          <strong>Most Recent Version: </strong>
          {versionable.mostRecent} (Currently Selected)
        </p>
      );
    }
    return (
      <div>
        {mostRecent}
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
