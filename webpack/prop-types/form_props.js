import PropTypes from 'prop-types';

const formProps = PropTypes.shape({
  id:      PropTypes.number,
  name:    PropTypes.string,
  userId:  PropTypes.string
});

const formsProps = PropTypes.objectOf(formProps);

export { formProps, formsProps };
