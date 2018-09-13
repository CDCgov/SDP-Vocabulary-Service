import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import { sectionProps } from "../../prop-types/section_props";
import { isShowable } from '../../utilities/componentHelpers';
import SearchResult from '../SearchResult';
import LoadingSpinner from '../../components/LoadingSpinner';

class SectionList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if(!this.props.sections){
      return (
        <div><LoadingSpinner msg="Loading..." /></div>
      );
    }
    return (
      <div className="section-group">
        {this.props.sections.map((s, i) => {
          if (isShowable(s, this.props.currentUser)) {
            return <SearchResult key={i} type='section' result={{Source: s}} currentUser={{id: -1}} />;
          }
        })}
      </div>
    );
  }
}

SectionList.propTypes = {
  sections: PropTypes.arrayOf(sectionProps),
  currentUser: PropTypes.object
};

export default SectionList;
