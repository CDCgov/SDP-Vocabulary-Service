import { PropTypes } from 'react';

const surveillanceSystemProps = PropTypes.shape({
  id:          PropTypes.number.isRequired,
  name:        PropTypes.string.isRequired,
  description: PropTypes.string,
  acronym:     PropTypes.string
});

const surveillanceSystemsProps = PropTypes.objectOf(surveillanceSystemProps);

export {surveillanceSystemProps, surveillanceSystemsProps};
