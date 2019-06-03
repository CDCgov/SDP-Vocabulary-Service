import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import { sectionsProps } from "../../prop-types/section_props";
import { questionsProps } from "../../prop-types/question_props";
import SearchResult from '../SearchResult';

class SurveySectionList extends Component {
  onEnter(e, prev) {
    if(e.key === 'Enter' && parseInt(e.target.value)) {
      e.preventDefault();
      this.props.reorderSection(this.props.survey, prev-1, prev-parseInt(e.target.value));
      e.target.value = '';
    }
  }

  render() {
    if(!this.props.sections || this.props.survey.surveySections.length < 1){
      return (<div className="section-group">No Sections Selected</div>);
    }
    var survey = this.props.survey;

    return (
      <div id="added-nested-items" aria-label="Added sections" className="section-edit-container">
      <br/>
      <div className="added-nested-item-group">
          {this.props.survey.surveySections.map((section, i) => {
            var sect = this.props.sections[section.sectionId];
            if(!sect) {
              return (
                <Grid className="basic-bg" key={i}>Loading...</Grid>

              );
            } else {
              return (
                <Row key={i}>
                  <Col md={11} className='survey-section'>
                    <SearchResult type  ='survey_section'
                                  result={{Source: sect}}
                                  currentUser={{id: -1}}
                                  isEditPage ={true}
                                  index={i} />
                  </Col>
                  <Col md={1}>
                    <div className="row section-nested-item-controls">
                      <button className="btn btn-small btn-default move-up"
                           onClick={(event) => {
                             event.preventDefault();
                             this.props.reorderSection(survey, i, 1);
                           }}>
                        <i title="Move Up" className="fa fa fa-arrow-up"></i><span className="sr-only">{`Move Up section ${sect.name} on survey`}</span>
                      </button>
                    </div>
                    <div className="row section-nested-item-controls">
                      <input className='col-md-8' style={{'padding-left': '5px', 'padding-right': '1px'}} placeholder={i+1} onKeyPress={event => this.onEnter(event, i+1)} />
                    </div>
                    <div className="row section-nested-item-controls">
                      <button className="btn btn-small btn-default move-down"
                           onClick={(event) => {
                             event.preventDefault();
                             this.props.reorderSection(survey, i, -1);
                           }}>
                        <i className="fa fa fa-arrow-down" title="Move Down"></i><span className="sr-only">{`Move down section ${sect.name} on survey`}</span>
                      </button>
                    </div>
                    <div className="row section-nested-item-controls">
                      <button className="btn btn-small btn-default delete-section"
                           onClick={(event) => {
                             event.preventDefault();
                             this.props.removeSection(survey, i);
                           }}>
                        <i className="fa fa fa-trash" title="Remove"></i><span className="sr-only">{`Delete section ${sect.name} on survey`}</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              );
            }
          }
        )}
      </div>
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
