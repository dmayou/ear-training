import { describe, it, expect } from "vitest";
import { pools, intervals, chords, scales } from "../src/sequences.js";
import { parsePitch } from "../src/pitch.js";

const KNOWN_MODES = ["intervals", "chords", "scales"];
const allRounds = Object.values(pools).flat();

describe("pools wiring", () => {
  it("maps each mode key to its exported pool", () => {
    expect(pools.intervals).toBe(intervals);
    expect(pools.chords).toBe(chords);
    expect(pools.scales).toBe(scales);
    expect(Object.keys(pools).sort()).toEqual([...KNOWN_MODES].sort());
  });

  it("has content in every pool", () => {
    for (const mode of KNOWN_MODES) {
      expect(pools[mode].length).toBeGreaterThan(0);
    }
  });
});

describe("every round is structurally valid", () => {
  it("has globally unique ids", () => {
    const ids = allRounds.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(allRounds.map((r) => [r.id, r]))("%s passes all invariants", (_id, round) => {
    // id
    expect(typeof round.id).toBe("string");
    expect(round.id.length).toBeGreaterThan(0);

    // mode matches the pool it lives in
    expect(KNOWN_MODES).toContain(round.mode);
    expect(pools[round.mode]).toContain(round);

    // clef
    expect(round.clef).toBe("treble");

    // notes: non-empty, all parseable scientific pitches
    expect(Array.isArray(round.notes)).toBe(true);
    expect(round.notes.length).toBeGreaterThan(0);
    for (const note of round.notes) {
      expect(() => parsePitch(note)).not.toThrow();
    }

    // durations, if present, line up with notes
    if (round.durations !== undefined) {
      expect(round.durations).toHaveLength(round.notes.length);
    }

    // choices: exactly 3, all non-empty strings, all distinct
    expect(round.choices).toHaveLength(3);
    for (const choice of round.choices) {
      expect(typeof choice).toBe("string");
      expect(choice.length).toBeGreaterThan(0);
    }
    expect(new Set(round.choices).size).toBe(3);

    // correctIndex points at a real choice
    expect(Number.isInteger(round.correctIndex)).toBe(true);
    expect(round.correctIndex).toBeGreaterThanOrEqual(0);
    expect(round.correctIndex).toBeLessThan(round.choices.length);
    expect(typeof round.choices[round.correctIndex]).toBe("string");
  });
});

describe("per-mode invariants", () => {
  it("intervals are sequential with exactly two notes", () => {
    for (const r of intervals) {
      expect(r.render).toBe("sequential");
      expect(r.notes).toHaveLength(2);
    }
  });

  it("chords are stacked with three or more notes", () => {
    for (const r of chords) {
      expect(r.render).toBe("stacked");
      expect(r.notes.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("scales are sequential with two or more notes", () => {
    for (const r of scales) {
      expect(r.render).toBe("sequential");
      expect(r.notes.length).toBeGreaterThanOrEqual(2);
    }
  });
});
