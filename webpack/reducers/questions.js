import {
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION
} from '../actions/types';

let move = function(array, from, to) {
  let copyArray = array.slice(0);
  copyArray.splice(to, 0, copyArray.splice(from, 1)[0]);
  return copyArray;
};

export default function questions(state = [], action) {
  switch (action.type) {
    case ADD_QUESTION:
      return [...state, action.payload];
    case REMOVE_QUESTION:
      return state.filter((q, index) => index != action.payload);
    case REORDER_QUESTION:
      let {index, direction} = action.payload;
      return state = move(state, index, index - direction);

    default:
      return state;
  }
}
