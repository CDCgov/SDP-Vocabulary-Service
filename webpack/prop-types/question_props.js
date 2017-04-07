import { PropTypes } from 'react';

const questionProps = PropTypes.shape({
  id: PropTypes.number,
  content: PropTypes.string,
  otherAllowed: PropTypes.boolean,
  harmonized: PropTypes.boolean
});

const questionsProps = PropTypes.objectOf(questionProps);

export {questionProps, questionsProps};
