import PropTypes from 'prop-types';

export const MatchPropTypes = PropTypes.shape({
  params: PropTypes.shape({}).isRequired,
});

export const HistoryPropTypes = PropTypes.shape({
  push: PropTypes.func.isRequired,
});

export const LocationPropTypes = PropTypes.shape({
  hash: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
});

export const RoutePropTypes = {
  history: HistoryPropTypes.isRequired,
  match: MatchPropTypes.isRequired,
  location: LocationPropTypes.isRequired,
};
