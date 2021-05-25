class BasicEventEmitter {

  /** @type {Map<string, Map<(...args: any[])=>void, {once: boolean}>>} */
  listeners = new Map();

  #prepareListenersMap = (eventName) => {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Map());
  }

  /**
   * @param {string} eventName 
   * @param {(...args: any[])=>void} listener
   */
  on(eventName, listener) {
    this.#prepareListenersMap(eventName);
    this.listeners.get(eventName).set(listener, {once: false});
  }

  /**
   * @param {string} eventName
   * @param {(...args: any[])=>void} listener
   */
  once(eventName, listener) {
    this.#prepareListenersMap(eventName);
    this.listeners.get(eventName).set(listener, { once: true });
  }

  /**
   * @param {string} eventName
   * @param {((...args: any[])=>void)?} listener
   */
  off(eventName, listener) {
    if (listener) {
      this.listeners.get(eventName).delete(listener);
    } else {
      this.listeners.delete(eventName)
    }
  }

  /**
   * @param {string} eventName 
   * @param  {...any} args 
   */
  emit(eventName, ...args) {
    if (!this.listeners.has(eventName)) return;
    let eventMap = this.listeners.get(eventName);
    eventMap.forEach(({ once }, listener) => {
      if (once) eventMap.delete(listener);
      listener(...args);
    });
  }

  // Aliases:
  /**
   * @param {string} eventName 
   * @param {(...args: any[])=>void} listener 
   * @param {{once: boolean}} opts 
   */
  addEventListener(eventName, listener, opts = { once: false }) {
    this[opts.once ? "once" : "on"](eventName, listener);
  }

  /**
   * @param {string} eventName 
   * @param {((...args: any[])=>void)?} listener
   */
  removeEventListener(eventName, listener) {
    this.off(eventName, listener);
  }

  // More aliases:
  /**
   * @param {string} eventName 
   * @param {(...args: any[])=>void} listener 
   * @param {{once: boolean}} opts 
   */
  addListener(eventName, listener, opts={once: false}) {
    this[opts.once ? "once" : "on"](eventName, listener);
  }

  /**
   * @param {string} eventName 
   * @param {((...args: any[])=>void)?} listener
   */
  removeListener(eventName, listener) {
    this.off(eventName, listener);
  }
}