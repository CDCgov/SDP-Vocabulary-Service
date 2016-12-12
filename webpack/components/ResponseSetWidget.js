import React, { Component, PropTypes } from 'react';

export default class ResponseSetWidget extends Component {
  render() {
    return (
      <div className="response-set-group" id={"response_set_id_"+this.props.response_set.id}>
        <div className="response-set-name">
          <div className="response-set-container">
            <ul className="list-inline">
              <li>{this.props.response_set.name}</li>
              <li className="pull-right"><a><span className="glyphicon glyphicon-question-sign"></span></a></li>
            </ul>
          </div>

          <div className="response-set-details">
            <ul className="list-inline response-set-items">
              <li className="reponse-set-id">{this.props.response_set.description}</li>
              <li className="pull-right response-set-menu">
                <div className="dropdown">
                  <a id={"response_set_"+this.props.response_set.id+"_menu"} className="dropdown-toggle" type="" data-toggle="dropdown" role="navigation">
                    <span className="glyphicon glyphicon-option-horizontal"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right" >
                    <li>
                      <a href={this.props.routes.revise_response_set_path(this.props.response_set)}>Revise</a>
                    </li>
                    <li>
                      <a href={this.props.routes.extend_response_set_path(this.props.response_set)}>Extend</a>
                    </li>
                    <li>
                      <a href={this.props.routes.response_set_path(this.props.response_set)}>Details</a>
                    </li>
                    <li>
                      <a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href={this.props.routes.response_set_path(this.props.response_set)}>Delete</a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    );
  }
}

ResponseSetWidget.propTypes = {
  response_set: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }),
  routes: PropTypes.shape({
    response_set_path: PropTypes.func.isRequired,
    extend_response_set_path: PropTypes.func.isRequired,
    revise_response_set_path: PropTypes.func.isRequired
  })
};