/**
 * SoundPlayer
 * Single responsibility: play short UI sounds.
 *
 * Uses the Web Audio API to synthesize notes on the fly so the project
 * stays asset-free (no .mp3 / .wav files to ship).
 *
 * Only `playWin()` is exposed today; more sounds can be added without
 * touching callers (Open/Closed).
 *
 * Browsers require a user gesture before audio can play, so the
 * AudioContext is created lazily on the first call and resumed if needed.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class SoundPlayer {
    constructor() {
      this._ctx = null;
      this._enabled = true;
    }

    /** Globally enable or disable sounds. */
    setEnabled(flag) {
      this._enabled = Boolean(flag);
    }

    isEnabled() { return this._enabled; }

    /**
     * Play a short two-tone "win bell" when a sentence is completed perfectly.
     */
    playWin() {
      if (!this._enabled) return;
      const ctx = this._getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // A bright, friendly two-note arpeggio: C6 -> E6 -> G6.
      this._playTone(ctx, 1046.5, now,        0.18, 0.22); // C6
      this._playTone(ctx, 1318.5, now + 0.12, 0.18, 0.22); // E6
      this._playTone(ctx, 1568.0, now + 0.24, 0.30, 0.22); // G6 (held a touch longer)
    }

    /* ---------- Internals ---------- */

    _getContext() {
      try {
        if (!this._ctx) {
          const Ctor = global.AudioContext || global.webkitAudioContext;
          if (!Ctor) return null;
          this._ctx = new Ctor();
        }
        // Some browsers start the context suspended until a user gesture.
        if (this._ctx.state === "suspended" && this._ctx.resume) {
          this._ctx.resume();
        }
        return this._ctx;
      } catch (e) {
        return null;
      }
    }

    /**
     * Render a single tone with a soft attack/decay envelope so it sounds
     * pleasant rather than clicky.
     */
    _playTone(ctx, frequency, startTime, duration, peakGain) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, startTime);

      const attack = 0.015;
      const release = duration;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(peakGain, startTime + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + release);

      osc.connect(gain).connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + attack + release + 0.05);
    }
  }

  global.App.SoundPlayer = SoundPlayer;
})(window);
