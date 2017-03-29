import React, { Component } from 'react';
class Home extends Component {

  render() {
    return (
      
          <div className="container">

      <div className="masthead">
        <nav>
          <ul className="nav nav-justified">
            <li className="active"><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Release Notes</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </nav>
      </div>

      <div className="jumbotron">
        <h1>CDC Vocabulary Service</h1>
        <h3 className="text-muted">Author Questions, Response Sets, and Forms</h3>

        <p className="lead">This service aims to make it easier for users to find out how other groups have asked for certain types of information, and reuse this wording for their own data collection needs.</p>
        <p><a className="btn btn-lg btn-success" href="#" role="button">Login</a></p>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <h2>What is a Vocabulary Service</h2>
          <p className="text-danger">As of v9.1.2, Safari exhibits a bug in which resizing your browser horizontally causes rendering errors in the justified nav that are cleared upon refreshing.</p>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a className="btn btn-primary" href="#" role="button">View details »</a></p>
        </div>
        <div className="col-lg-4">
          <h2>Objective</h2>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a className="btn btn-primary" href="#" role="button">View details »</a></p>
       </div>
        <div className="col-lg-4">
          <h2>Latest Release</h2>
          <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa.</p>
          <p><a className="btn btn-primary" href="#" role="button">View details »</a></p>
        </div>
      </div>

      <footer className="footer">
        <p>© 2016 Company, Inc.</p>
      </footer>

    </div> 

      
    );
  }
}

export default Home;

