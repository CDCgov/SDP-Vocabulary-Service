import {
  SET_STEPS
} from './types';

export function setSteps(steps) {
  let newSteps = steps;
  if (!Array.isArray(newSteps)) {
    newSteps = [newSteps];
  }
  if (!newSteps.length) {
    return;
  }
  return {
    type: SET_STEPS,
    payload: {steps: newSteps}
  };
}
