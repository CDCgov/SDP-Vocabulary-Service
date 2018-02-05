import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isShowable } from '../utilities/componentHelpers';

export default class VersionInfo extends Component {
  render() {
    const {versionable} = this.props;
    if(!versionable.allVersions || versionable.allVersions.length < 1){
      return null;
    }
    return (
      <div className="">
        <ul className="nav nav-pills nav-stacked">
          {versionable.allVersions && versionable.allVersions.map((v)=>{
            if(versionable.version == v.version){
              return (
                <li key={v.id} role="presentation" className="active"><Link to={`/${this.props.versionableType}s/${v.id}`}>Version {versionable.version} </Link></li>
              );
            }else if (isShowable(v, this.props.currentUser)){
              return (
                <li key={v.id} role="presentation"><Link to={`/${this.props.versionableType}s/${v.id}`}>Version {v.version} </Link></li>
              );
            }else{
              return;
            }
          })}
        </ul>
      </div>
    );
  }
}

VersionInfo.propTypes = {
  versionable:  PropTypes.object,
  versionableType:  PropTypes.string,
  currentUser: PropTypes.object
};
