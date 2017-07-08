import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';

export function move(array, from, to) {
  let copyArray = array.slice(0);
  copyArray.splice(to, 0, copyArray.splice(from, 1)[0]);
  for(var i = 0; i < copyArray.length; i++){
    copyArray[i].position = i;
  }
  return copyArray;
}

export function fetchIndividual(state, action) {
  const stateClone = Object.assign({}, state);
  stateClone[action.payload.data.id] = action.payload.data;
  return stateClone;
}

export function fetchGroup(state, action) {
  return Object.assign({}, state, keyBy(action.payload.data, 'id'));
}

export function deleteItem(state, action) {
  return omitBy(state,(v, k)=>{
    return action.payload.data.id == k;
  });
}

export function removeNestedItem(state, action, parentItemType, relationship) {
  const index  = action.payload.index;
  const parentItem = action.payload[parentItemType];
  parentItem.id = parentItem.id || 0;
  const newParentItem = Object.assign({}, parentItem);
  newParentItem[relationship].splice(index, 1);
  const newState = Object.assign({}, state);
  newState[parentItem.id] = newParentItem;
  return newState;
}

export function reorderNestedItem(state, action, parentItemType, relationship) {
  const parentItem = action.payload[parentItemType];
  const index = action.payload.index;
  const direction = action.payload.direction;
  if(index == 0  && direction == 1){
    return state;
  }
  const newParentItem = Object.assign({}, parentItem);
  newParentItem[relationship] = move(parentItem[relationship], index, index-direction);
  const newState = Object.assign({}, state);
  newState[parentItem.id || 0] = newParentItem;
  return newState;
}
