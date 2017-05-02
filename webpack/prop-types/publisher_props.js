import { PropTypes } from 'react';

const publisherProps = PropTypes.shape({
  id:        PropTypes.number,
  email:     PropTypes.string,
  firstName: PropTypes.string,
  lastName:  PropTypes.string,
  name:  PropTypes.string
});

const publishersProps = PropTypes.objectOf(publisherProps);
export {publisherProps, publishersProps};
