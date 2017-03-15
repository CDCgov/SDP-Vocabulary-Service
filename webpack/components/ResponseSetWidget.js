import React, { Component } from 'react';
import { Link } from 'react-router';
import { responseSetProps } from '../prop-types/response_set_props';
import routes from '../routes';

export default class ResponseSetWidget extends Component {
  render() {
    return (
      <div className="response-set-group" id={"response_set_id_"+this.props.responseSet.id}>
        <div className="response-set-name">
          <div className="response-set-container">
            <ul className="list-inline">
              <li>
                <Link to={'/responseSets/' + this.props.responseSet.id}>
                  {this.props.responseSet.name}
                </Link>
              </li>
              <li className="pull-right"><a><span className="fa fa-question-circle-o"></span></a></li>
            </ul>
          </div>

          <div className="response-set-details">
            <ul className="list-inline response-set-items">
              <li className="reponse-set-id">{this.props.responseSet.description}</li>
              <li className="pull-right response-set-menu">
                <div className="dropdown">
                  <a id={"response_set_"+this.props.responseSet.id+"_menu"} className="dropdown-toggle" type="" data-toggle="dropdown" role="navigation">
                    <span className="fa fa-ellipsis-h"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right" >
                    {this.props.responseSet.status && this.props.responseSet.status === 'published' && <li>
                      <Link to={`/responseSets/${this.props.responseSet.id}/revise`}>Revise</Link>
                    </li>}
                    {this.props.responseSet.status && this.props.responseSet.status === 'published' && <li>
                      <Link to={`/responseSets/${this.props.responseSet.id}/extend`}>Extend</Link>
                    </li>}
                    {this.props.responseSet.status && this.props.responseSet.status === 'draft' && <li>
                      <Link to={`/responseSets/${this.props.responseSet.id}/edit`}>Edit</Link>
                    </li>}
                    <li>
                      <Link to={`/responseSets/${this.props.responseSet.id}`}>
                        Details
                      </Link>
                    </li>
                    <li>
                      <a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href={routes.responseSetPath(this.props.responseSet)}>Delete</a>
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
  responseSet: responseSetProps
};
