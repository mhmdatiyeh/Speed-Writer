/**
 * app.js
 * Composition root. The single place where modules are wired together.
 *
 * Each module here stays small and focused; the app just orchestrates.
 * If you need to swap an implementation (e.g., a different SentenceProvider
 * backed by an API), you only edit this file (Dependency Inversion in action).
 *
 * NOTE: All sibling modules attach themselves to `window.App.*`. They are
 * loaded as plain <script> tags before this file, so it works both when
 * served via http(s) and when index.html is opened directly via file://.
 */
(function (global) {
  "use strict";

  const App = global.App || (global.App = {});

  const SENTENCES_PER_TRIAL = 10;
  const POST_SENTENCE_DELAY_MS = 350;

  class TypingTrainerApp {
    constructor() {
      /* ---------- Screens ---------- */
      this.screens = new App.ScreenManager(document.querySelectorAll(".screen"));

      const self = this;

      this.startUI = new App.StartScreen(
        document.getElementById("screen-start"),
        function (lang) { self.startTraining(lang); }
      );

      this.trainUI = new App.TrainingScreen(
        document.getElementById("screen-train"),
        {
          onQuit: function () { self.quitToStart(); },
          onSkip: function () { self.skipSentence(); }
        }
      );

      this.resultsUI = new App.ResultsScreen(
        document.getElementById("screen-results"),
        { onTrainAgain: function () { self.trainAgain(); } }
      );

      /* ---------- Core services ---------- */
      this.provider = new App.SentenceProvider(App.SENTENCE_POOL);
      this.tracker  = new App.ResultsTracker();
      this.engine   = new App.TypingEngine();
      this.sound    = new App.SoundPlayer();
      this.timer    = new App.Timer({
        onTick: function (ms) { self.trainUI.setTimer(ms); },
        intervalMs: 100
      });

      this.renderer = new App.Renderer(this.trainUI.elSentence);

      /* ---------- Input ---------- */
      this.input = new App.InputController({
        hiddenInput: this.trainUI.elHiddenInput,
        focusTarget: this.trainUI.elSentenceBox,
        onChar: function (ch) { self.engine.typeChar(ch); },
        onBackspace: function () { self.engine.backspace(); },
        isActive: function () { return self.screens.isActive("train"); }
      });

      /* ---------- Engine -> UI bindings ---------- */
      this.engine
        .on("change", function (e) {
          self.renderer.render({
            target: e.target,
            typed: e.typed,
            lang: self.lang
          });
          self.trainUI.setMistakes(e.mistakes);
        })
        .on("firstKey", function () { self.timer.start(); })
        .on("complete", function () { self._onSentenceComplete(); });

      /* ---------- Trial state ---------- */
      this.lang = "en";
      this.sentences = [];
      this.currentIndex = 0;
    }

    /* ====================================================== */
    /*                     Flow control                       */
    /* ====================================================== */

    startTraining(lang) {
      this.lang = lang;
      this.sentences = this.provider.pick(lang, SENTENCES_PER_TRIAL);
      this.currentIndex = 0;
      this.tracker.reset();

      this.screens.show("train");
      this.input.enable();
      this._loadCurrentSentence();

      const self = this;
      setTimeout(function () { self.input.focus(); }, 50);
    }

    _loadCurrentSentence() {
      this.timer.reset();
      this.trainUI.setProgress(this.currentIndex, this.sentences.length);
      this.trainUI.resetStats();

      const text = this.sentences[this.currentIndex];
      this.engine.load(text);
    }

    _onSentenceComplete() {
      const elapsed = this.timer.stop();
      const perfect = this.engine.isPerfect();

      this.tracker.add({
        text: this.engine.target,
        time: elapsed,
        mistakes: this.engine.mistakes
      });

      if (perfect) this.sound.playWin();

      this.currentIndex++;
      const self = this;
      if (this.currentIndex >= this.sentences.length) {
        setTimeout(function () { self._showResults(); }, POST_SENTENCE_DELAY_MS);
      } else {
        setTimeout(function () { self._loadCurrentSentence(); }, POST_SENTENCE_DELAY_MS);
      }
    }

    skipSentence() {
      const elapsed = this.timer.stop();
      this.tracker.add({
        text: this.engine.target,
        time: elapsed,
        mistakes: this.engine.mistakes,
        skipped: true
      });

      this.currentIndex++;
      if (this.currentIndex >= this.sentences.length) {
        this._showResults();
      } else {
        this._loadCurrentSentence();
      }
    }

    quitToStart() {
      this.timer.reset();
      this.input.disable();
      this.engine.load("");
      this.renderer.clear();
      this.screens.show("start");
    }

    trainAgain() {
      this.timer.reset();
      this.input.disable();
      this.engine.load("");
      this.renderer.clear();
      this.screens.show("start");
    }

    _showResults() {
      this.trainUI.setProgressFill(100);
      this.input.disable();

      this.resultsUI.render({
        items: this.tracker.items,
        totalTime: this.tracker.totalTime,
        averageTime: this.tracker.averageTime,
        totalMistakes: this.tracker.totalMistakes,
        lang: this.lang
      });

      this.screens.show("results");
    }
  }

  /* ---------- Bootstrap ---------- */
  function boot() {
    global.__typingTrainer = new TypingTrainerApp();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  App.TypingTrainerApp = TypingTrainerApp;
})(window);
