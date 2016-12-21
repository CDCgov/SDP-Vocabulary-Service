import {
  ADD_QUESTION,
  REMOVE_QUESTION,
} from '../actions/types';


export default function questions(state = [], action) {
  switch (action.type) {
  case ADD_QUESTION:
    return [...state, action.payload];
  case REMOVE_QUESTION:
    return state.filter((q, index) => index != action.payload);
  default:
    return state;
  }
}
