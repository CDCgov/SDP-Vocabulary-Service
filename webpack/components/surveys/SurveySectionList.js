import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sectionsProps } from "../../prop-types/section_props";
import { questionsProps } from "../../prop-types/question_props";
import SearchResult from '../SearchResult';

class SurveySectionList extends Component {
  render() {
    if(!this.props.sections || this.props.survey.surveySections.length < 1){
      return (<div className="section-group">No Sections Selected</div>);
    }
    var survey = this.props.survey;
    return (
      <div className="section-group added-section-group">
          {this.props.survey.surveySections.map((section, i) => {
            var sect = this.props.sections[section.sectionId];
            if(!sect) {
              return (
                <div key={i}>Loading...</div>
              );
            } else {
              return (
                      <div className="row survey-section" key={i}>
                        <div className="col-md-11">
                          <SearchResult type  ='survey_section'
                                        result={{Source: sect}}
                                        currentUser={{id: -1}}
                                        isEditPage ={true}
                                        index={i} />
                        </div>
                        <div className="col-md-1">
                          <div className="row survey-section-controls">
                              <button className="btn btn-small btn-default move-up"
                                   onClick={(event) => {
                                     event.preventDefault();
                                     this.props.reorderSection(survey, i, 1);
                                   }}>
                                <i title="Move Up" className="fa fa fa-arrow-up"></i><span className="sr-only">{`Move Up section ${sect.name} on survey`}</span>
                              </button>
                          </div>
                          <div className="row survey-section-controls">
                              <button className="btn btn-small btn-default move-down"
                                   onClick={(event) => {
                                     event.preventDefault();
                                     this.props.reorderSection(survey, i, -1);
                                   }}>
                                <i className="fa fa fa-arrow-down" title="Move Down"></i><span className="sr-only">{`Move down section ${sect.name} on survey`}</span>
                              </button>
                          </div>
                          <div className="row survey-section-controls">
                              <button className="btn btn-small btn-default delete-section"
                                   onClick={(event) => {
                                     event.preventDefault();
                                     this.props.removeSection(survey, i);
                                   }}>
                                <i className="fa fa fa-trash" title="Remove"></i><span className="sr-only">{`Delete section ${sect.name} on survey`}</span>
                              </button>
                          </div>
                        </div>
                      </div>
              );
            }
          }
         )}
      </div>
    );
  }
}

SurveySectionList.propTypes = {
  survey: PropTypes.object,
  sections:  sectionsProps,
  questions:  questionsProps,
  removeSection:  PropTypes.func,
  reorderSection: PropTypes.func
};

export default SurveySectionList;
