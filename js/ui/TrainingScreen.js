/**
 * TrainingScreen
 * Single responsibility: own all DOM elements that belong to the training
 * screen and expose narrow methods the app uses to update them.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class TrainingScreen {
    constructor(root, handlers) {
      this._root = root;
      handlers = handlers || {};

      this.elSentence    = root.querySelector("#sentence");
      this.elSentenceBox = root.querySelector("#sentence-box");
      this.elHiddenInput = root.querySelector("#hidden-input");
      this.elProgCurrent = root.querySelector("#prog-current");
      this.elProgTotal   = root.querySelector("#prog-total");
      this.elProgFill    = root.querySelector("#prog-fill");
      this.elTimer       = root.querySelector("#stat-timer");
      this.elMistakes    = root.querySelector("#stat-mistakes");

      const onQuit = handlers.onQuit;
      const onSkip = handlers.onSkip;

      root.querySelector("#btn-quit").addEventListener("click", function () {
        if (onQuit) onQuit();
      });
      root.querySelector("#btn-skip").addEventListener("click", function () {
        if (onSkip) onSkip();
      });
    }

    setProgress(currentIndex, total) {
      this.elProgCurrent.textContent = String(currentIndex + 1);
      this.elProgTotal.textContent = String(total);
      const pct = (currentIndex / total) * 100;
      this.elProgFill.style.width = pct + "%";
    }

    setProgressFill(percent) {
      this.elProgFill.style.width = percent + "%";
    }

    setTimer(ms) {
      this.elTimer.textContent = (ms / 1000).toFixed(1) + "s";
    }

    setMistakes(count) {
      this.elMistakes.textContent = String(count);
    }

    resetStats() {
      this.setTimer(0);
      this.setMistakes(0);
    }
  }

  global.App.TrainingScreen = TrainingScreen;
})(window);
