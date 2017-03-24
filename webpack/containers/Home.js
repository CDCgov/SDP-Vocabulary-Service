import React, { Component } from 'react';
class Home extends Component {

  render() {
    return (
      <div className="site-wrapper">

      <div className="site-wrapper-inner">

        <div className="cover-container">

      
          <div className="inner cover">
            <h1 className="cover-heading">CDC Vocabulary Service</h1>
            
            <h3 className="tagline">Author Questions, Response Sets, and Forms</h3>

            <p className="lead">

          This service aims to make it easier for users to find out how other groups have asked for certain types of information, and reuse this wording for their own data collection needs. </p>
            <p className="lead">
              <a href="#" className="btn btn-lg btn-default">Login</a>
            </p>
            
          </div>
          
          <div className="cover-containe">
            <ul className="list-inline">
              <li>Author Content</li>
              <li>Collaborate</li>
              <li>Build</li>
            </ul>
          </div>

          <div className="mastfoot">
            <div className="inner">
            <p> 2016 Centers for Disease Control and Prevention. All rights reserved. Privacy Security Terms of Service</p>	
            </div>
          </div>

        </div>

      </div>

    </div>    
    );
  }
}

export default Home;

