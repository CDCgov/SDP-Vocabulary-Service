import PropTypes from 'prop-types';

const allRoutes = PropTypes.shape({
  sectionPath: PropTypes.func.isRequired,
  sectionsPath: PropTypes.func.isRequired,
  questionPath: PropTypes.func.isRequired,
  reviseQuestionPath: PropTypes.func.isRequired,
  responseSetPath: PropTypes.func.isRequired
});

export default allRoutes;
