import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class FHIRDoc extends Component {
  render() {
    return (
      <Grid>
        <Row className="basic-bg">
          <Col md={12}>
            <div className="showpage_header_container no-print">
              <ul className="list-inline">
                <li className="showpage_button"><span className="fa fa-question-circle fa-2x" aria-hidden="true"></span></li>
                <li className="showpage_title"><h1>FHIR Documentation</h1></li>
              </ul>
            </div>
            <div className="main-content">
              <p>The Vocabulary Service provides a <a href="http://hl7.org/fhir">Fast Healthcare Interoperability Resources (FHIR)</a> API.
              This feature lets software developers create programs that can directly use information from the Vocabulary Service.
              </p>

              <p>This API is not a full implementation of the FHIR specification, rather it is a subset that is relevant to the
              features of the Vocabulary Service. The API is currently read-only and supports the JSON representation of FHIR resources.
              Other resource formats are not currently supported.
              </p>

              <h2>API Details</h2>
              <p>The main endpoint for the FHIR API is <strong>/api/fhir</strong></p>
              <p>The API supports the <a href="http://www.hl7.org/implement/standards/fhir/questionnaire.html">Questionnaire</a> resource.
              This maps to a Survey in the Vocabulary Service. Sections and questions will be included in the Questionnaire resource.
              Response Sets are made available via the <a href="http://www.hl7.org/implement/standards/fhir/valueset.html">ValueSet</a> resource.</p>
              <p>The API supports the <a href="http://www.hl7.org/implement/standards/fhir/http.html#history">history features of FHIR</a>.
              Accessing a resource via the FHIR API without using the history features will always return the most recent version of the resource.
              As an example, if there is a Survey with a version independent ID of <strong>S-1</strong>, accessing <strong>/api/fhir/Questionnaire/S-1</strong> will
              return the most recent version of that Survey. Assuming that the Survey has three versions in the service, the first version of the Survey
              can be accessed via <strong>/api/fhir/Questionnaire/S-1/_history/1</strong>. The same pattern applies to Reponse Sets.
              </p>

              <h2>FHIR Extensions</h2>
              <p>The Vocabulary Service manages information that exceeds the scope of the FHIR specification. In these cases, the specification
              allows for <a href="http://www.hl7.org/implement/standards/fhir/extensibility.html">extensibility</a>. The API implements two extensions
              to provide information that is specific to the Vocabulary Service and the needs of its users.</p>
              <p><strong>Questionnaire.item</strong> may contain two extensions.</p>
              <p>Extension with the URL <strong>https://sdp-v.services.cdc.gov/fhir/questionnaire-item-program-var</strong> represents the program
              variable for the question.</p>
              <p>Extension with the URL <strong>https://sdp-v.services.cdc.gov/fhir/questionnaire-item-meta</strong> represents the tags
              assciated with the question.</p>

              <h2>MMG import data in FHIR</h2>
              <p>If a Questionnaire was imported from an MMG, the Vocabulary Service will attempt to preserve MMG specific information.
                If a Data Element in the MMG is given a Data Element Identifier, that will be maintained in the Vocabulary Service. The
                Data Element Identifier as well as the code system, if provided, will are available in the tags extensions of <strong>Question.item</strong>.
                Additionally, the Data Element Identifier will be used as the <strong>Question.item.linkId</strong>. If there is no Data Element Identifier,
                then the Vocabulary Service generated id will be used.
              </p>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
