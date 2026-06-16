// Player display / controller. Owns the DOM and the state machine:
//   mode-select -> round (render + play) -> answered (highlight + Next) -> next
// Also owns the audio-loop lifecycle (start on round display, stop on answer).
//
// TODO (milestone 7): wire the full flow using the modules below.

import { renderStaff } from "./notation.js";
import { unlock, playSequence, startAutoLoop, stopAutoLoop } from "./audio.js";
import { pools } from "./sequences.js";
import { pickRound, shuffleChoices } from "./selector.js";

const screens = {
  modeSelect: document.getElementById("mode-select"),
  round: document.getElementById("round"),
};

const els = {
  staff: document.getElementById("staff"),
  choices: document.getElementById("choices"),
  replayBtn: document.getElementById("replay-btn"),
  nextBtn: document.getElementById("next-btn"),
  backBtn: document.getElementById("back-btn"),
};

const state = {
  mode: null,
  lastId: null,
  round: null,
  answered: false,
};

// Scaffold only: confirm wiring loads. Replaced by real handlers in milestone 7.
function init() {
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("mode selected:", btn.dataset.mode);
    });
  });
  console.log("Ear Training scaffold loaded.");
}

init();
