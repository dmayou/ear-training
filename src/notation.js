// Notation renderer: draw a treble staff with a note group using VexFlow (SVG).
// Pure rendering — no game logic, no audio.
//
// TODO (milestone 3): implement rendering for sequential (intervals/scales)
// and stacked (chords) note groups.

import * as VexFlow from "vexflow";

/**
 * Render a note group onto a target element.
 * @param {HTMLElement} targetEl container to render into (cleared first)
 * @param {object} round a sequence entry: { clef, render, notes, durations }
 */
export function renderStaff(targetEl, round) {
  throw new Error("not implemented");
}
