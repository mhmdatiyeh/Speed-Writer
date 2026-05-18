/**
 * ResultsTracker
 * Single responsibility: store per-sentence results and compute aggregates.
 * No DOM, no timers, no input handling.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class ResultsTracker {
    constructor() {
      this._items = [];
    }

    reset() {
      this._items = [];
    }

    add(entry) {
      this._items.push({
        text: entry.text,
        time: Number(entry.time) || 0,
        mistakes: Number(entry.mistakes) || 0,
        skipped: Boolean(entry.skipped)
      });
    }

    get items() {
      return this._items.map(function (r) {
        return {
          text: r.text,
          time: r.time,
          mistakes: r.mistakes,
          skipped: r.skipped
        };
      });
    }

    get count() { return this._items.length; }

    get totalTime() {
      return this._items.reduce(function (s, r) { return s + r.time; }, 0);
    }

    get totalMistakes() {
      return this._items.reduce(function (s, r) { return s + r.mistakes; }, 0);
    }

    get averageTime() {
      return this.count === 0 ? 0 : this.totalTime / this.count;
    }
  }

  global.App.ResultsTracker = ResultsTracker;
})(window);
