import { createSelector } from 'reselect';
import pickBy from 'lodash/pickBy';

const getResponseSets = (state) => state.responseSets;

export const getMostRecentResponseSets = createSelector(
  getResponseSets, (responseSets) => {
    return pickBy(responseSets, (rs) => rs.mostRecent === rs.version);
  }
);
