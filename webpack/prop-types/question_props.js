import { PropTypes } from 'react';

const questionProps = PropTypes.shape({
  id: PropTypes.number,
  content: PropTypes.string
});

const questionsProps = PropTypes.objectOf(questionProps);

export {questionProps, questionsProps};
