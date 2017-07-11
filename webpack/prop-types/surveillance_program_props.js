import PropTypes from 'prop-types';

const surveillanceProgramProps = PropTypes.shape({
  id:          PropTypes.number.isRequired,
  name:        PropTypes.string.isRequired,
  description: PropTypes.string,
  acronym:     PropTypes.string
});

const surveillanceProgramsProps = PropTypes.objectOf(surveillanceProgramProps);

export {surveillanceProgramProps, surveillanceProgramsProps};
