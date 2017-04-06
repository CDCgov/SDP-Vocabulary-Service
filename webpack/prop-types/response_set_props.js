import { PropTypes } from 'react';

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
  coded: PropTypes.bool,
  versionIndependentId: PropTypes.string,
  version: PropTypes.number,
  parent: PropTypes.object,
  responses: PropTypes.arrayOf(responseProps),
  surveillancePrograms: PropTypes.arrayOf(PropTypes.string),
  surveillanceSystems: PropTypes.arrayOf(PropTypes.string),
});

const responseSetsProps = PropTypes.objectOf(responseSetProps);

export {responseSetProps, responseProps, responseSetsProps};
