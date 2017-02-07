import { createSelector } from 'reselect';
import _ from 'lodash';

const getResponseSets = (state) => state.responseSets;

export const getMostRecentResponseSets = createSelector(
  getResponseSets, (responseSets) => {
    return _.pickBy(responseSets, (rs) => rs.mostRecent === rs.version);
  }
);
