/**
 * ScreenManager
 * Single responsibility: show one screen, hide the others.
 *
 * DOM contract: each screen element has class "screen" and a `data-screen`
 * attribute used as its name (e.g. "start", "train", "results").
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class ScreenManager {
    constructor(screenEls) {
      this._screens = new Map();
      for (let i = 0; i < screenEls.length; i++) {
        const el = screenEls[i];
        const name = el.dataset.screen;
        if (name) this._screens.set(name, el);
      }
      this._current = null;
      this._listeners = [];
    }

    onChange(fn) {
      if (typeof fn === "function") this._listeners.push(fn);
      return this;
    }

    show(name) {
      if (!this._screens.has(name)) {
        throw new Error("Unknown screen: " + name);
      }
      this._screens.forEach(function (el, n) {
        el.classList.toggle("active", n === name);
      });
      this._current = name;
      for (let i = 0; i < this._listeners.length; i++) this._listeners[i](name);
    }

    get current() { return this._current; }

    isActive(name) { return this._current === name; }
  }

  global.App.ScreenManager = ScreenManager;
})(window);
