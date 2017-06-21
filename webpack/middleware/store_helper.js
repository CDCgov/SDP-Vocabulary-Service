const dispatchIfNotPresent = (store, type, obj, dispatchAction) => {
  if (store.getState()[type] === undefined ||
      store.getState()[type][obj.id] === undefined ||
      store.getState()[type][obj.id]['fromMiddleware'] === true) {
    store.dispatch({type: dispatchAction, payload: {data: obj}});
  }
};

const dispatchCollectionMembersIfNotPresent = (store, type, collection, dispatchAction) => {
  let membersNotInStore = [];
  collection.forEach((obj) => {
    if (store.getState()[type] === undefined ||
        store.getState()[type][obj.id] === undefined ||
        store.getState()[type][obj.id]['fromMiddleware'] === true) {
      membersNotInStore.push(obj);
    }
  });
  if (membersNotInStore.length > 0) {
    store.dispatch({type: dispatchAction, payload: {data: membersNotInStore}});
  }
};

export {dispatchIfNotPresent, dispatchCollectionMembersIfNotPresent};
