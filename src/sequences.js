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
// Invariants enforced by tests/sequences.test.js:
//   - intervals: render "sequential", exactly 2 notes
//   - chords:    render "stacked", 3+ notes
//   - scales:    render "sequential", 2+ notes
//   - every entry: unique id, valid pitches, exactly 3 distinct choices,
//     correctIndex in range.

export const intervals = [
  { id: "int-maj3-c", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["C4", "E4"], choices: ["Major 3rd", "Minor 3rd", "Perfect 4th"], correctIndex: 0 },
  { id: "int-p5-c", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["C4", "G4"], choices: ["Perfect 5th", "Perfect 4th", "Major 6th"], correctIndex: 0 },
  { id: "int-p4-c", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["C4", "F4"], choices: ["Perfect 4th", "Major 3rd", "Perfect 5th"], correctIndex: 0 },
  { id: "int-min3-a", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["A3", "C4"], choices: ["Minor 3rd", "Major 3rd", "Major 2nd"], correctIndex: 0 },
  { id: "int-oct-c", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["C4", "C5"], choices: ["Octave", "Major 7th", "Perfect 5th"], correctIndex: 0 },
  { id: "int-maj2-c", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["C4", "D4"], choices: ["Major 2nd", "Minor 3rd", "Unison"], correctIndex: 0 },
  { id: "int-maj6-c", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["C4", "A4"], choices: ["Major 6th", "Minor 6th", "Perfect 5th"], correctIndex: 0 },
  { id: "int-min7-c", mode: "intervals", clef: "treble", render: "sequential",
    notes: ["C4", "Bb4"], choices: ["Minor 7th", "Major 7th", "Major 6th"], correctIndex: 0 },
];

export const chords = [
  { id: "chd-maj-c", mode: "chords", clef: "treble", render: "stacked",
    notes: ["C4", "E4", "G4"], choices: ["Major", "Minor", "Diminished"], correctIndex: 0 },
  { id: "chd-min-c", mode: "chords", clef: "treble", render: "stacked",
    notes: ["C4", "Eb4", "G4"], choices: ["Minor", "Major", "Augmented"], correctIndex: 0 },
  { id: "chd-dim-c", mode: "chords", clef: "treble", render: "stacked",
    notes: ["C4", "Eb4", "Gb4"], choices: ["Diminished", "Minor", "Major"], correctIndex: 0 },
  { id: "chd-aug-c", mode: "chords", clef: "treble", render: "stacked",
    notes: ["C4", "E4", "G#4"], choices: ["Augmented", "Major", "Minor"], correctIndex: 0 },
  { id: "chd-maj-d", mode: "chords", clef: "treble", render: "stacked",
    notes: ["D4", "F#4", "A4"], choices: ["Major", "Minor", "Diminished"], correctIndex: 0 },
  { id: "chd-min-a", mode: "chords", clef: "treble", render: "stacked",
    notes: ["A3", "C4", "E4"], choices: ["Minor", "Major", "Diminished"], correctIndex: 0 },
  { id: "chd-maj-g", mode: "chords", clef: "treble", render: "stacked",
    notes: ["G3", "B3", "D4"], choices: ["Major", "Augmented", "Minor"], correctIndex: 0 },
  { id: "chd-dim-b", mode: "chords", clef: "treble", render: "stacked",
    notes: ["B3", "D4", "F4"], choices: ["Diminished", "Minor", "Major"], correctIndex: 0 },
];

export const scales = [
  { id: "scl-maj-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    choices: ["Major", "Natural minor", "Chromatic"], correctIndex: 0 },
  { id: "scl-natmin-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"],
    choices: ["Natural minor", "Major", "Harmonic minor"], correctIndex: 0 },
  { id: "scl-harmin-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "B4", "C5"],
    choices: ["Harmonic minor", "Natural minor", "Major"], correctIndex: 0 },
  { id: "scl-majpent-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "E4", "G4", "A4", "C5"],
    choices: ["Major pentatonic", "Major", "Minor pentatonic"], correctIndex: 0 },
  { id: "scl-chromatic-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"],
    choices: ["Chromatic", "Whole tone", "Major"], correctIndex: 0 },
  { id: "scl-wholetone-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "E4", "F#4", "G#4", "A#4", "C5"],
    choices: ["Whole tone", "Major", "Chromatic"], correctIndex: 0 },
  { id: "scl-maj-g", mode: "scales", clef: "treble", render: "sequential",
    notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4"],
    choices: ["Major", "Natural minor", "Harmonic minor"], correctIndex: 0 },
  { id: "scl-natmin-a", mode: "scales", clef: "treble", render: "sequential",
    notes: ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"],
    choices: ["Natural minor", "Major", "Major pentatonic"], correctIndex: 0 },
  // Diatonic modes (built on C).
  { id: "scl-dorian-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "Eb4", "F4", "G4", "A4", "Bb4", "C5"],
    choices: ["Dorian", "Natural minor", "Mixolydian"], correctIndex: 0 },
  { id: "scl-phrygian-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "Db4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"],
    choices: ["Phrygian", "Natural minor", "Locrian"], correctIndex: 0 },
  { id: "scl-lydian-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5"],
    choices: ["Lydian", "Major", "Mixolydian"], correctIndex: 0 },
  { id: "scl-mixolydian-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "D4", "E4", "F4", "G4", "A4", "Bb4", "C5"],
    choices: ["Mixolydian", "Major", "Dorian"], correctIndex: 0 },
  { id: "scl-locrian-c", mode: "scales", clef: "treble", render: "sequential",
    notes: ["C4", "Db4", "Eb4", "F4", "Gb4", "Ab4", "Bb4", "C5"],
    choices: ["Locrian", "Phrygian", "Natural minor"], correctIndex: 0 },
  { id: "scl-minpent-a", mode: "scales", clef: "treble", render: "sequential",
    notes: ["A3", "C4", "D4", "E4", "G4", "A4"],
    choices: ["Minor pentatonic", "Major pentatonic", "Natural minor"], correctIndex: 0 },
];

/** Lookup pools by mode name, for the selector and controller. */
export const pools = { intervals, chords, scales };
