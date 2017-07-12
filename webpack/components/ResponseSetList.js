import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import { responseSetProps } from '../prop-types/response_set_props';
import SearchResult from './SearchResult';

export default class ResponseSetList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if(!this.props.responseSets){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="response-set-list">
        {this.props.responseSets.map((rs) => {
          return <SearchResult key={rs.id} type='response_set' result={{Source: rs}} currentUser={{id: -1}} />;
        })}
      </div>
    );
  }
}

ResponseSetList.propTypes = {
  responseSets: PropTypes.arrayOf(responseSetProps)
};
