class MockStore {
  constructor(state = {}) {
    this.state = state;
    this.dispatchedActions = [];
  }

  dispatch(action) {
    this.dispatchedActions.push(action);
  }

  getState() {
    return this.state;
  }
}

export default MockStore;
