import { describe, it, expect } from "vitest";
import { pickRound, shuffleChoices } from "../src/selector.js";

const pool = [
  { id: "a", choices: ["X", "Y", "Z"], correctIndex: 0 },
  { id: "b", choices: ["X", "Y", "Z"], correctIndex: 1 },
  { id: "c", choices: ["X", "Y", "Z"], correctIndex: 2 },
];

/** Deterministic rng that cycles through the given values. */
function seq(values) {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("pickRound", () => {
  it("throws on an empty or non-array pool", () => {
    expect(() => pickRound([])).toThrow();
    expect(() => pickRound(null)).toThrow();
  });

  it("returns an entry from the pool", () => {
    const r = pickRound(pool, null, seq([0]));
    expect(pool).toContain(r);
  });

  it("uses rng to index into the candidate list", () => {
    expect(pickRound(pool, null, seq([0])).id).toBe("a");
    // rng ~0.99 -> last of 3 candidates
    expect(pickRound(pool, null, seq([0.99])).id).toBe("c");
  });

  it("never returns lastId when other choices exist", () => {
    for (let i = 0; i < 300; i++) {
      const r = pickRound(pool, "b");
      expect(r.id).not.toBe("b");
    }
  });

  it("excludes lastId from the candidate set (index maps over remainder)", () => {
    // lastId 'a' removed -> candidates [b, c]; rng 0 -> b
    expect(pickRound(pool, "a", seq([0])).id).toBe("b");
    expect(pickRound(pool, "a", seq([0.99])).id).toBe("c");
  });

  it("relaxes the constraint for a single-entry pool", () => {
    const single = [{ id: "only", choices: ["X", "Y", "Z"], correctIndex: 0 }];
    expect(pickRound(single, "only", seq([0])).id).toBe("only");
  });
});

describe("shuffleChoices", () => {
  it("preserves the set of choices", () => {
    const { choices } = shuffleChoices(pool[0], seq([0.5]));
    expect([...choices].sort()).toEqual(["X", "Y", "Z"]);
  });

  it("keeps correctIndex pointing at the original correct label", () => {
    const round = { choices: ["Major", "Minor", "Diminished"], correctIndex: 0 };
    for (let i = 0; i < 200; i++) {
      const out = shuffleChoices(round);
      expect(out.choices[out.correctIndex]).toBe("Major");
      expect([...out.choices].sort()).toEqual(["Diminished", "Major", "Minor"]);
    }
  });

  it("does not mutate the input round", () => {
    const round = { choices: ["X", "Y", "Z"], correctIndex: 2 };
    const snapshot = JSON.parse(JSON.stringify(round));
    shuffleChoices(round, seq([0.9, 0.1]));
    expect(round).toEqual(snapshot);
  });

  it("can produce a non-identity ordering", () => {
    // rng()=0 makes each Fisher-Yates step swap to index 0, reordering the list.
    const round = { choices: ["X", "Y", "Z"], correctIndex: 0 };
    const reordered = shuffleChoices(round, seq([0, 0]));
    expect(reordered.choices).not.toEqual(["X", "Y", "Z"]);
    expect(reordered.choices[reordered.correctIndex]).toBe("X");
  });
});
