import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import { sectionProps } from "../../prop-types/section_props";
import SearchResult from '../SearchResult';

class SectionList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if(!this.props.sections){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="section-group">
        {this.props.sections.map((s, i) => {
          if (s.status === 'published' || s.createdById === this.props.currentUserId) {
            return <SearchResult key={i} type='section' result={{Source: s}} currentUser={{id: -1}} />;
          }
        })}
      </div>
    );
  }
}

SectionList.propTypes = {
  sections: PropTypes.arrayOf(sectionProps),
  currentUserId: PropTypes.number
};

export default SectionList;
