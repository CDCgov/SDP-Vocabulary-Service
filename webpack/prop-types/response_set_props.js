import PropTypes from 'prop-types';

const responseProps = PropTypes.shape({
  id:      PropTypes.number,
  code:    PropTypes.string,
  system:  PropTypes.string,
  display: PropTypes.string
});

const responseSetProps = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  oid: PropTypes.string,
  versionIndependentId: PropTypes.string,
  version: PropTypes.number,
  parent: PropTypes.object,
  responses: PropTypes.arrayOf(responseProps),
  surveillancePrograms: PropTypes.arrayOf(PropTypes.object),
  surveillanceSystems: PropTypes.arrayOf(PropTypes.object),
});

const responseSetsProps = PropTypes.objectOf(responseSetProps);

export {responseSetProps, responseProps, responseSetsProps};
