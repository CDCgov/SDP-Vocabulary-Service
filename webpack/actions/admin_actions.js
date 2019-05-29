import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  FETCH_ADMINS,
  GRANT_ADMIN,
  REVOKE_ADMIN,
  ES_DELETE_AND_SYNC,
  ES_SYNC,
  ADD_USER_TO_GROUP,
  REMOVE_USER_FROM_GROUP,
  FETCH_GROUPS,
  FETCH_GROUPS_SURVEYS,
  CREATE_GROUP
} from './types';

export function fetchAdmins() {
  return {
    type: FETCH_ADMINS,
    payload: axios.get(routes.administratorsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function fetchGroups() {
  return {
    type: FETCH_GROUPS,
    payload: axios.get(routes.adminGroupsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function fetchGroupsSurveys() {
  return {
    type: FETCH_GROUPS_SURVEYS,
    payload: axios.get(routes.adminGroupsSurveysPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function grantAdmin(email, callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminGrantAdminPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    email: email
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: GRANT_ADMIN,
    payload: putPromise
  };
}

export function revokeAdmin(adminId, callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminRevokeAdminPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    adminId: adminId
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: REVOKE_ADMIN,
    payload: putPromise
  };
}

export function createGroup(groupName, groupDescription, successHandler=null, failureHandler=null) {
  let group = {};
  group['name'] = groupName;
  group['description'] = groupDescription;
  const authenticityToken = getCSRFToken();
  const postPromise = axios.post(routes.adminGroupsPath(),
                      {group, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }
  if (successHandler) {
    postPromise.then(successHandler);
  }
  return {
    type: CREATE_GROUP,
    payload: postPromise
  };
}

export function addUserToGroup(email, group, callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminAddUserPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    email: email, group: group
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: ADD_USER_TO_GROUP,
    payload: putPromise
  };
}

export function removeUserFromGroup(email, group, callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminRemoveUserPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    email: email, group: group
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: REMOVE_USER_FROM_GROUP,
    payload: putPromise
  };
}

export function esDeleteAndSync(callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminDeleteAndSyncPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken()
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: ES_DELETE_AND_SYNC,
    payload: putPromise
  };
}

export function esSync(callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminEsSyncPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken()
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: ES_SYNC,
    payload: putPromise
  };
}
