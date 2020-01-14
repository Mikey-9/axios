class Interceptor {
  constructor() {
    this._list = [];
  }

  use(fn) {
    this._list.push(fn);
  }

  list() {
    return this._list;
  }
}


export default Interceptor;