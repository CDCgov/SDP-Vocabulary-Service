export function isRevisable(object, currentUser) {
  return currentUser && currentUser.id &&
    object.mostRecent === object.version &&
    object.status === 'published' &&
    (object.createdById === currentUser.id ||
      (currentUser.groups && object.groups && currentUser.groups.filter((group) => object.groups.map(g => g.id).includes(group.id)).length > 0)
    );
}

export function isPublishable(object, currentUser) {
  return currentUser && currentUser.id &&
    object.mostRecent === object.version &&
    object.status === 'draft' &&
    currentUser.publisher;
}

export function isRetirable(object, currentUser) {
  return currentUser && currentUser.id &&
    object.status === 'published' &&
    object.contentStage !== 'Retired' &&
    currentUser.publisher;
}

export function isEditable(object, currentUser) {
  return currentUser && currentUser.id &&
    object.mostRecent === object.version &&
    object.status === 'draft' &&
    (object.createdById === currentUser.id ||
      (currentUser.groups && object.groups && currentUser.groups.filter((group) => object.groups.map(g => g.id).includes(group.id)).length > 0)
    );
}

export function isGroupable(object, currentUser) {
  return currentUser && currentUser.id && currentUser.author && currentUser.groups &&
  (object.createdById === currentUser.id ||
    (currentUser.groups && object.groups && currentUser.groups.filter((group) => object.groups.map(g => g.id).includes(group.id)).length > 0)
  );
}

export function isSimpleEditable(object, currentUser) {
  return currentUser && currentUser.id &&
  (object.createdById === currentUser.id ||
    (currentUser.groups && object.groups && currentUser.groups.filter((group) => object.groups.map(g => g.id).includes(group.id)).length > 0)
  );
}

export function isShowable(object, currentUser) {
  return object.status === 'published' || (currentUser && currentUser.publisher) || isSimpleEditable(object, currentUser);
}

export function isExtendable(object, currentUser) {
  return currentUser && currentUser.id &&
    object.status === 'published';
}

export function displayVersion(currentVersion, mostRecent) {
// Commented out by zoo3 (Chris Sandlin) on 5/17/2019.
// Description: Updated Search Result to return 'version of version' for ease
// of user readability.
  // if (currentVersion) {
  //   if (mostRecent && mostRecent > currentVersion) {
  //     return `${currentVersion} of ${mostRecent}`;
  //   } else {
      return `${currentVersion} of ${mostRecent}`;
    // }
  // }
}
