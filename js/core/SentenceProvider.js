/**
 * SentenceProvider
 * Single responsibility: provide N random unique sentences for a given language.
 *
 * SOLID:
 *  - SRP: only deals with sentence selection, not state, UI, or timing.
 *  - DIP: depends on a `pool` object (data) injected via the constructor,
 *         so it can be tested with any pool, not tied to a global.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  class SentenceProvider {
    /**
     * @param {Record<string, string[]>} pool - language -> sentences map.
     */
    constructor(pool) {
      if (!pool || typeof pool !== "object") {
        throw new Error("SentenceProvider requires a pool object");
      }
      this._pool = pool;
    }

    /**
     * Pick `count` unique random sentences for a language.
     * If the pool has fewer entries than `count`, returns whatever exists.
     */
    pick(lang, count) {
      if (typeof count !== "number") count = 10;
      const source = this._pool[lang];
      if (!Array.isArray(source) || source.length === 0) {
        throw new Error("No sentences available for language: " + lang);
      }

      const copy = source.slice();
      const out = [];
      const n = Math.min(count, copy.length);

      while (out.length < n) {
        const i = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(i, 1)[0]);
      }
      return out;
    }
  }

  global.App.SentenceProvider = SentenceProvider;
})(window);
