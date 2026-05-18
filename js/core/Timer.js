/**
 * Timer
 * Single responsibility: measure elapsed time and emit periodic ticks.
 *
 * Uses performance.now() for monotonic timing (immune to system clock changes).
 * Has no UI and no knowledge of typing logic.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class Timer {
    /**
     * @param {{ onTick?: (ms: number) => void, intervalMs?: number }} options
     */
    constructor(options) {
      options = options || {};
      this._onTick = typeof options.onTick === "function" ? options.onTick : null;
      this._intervalMs = options.intervalMs || 100;
      this._startTs = null;
      this._intervalId = null;
    }

    start() {
      if (this.isRunning()) return;
      this._startTs = performance.now();
      if (this._onTick) {
        const self = this;
        this._intervalId = setInterval(function () {
          self._onTick(self.elapsed());
        }, this._intervalMs);
      }
    }

    stop() {
      const final = this.elapsed();
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
      return final;
    }

    reset() {
      this.stop();
      this._startTs = null;
    }

    elapsed() {
      if (this._startTs === null) return 0;
      return performance.now() - this._startTs;
    }

    isRunning() {
      return this._startTs !== null;
    }
  }

  global.App.Timer = Timer;
})(window);
