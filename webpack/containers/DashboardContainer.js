import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchStats } from '../actions/landing';

class DashboardContainer extends Component {
  componentWillMount() {
    this.props.fetchStats();
  }

  render() {
    return (
    <div className="conatiner">
      <div className="row dashboard">
        <div className="col-md-8 dashboard-details">
          <div className="row">
            <div className="col-md-12">
              {this.analyticsGroup()}
            </div>
          </div>

          <div id="search-widget">
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-activity">
            {this.recentItems()}
            {this.activityPanel()}
          </div>
        </div>
      </div>
    </div>);
  }

  analyticsGroup() {
    return (
    <div className="analytics-group">
      <ul className="analytics-list-group">
        <li className="analytics-list-item">
          <Link to="/questions">
            <i className="fa fa-question-circle fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.questionCount}</p>
            <h2 className="item-title">Questions</h2>
          </Link>
        </li>
        <li className="analytics-list-item">
          <Link to="/responseSets">
            <i className="fa fa-list fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.responseSetCount}</p>
            <h2 className="item-title">Response Sets</h2>
          </Link>
          </li>
        <li className="analytics-list-item">
          <Link to="/forms">
            <i className="fa fa-clipboard fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.formCount}</p>
            <h2 className="item-title">Forms</h2>
          </Link>
          </li>
      </ul>
    </div>);
  }

  recentItems() {
    return (
      <div className="recent-items-panel">
        <div className="recent-items-heading">Recent Items</div>
        <div className="recent-items-body">
          <ul className="list-group">
            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-list recent-items-icon" aria-hidden="true"></i></div>
              <div className="recent-items-value">{this.props.responseSetCount} Response Sets</div>
            </li>

            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-question-circle recent-items-icon" aria-hidden="true"></i></div>
              <div className="recent-items-value">{this.props.questionCount} Questions</div>
            </li>

            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-clipboard recent-items-icon" aria-hidden="true"></i></div>
              <div className="recent-items-value">{this.props.formCount} Forms</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  activityPanel() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">System Activity</div>
        <div className="panel-body">
          <ul className="list-group">
            <li className="list-group-item">Activity 1</li>
            <li className="list-group-item">Activity 2</li>
            <li className="list-group-item">Activity 3</li>
            <li className="list-group-item">Activity 4</li>
            <li className="list-group-item">Activity 4</li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    formCount: state.stats.formCount,
    questionCount: state.stats.questionCount,
    responseSetCount: state.stats.responseSetCount
  };
}

DashboardContainer.propTypes = {
  formCount: PropTypes.number,
  questionCount: PropTypes.number,
  responseSetCount: PropTypes.number,
  fetchStats: PropTypes.func
};

export default connect(mapStateToProps, {fetchStats})(DashboardContainer);
