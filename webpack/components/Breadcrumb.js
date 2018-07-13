import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { clearBreadcrumb, addBreadcrumbItem, setBreadcrumbPath, removeBreadcrumbItem } from '../actions/breadcrumb_actions';
import { surveyProps } from "../prop-types/survey_props";
import { isShowable } from '../utilities/componentHelpers';
import iconMap from '../styles/iconMap';

class Breadcrumb extends Component {

  shouldComponentUpdate() {
    return true;
  }
  render() {
    // last item is not drawn as a hyperlink, so we can skip if there is only 1 item in breadcrumb
    if(!this.props.parents || !this.props.parents.length || this.props.parents.length < 2){
      return (
        <div></div>
      );
    }
    const lastIndex = this.props.parents.length-1;
    return (
      <ol className="breadcrumb">
        {this.props.parents.map((s,i) => {
          if (isShowable(s, this.props.currentUser)) {
            var type = s.type.replace('_s','S').replace('section_','').replace('survey_','').replace('nested_','').replace('_dropped','');

            if (i != lastIndex) {
              return (
                <li key={`${type}-${s.id}-${i}`}>{i<1 && <Link to={`/${type}s/${s.id}`}><span className={`fa ${iconMap[s.type]}`}></span></Link>} <Link to={`/${type}s/${s.id}`}>{s.name}</Link></li>
              ) 
            } else { 
              return (
                <li key={`${type}-${s.id}-${i}`}>{i<1 && <span className={`fa ${iconMap[s.type]}`}></span>} {s.name}</li>
              )
          }
        }
        })
      }
      </ol>
    );
  }
}

Breadcrumb.propTypes = {
  parents: PropTypes.array,
  currentUser: PropTypes.object
};

function mapStateToProps(state) {
  return {
    parents: state.breadcrumbPath
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({clearBreadcrumb, addBreadcrumbItem, removeBreadcrumbItem, setBreadcrumbPath }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb);
