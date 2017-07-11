import PropTypes from 'prop-types';

const currentUserProps = PropTypes.shape({
  id:        PropTypes.number,
  admin:     PropTypes.bool,
  publisher: PropTypes.bool,
  email:     PropTypes.string,
  firstName: PropTypes.string,
  lastName:  PropTypes.string,
  lastProgramId: PropTypes.number,
  lastSystemId:  PropTypes.number
});

export default currentUserProps;
