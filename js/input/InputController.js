/**
 * InputController
 * Single responsibility: turn raw browser input (physical keyboard +
 * hidden mobile input) into two abstract events: onChar(ch) and onBackspace().
 *
 * Why both sources?
 *  - Desktop browsers fire reliable keydown events.
 *  - Mobile soft keyboards / IME often do NOT fire usable keydowns; they only
 *    update an <input> element via the `input` event. We use a hidden input
 *    that catches those too.
 *
 * Dependency inversion: the controller is given handlers from outside, so it
 * does not know about TypingEngine, screens, or the DOM beyond the elements
 * passed in.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class InputController {
    constructor(deps) {
      this._hiddenInput = deps.hiddenInput;
      this._focusTarget = deps.focusTarget;
      this._onChar = deps.onChar;
      this._onBackspace = deps.onBackspace;
      this._isActive = deps.isActive || function () { return true; };
      this._lastInputValue = "";
      this._enabled = false;

      this._onKeyDown = this._handleKeyDown.bind(this);
      this._onInput = this._handleHiddenInput.bind(this);
      this._onBoxClick = this._handleBoxClick.bind(this);
    }

    enable() {
      if (this._enabled) return;
      document.addEventListener("keydown", this._onKeyDown);
      this._hiddenInput.addEventListener("input", this._onInput);
      this._focusTarget.addEventListener("click", this._onBoxClick);
      this._enabled = true;
    }

    disable() {
      if (!this._enabled) return;
      document.removeEventListener("keydown", this._onKeyDown);
      this._hiddenInput.removeEventListener("input", this._onInput);
      this._focusTarget.removeEventListener("click", this._onBoxClick);
      this._enabled = false;
    }

    focus() {
      this._hiddenInput.value = "";
      this._lastInputValue = "";
      this._hiddenInput.focus();
    }

    /* ---------- Internals ---------- */

    _handleKeyDown(e) {
      if (!this._isActive()) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        if (this._onBackspace) this._onBackspace();
        return;
      }

      if (e.key && e.key.length === 1) {
        e.preventDefault();
        if (this._onChar) this._onChar(e.key);
      }
    }

    _handleHiddenInput(e) {
      if (!this._isActive()) return;
      const v = e.target.value;

      if (v.length > this._lastInputValue.length) {
        const added = v.slice(this._lastInputValue.length);
        for (let i = 0; i < added.length; i++) {
          if (this._onChar) this._onChar(added[i]);
        }
      } else if (v.length < this._lastInputValue.length) {
        const removed = this._lastInputValue.length - v.length;
        for (let i = 0; i < removed; i++) {
          if (this._onBackspace) this._onBackspace();
        }
      }

      this._lastInputValue = v;

      if (v.length > 200) {
        e.target.value = "";
        this._lastInputValue = "";
      }
    }

    _handleBoxClick() {
      if (!this._isActive()) return;
      this._hiddenInput.focus();
    }
  }

  global.App.InputController = InputController;
})(window);
