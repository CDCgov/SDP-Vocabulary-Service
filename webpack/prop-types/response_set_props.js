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
  coded: PropTypes.boolean,
  versionIndependentId: PropTypes.string,
  version: PropTypes.number,
  parentId: PropTypes.number,
  responses: PropTypes.arrayOf(responseProps)
});

export {responseSetProps, responseProps};
