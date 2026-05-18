/**
 * Renderer
 * Single responsibility: paint a sentence into the DOM as individual
 * character spans with state classes (correct, wrong, current).
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class Renderer {
    constructor(sentenceEl) {
      this._el = sentenceEl;
    }

    render(state) {
      const target = state.target || "";
      const typed = state.typed || "";
      const isAr = state.lang === "ar";

      this._el.className = "sentence" + (isAr ? " sentence--ar" : "");
      this._el.setAttribute("dir", isAr ? "rtl" : "ltr");

      const frag = document.createDocumentFragment();

      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = ch === " " ? "\u00A0" : ch;

        if (i < typed.length) {
          if (typed[i] === ch) {
            span.classList.add("correct");
          } else {
            span.classList.add("wrong");
            if (ch === " ") span.classList.add("space");
          }
        } else if (i === typed.length) {
          span.classList.add("current");
        }

        frag.appendChild(span);
      }

      // replaceChildren is supported in all evergreen browsers.
      while (this._el.firstChild) this._el.removeChild(this._el.firstChild);
      this._el.appendChild(frag);
    }

    clear() {
      while (this._el.firstChild) this._el.removeChild(this._el.firstChild);
    }
  }

  global.App.Renderer = Renderer;
})(window);
