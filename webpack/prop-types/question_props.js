import PropTypes from 'prop-types';

const questionProps = PropTypes.shape({
  id: PropTypes.number,
  content: PropTypes.string,
  otherAllowed: PropTypes.boolean
});

const questionsProps = PropTypes.objectOf(questionProps);

export {questionProps, questionsProps};
