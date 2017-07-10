import PropTypes from 'prop-types';

const surveyProps = PropTypes.shape({
  id:      PropTypes.number,
  name:    PropTypes.string,
  description: PropTypes.string,
  userId:  PropTypes.string
});

const surveysProps = PropTypes.objectOf(surveyProps);

export { surveyProps, surveysProps };
