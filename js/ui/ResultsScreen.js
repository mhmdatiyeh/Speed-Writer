/**
 * ResultsScreen
 * Single responsibility: render the summary cards and per-sentence
 * breakdown, and emit a "train again" event.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  function fmt(ms) {
    return (ms / 1000).toFixed(1) + "s";
  }

  class ResultsScreen {
    constructor(root, handlers) {
      this._root = root;
      handlers = handlers || {};

      this.elTotal = root.querySelector("#sum-total");
      this.elAvg   = root.querySelector("#sum-avg");
      this.elMiss  = root.querySelector("#sum-miss");
      this.elRows  = root.querySelector("#breakdown-rows");

      const onTrainAgain = handlers.onTrainAgain;
      root.querySelector("#btn-again").addEventListener("click", function () {
        if (onTrainAgain) onTrainAgain();
      });
    }

    render(data) {
      const items = data.items || [];
      const lang = data.lang;

      this.elTotal.textContent = fmt(data.totalTime || 0);
      this.elAvg.textContent   = fmt(data.averageTime || 0);
      this.elMiss.textContent  = String(data.totalMistakes || 0);

      const frag = document.createDocumentFragment();

      for (let i = 0; i < items.length; i++) {
        const r = items[i];
        const row = document.createElement("div");
        row.className = "row" + (lang === "ar" ? " row--ar" : "");

        const num = document.createElement("div");
        num.className = "row__num";
        num.textContent = String(i + 1);

        const text = document.createElement("div");
        text.className = "row__text";
        text.title = r.text;
        text.textContent = r.text + (r.skipped ? "  (skipped)" : "");

        const time = document.createElement("div");
        time.className = "row__time";
        time.textContent = fmt(r.time);

        const miss = document.createElement("div");
        miss.className = "row__miss";
        miss.textContent = "✗ " + r.mistakes;

        row.appendChild(num);
        row.appendChild(text);
        row.appendChild(time);
        row.appendChild(miss);
        frag.appendChild(row);
      }

      while (this.elRows.firstChild) this.elRows.removeChild(this.elRows.firstChild);
      this.elRows.appendChild(frag);
    }
  }

  global.App.ResultsScreen = ResultsScreen;
})(window);
