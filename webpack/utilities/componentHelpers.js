export function isRevisable(object, currentUser) {
  return currentUser && currentUser.id &&
    object.mostRecent === object.version &&
    object.status === 'published' &&
    object.createdById === currentUser.id;
}

export function isPublishable(object, currentUser) {
  return isEditable(object, currentUser);
}

export function isEditable(object, currentUser) {
  return currentUser && currentUser.id &&
    object.mostRecent === object.version &&
    object.status === 'draft' &&
    object.createdById === currentUser.id;
}

export function isExtendable(object) {
  return object.status === 'published';
}