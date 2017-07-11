import PropTypes from 'prop-types';

const allRoutes = PropTypes.shape({
  formPath: PropTypes.func.isRequired,
  formsPath: PropTypes.func.isRequired,
  questionPath: PropTypes.func.isRequired,
  reviseQuestionPath: PropTypes.func.isRequired,
  responseSetPath: PropTypes.func.isRequired
});

export default allRoutes;
