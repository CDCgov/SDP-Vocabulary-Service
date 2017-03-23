import {
  FETCH_SURVEY_FULFILLED
} from '../actions/types';

import { byIdWithIndividualReducer } from './reducer_generator';

export default byIdWithIndividualReducer(null, FETCH_SURVEY_FULFILLED);
