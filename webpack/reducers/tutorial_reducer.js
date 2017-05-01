import {
  SET_STEPS
} from '../actions/types';

export default function tutorialSteps(state = [], action) {
  if (action.type === SET_STEPS) {
    return action.payload.steps;
  }
  return state;
}
