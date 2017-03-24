import React, { Component } from 'react';
class Help extends Component {

  render() {
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
		  	<div className="showpage_header_container no-print">
          <ul className="list-inline">
            <li className="showpage_button"><span className="fa fa-question-circle fa-2x" aria-hidden="true"></span></li>
            <li className="showpage_title">Help</li>
          </ul>
        </div>
				
		<div className="container">
			<div className="row">
            <div className="col-md-9">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#faq" role="tab">FAQs</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#glossary" role="tab">Glossary</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#releasenotes" role="tab">Release Notes</a>
              </li>
            </ul>
            
            <div className="tab-content">
              <div className="tab-pane active" id="faq" role="tabpanel">
                <h1 className="help-section-title">FAQs</h1>
                
                <div className="help-section">
                  <h2 className="help-section-question">Sed semper quis est et eleifend?</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et neque eu lacus tincidunt egestas. In varius nibh et sodales sollicitudin. Donec fringilla velit lorem, eu efficitur est egestas in. Aliquam at leo quis mauris fringilla euismod. Phasellus sed elit dolor. Praesent ac accumsan augue. Nunc dictum auctor aliquet. Sed semper quis est et eleifend. Ut ante ex, auctor blandit blandit no.</p>
              </div>
              
              <div className="help-section">
                  <h2 className="help-section-question">Nunc dictum auctor aliquet. Sed semper quis est et eleifend. Ut ante ex, auctor blandit blandit?</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et neque eu lacus tincidunt egestas. In varius nibh et sodales sollicitudin. Donec fringilla velit lorem, eu efficitur est egestas in. Aliquam at leo quis mauris fringilla euismod. Phasellus sed elit dolor. Praesent ac accumsan augue. Nunc dictum auctor aliquet. Sed semper quis est et eleifend. Ut ante ex, auctor blandit blandit no.</p>
              </div>

              
              <div className="help-section">
                  <h2 className="help-section-question">onec fringilla velit lorem, eu efficitur est egestas in?</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et neque eu lacus tincidunt egestas. In varius nibh et sodales sollicitudin. Donec fringilla velit lorem, eu efficitur est egestas in. Aliquam at leo quis mauris fringilla euismod. Phasellus sed elit dolor. Praesent ac accumsan augue. Nunc dictum auctor aliquet. Sed semper quis est et eleifend. Ut ante ex, auctor blandit blandit no.</p>
              </div>

              
              </div>
              <div className="tab-pane" id="glossary" role="tabpanel">
                <h1>Glossary</h1>
                <p>content</p>
              </div>
              <div className="tab-pane" id="releasenotes" role="tabpanel">
                <h1>Release Notes</h1>
                <p>content</p>
              </div>
            </div>
				
				</div>
					</div>		
			</div>
	
	
		  	
          </div>
        </div>
      </div>
    );
  }
}

export default Help;

