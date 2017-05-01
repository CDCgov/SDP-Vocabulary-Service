import {
  SET_STEPS
} from './types';

export function setSteps(steps) {
  return {
    type: SET_STEPS,
    payload: {steps: steps}
  };
}
