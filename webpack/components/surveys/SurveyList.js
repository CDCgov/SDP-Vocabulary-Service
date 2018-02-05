import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

import { surveyProps } from "../../prop-types/survey_props";
import { isShowable } from '../../utilities/componentHelpers';
import SearchResult from '../SearchResult';

class SurveyList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if(!this.props.surveys){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="survey-group">
        {this.props.surveys.map((s, i) => {
          if (isShowable(s, this.props.currentUser)) {
            return <SearchResult key={i} type='survey' result={{Source: s}} currentUser={{id: -1}} />;
          }
        })}
      </div>
    );
  }
}

SurveyList.propTypes = {
  surveys: PropTypes.arrayOf(surveyProps),
  currentUser: PropTypes.object
};

export default SurveyList;
