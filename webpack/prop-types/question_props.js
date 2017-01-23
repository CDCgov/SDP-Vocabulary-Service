import { PropTypes } from 'react';

const questionProps = PropTypes.shape({
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired
});

const questionsProps = PropTypes.objectOf(questionProps);

export {questionProps, questionsProps};
