import { PropTypes } from 'react';

const currentUserProps = PropTypes.shape({
  id:        PropTypes.number,
  admin:     PropTypes.bool,
  email:     PropTypes.string,
  firstName: PropTypes.string,
  lastName:  PropTypes.string,
  lastProgramId: PropTypes.number,
  lastSystemId: PropTypes.number
});

export default currentUserProps;
