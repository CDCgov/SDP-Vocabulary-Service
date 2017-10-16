import PropTypes from 'prop-types';

const sectionProps = PropTypes.shape({
  id:      PropTypes.number,
  name:    PropTypes.string,
  userId:  PropTypes.string
});

const sectionsProps = PropTypes.objectOf(sectionProps);

export { sectionProps, sectionsProps };
