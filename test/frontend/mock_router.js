class MockRouter {
  constructor(state = {}) {
    this.state = state;
    this.route = '';
    this.leaveHook = null; 
  }

  setRouteLeaveHook(route, leaveHook){
    console.log('setleavehook')
    console.log(route)
    console.log(leaveHook)
    this.route = route;
    this.leaveHook = leaveHook;
  }

  getLeaveHookResponse(){
    return this.leaveHook()
  }
}

export default MockRouter;
