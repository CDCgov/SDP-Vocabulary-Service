import { PropTypes } from 'react';

const formProps = PropTypes.shape({
  id:        PropTypes.number.isRequired,
  name:      PropTypes.string.isRequired,
  userId:    PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired
  //questions: PropTypes.arrayOf(questionsProps).isRequired,
  //createdById: PropTypes.number.isRequired
});

export default formProps;
