/**
 * StartScreen
 * Single responsibility: handle interactions on the welcome screen and
 * notify the app when the user picks a language.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class StartScreen {
    constructor(root, onLangSelect) {
      this._root = root;
      this._onLangSelect = onLangSelect;

      const buttons = this._root.querySelectorAll(".lang-btn");
      const self = this;
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const lang = btn.dataset.lang;
          if (lang) self._onLangSelect(lang);
        });
      });
    }
  }

  global.App.StartScreen = StartScreen;
})(window);
