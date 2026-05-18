/**
 * TypingEngine
 * Single responsibility: own the typing state for ONE sentence.
 *
 * Knows: the target text, what the user has typed, whether complete.
 * Mistakes are derived on demand from the current state, NOT accumulated,
 * so corrections via Backspace remove mistakes from the count.
 *
 * Does NOT know about DOM, timers, or screens.
 *
 * Tiny event API:
 *   on('change',   fn)  -> after every typed/backspace
 *   on('firstKey', fn)  -> first character of a new sentence
 *   on('complete', fn)  -> sentence finished
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class TypingEngine {
    constructor() {
      this._target = "";
      this._typed = "";
      this._firedFirstKey = false;
      this._listeners = { change: [], complete: [], firstKey: [] };
    }

    /* ---------- Configuration ---------- */

    load(target) {
      this._target = String(target == null ? "" : target);
      this._typed = "";
      this._firedFirstKey = false;
      this._emit("change");
    }

    /* ---------- Input ---------- */

    typeChar(ch) {
      if (this.isComplete()) return;
      if (typeof ch !== "string" || ch.length !== 1) return;

      if (!this._firedFirstKey) {
        this._firedFirstKey = true;
        this._emit("firstKey");
      }

      this._typed += ch;

      this._emit("change");
      if (this.isComplete()) this._emit("complete");
    }

    backspace() {
      if (this._typed.length === 0) return;
      this._typed = this._typed.slice(0, -1);
      this._emit("change");
    }

    /* ---------- Inspection ---------- */

    get target() { return this._target; }
    get typed() { return this._typed; }

    /**
     * Mistakes counted only on characters that are STILL wrong right now.
     * Pressing Backspace and re-typing the correct letter removes the mistake
     * from the count.
     */
    get mistakes() {
      let count = 0;
      const len = Math.min(this._typed.length, this._target.length);
      for (let i = 0; i < len; i++) {
        if (this._typed[i] !== this._target[i]) count++;
      }
      return count;
    }

    /** True only when the entire sentence is typed AND every char is correct. */
    isPerfect() {
      return this.isComplete() && this.mistakes === 0;
    }

    isComplete() {
      return this._typed.length >= this._target.length && this._target.length > 0;
    }

    /* ---------- Tiny event bus ---------- */

    on(event, fn) {
      if (this._listeners[event]) this._listeners[event].push(fn);
      return this;
    }

    _emit(event) {
      const list = this._listeners[event];
      if (!list) return;
      for (let i = 0; i < list.length; i++) list[i](this);
    }
  }

  global.App.TypingEngine = TypingEngine;
})(window);
