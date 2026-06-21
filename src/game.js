// Player display / controller. Owns the DOM and the state machine:
//   mode-select -> round (render + auto-loop play) -> answered (highlight + Next)
// Also owns the audio-loop lifecycle (start on round display, stop on answer).

import { renderStaff } from "./notation.js";
import { unlock, playSequence, startAutoLoop, stopAutoLoop } from "./audio.js";
import { pools } from "./sequences.js";
import { pickRound, shuffleChoices } from "./selector.js";

const screens = {
  modeSelect: document.getElementById("mode-select"),
  round: document.getElementById("round"),
};

// Round prompt per practice mode.
const PROMPTS = {
  intervals: "Which interval do you hear?",
  chords: "Which chord do you hear?",
  scales: "Which scale do you hear?",
};

// Delay before auto-advancing after a correct answer.
const AUTO_ADVANCE_MS = 1500;

const els = {
  prompt: document.getElementById("prompt"),
  staff: document.getElementById("staff"),
  choices: document.getElementById("choices"),
  actions: document.getElementById("actions"),
  replayBtn: document.getElementById("replay-btn"),
  nextBtn: document.getElementById("next-btn"),
  backBtn: document.getElementById("back-btn"),
};

const state = {
  mode: null,
  lastId: null,
  round: null,
  display: null, // { choices, correctIndex } in displayed order
  answered: false,
  advanceTimer: null, // pending auto-advance after a correct answer
};

function showScreen(name) {
  screens.modeSelect.classList.toggle("hidden", name !== "modeSelect");
  screens.round.classList.toggle("hidden", name !== "round");
}

function startRound() {
  clearTimeout(state.advanceTimer);
  state.advanceTimer = null;

  const round = pickRound(pools[state.mode], state.lastId);
  state.round = round;
  state.lastId = round.id;
  state.display = shuffleChoices(round);
  state.answered = false;

  els.prompt.textContent = PROMPTS[state.mode];
  renderStaff(els.staff, round);
  renderChoices(state.display.choices);
  els.actions.classList.add("hidden"); // action row appears only after answering

  startAutoLoop(round);
}

function renderChoices(choices) {
  els.choices.innerHTML = "";
  choices.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", () => onAnswer(i, btn));
    els.choices.appendChild(btn);
  });
}

function onAnswer(index, clickedBtn) {
  if (state.answered) return;
  state.answered = true;
  stopAutoLoop(); // selecting an answer halts the auto-replay

  const correct = state.display.correctIndex;
  const buttons = [...els.choices.querySelectorAll(".choice")];
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct"); // always highlight the answer
  });

  const isCorrect = index === correct;
  gtag('event', 'answer', {
    mode: state.mode,
    round: state.round.id,
    correct: isCorrect,
  });
  if (isCorrect) {
    // Correct: extra "you got it" cue, no buttons, auto-advance shortly.
    clickedBtn.classList.add("picked");
    state.advanceTimer = setTimeout(startRound, AUTO_ADVANCE_MS);
  } else {
    // Incorrect: mark the wrong pick and let the player listen again / advance.
    clickedBtn.classList.add("wrong");
    els.actions.classList.remove("hidden");
  }
}

function init() {
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await unlock(); // user gesture unlocks Web Audio
      state.mode = btn.dataset.mode;
      state.lastId = null;
      showScreen("round");
      startRound();
    });
  });

  // Manual replay works any time (during the loop and after answering).
  els.replayBtn.addEventListener("click", () => {
    if (state.round) playSequence(state.round);
  });

  els.nextBtn.addEventListener("click", startRound);

  els.backBtn.addEventListener("click", () => {
    clearTimeout(state.advanceTimer);
    state.advanceTimer = null;
    stopAutoLoop();
    state.round = null;
    showScreen("modeSelect");
  });
}

init();
