const dispatchIfNotPresent = (store, type, obj, dispatchAction) => {
  if (store.getState()[type] === undefined ||
      store.getState()[type][obj.id] === undefined) {
    store.dispatch({type: dispatchAction, payload: {data: obj}});
  }
};

export default dispatchIfNotPresent;
