// Authored sequence pools, one per mode. This is the file that grows as content
// is added. Each entry is a self-contained round; answers are authored here
// (correct + 2 distractors), never computed.
//
// Entry shape:
//   {
//     id: "int-maj3-001",
//     mode: "intervals",        // "intervals" | "chords" | "scales"
//     clef: "treble",
//     render: "sequential",     // "sequential" | "stacked"
//     notes: ["C4", "E4"],      // scientific pitch notation
//     durations: ["q", "q"],    // optional; defaults to quarter notes
//     choices: ["Major 3rd", "Minor 3rd", "Perfect 4th"],
//     correctIndex: 0
//   }
//
// TODO (milestone 5): author ~5-8 entries per mode + a data-validation test.

export const intervals = [];

export const chords = [];

export const scales = [];

/** Lookup pools by mode name, for the selector and controller. */
export const pools = { intervals, chords, scales };
