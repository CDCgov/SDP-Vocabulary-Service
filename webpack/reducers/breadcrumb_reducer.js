import {
  CLEAR_BREADCRUMB,
  ADD_BREADCRUMB_ITEM,
  REMOVE_BREADCRUMB_ITEM,
  SET_BREADCRUMB_PATH,
} from '../actions/types';

export default function breadcrumb(state = [], action) {
  const data = action.payload;
  switch (action.type) {
    case CLEAR_BREADCRUMB:
      return [...data.path];
    case ADD_BREADCRUMB_ITEM:
      if (state.length == 0) {
        return [data.item];
      }
      const index = state.findIndex(s => {
        return (s.id == data.item.id && s.type == data.item.type);
      });
      if (index == -1) {
        return [...state,data.item];
      } else {
        return [...state.slice(0,index),data.item];
      }
    case REMOVE_BREADCRUMB_ITEM:
      return [state.breadcrumbPath.filter(item => (item.id != data.item.id ||  item.type != data.item.type))];
    case SET_BREADCRUMB_PATH:
      return [...data.path];
    default:
      return state;
  }
}
