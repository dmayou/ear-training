import { describe, it, expect } from "vitest";
import { parsePitch, sciToVexFlow, sciToTone } from "../src/pitch.js";

describe("parsePitch", () => {
  it("parses a natural note", () => {
    expect(parsePitch("C4")).toEqual({ letter: "C", accidental: "", octave: 4 });
  });

  it("parses sharps and flats", () => {
    expect(parsePitch("F#4")).toEqual({ letter: "F", accidental: "#", octave: 4 });
    expect(parsePitch("Bb3")).toEqual({ letter: "B", accidental: "b", octave: 3 });
  });

  it("parses double accidentals", () => {
    expect(parsePitch("C##5")).toEqual({ letter: "C", accidental: "##", octave: 5 });
    expect(parsePitch("Ebb2")).toEqual({ letter: "E", accidental: "bb", octave: 2 });
  });

  it("normalizes lowercase letters to uppercase", () => {
    expect(parsePitch("g#4")).toEqual({ letter: "G", accidental: "#", octave: 4 });
  });

  it("handles zero and negative octaves", () => {
    expect(parsePitch("A0")).toEqual({ letter: "A", accidental: "", octave: 0 });
    expect(parsePitch("C-1")).toEqual({ letter: "C", accidental: "", octave: -1 });
  });

  it("trims surrounding whitespace", () => {
    expect(parsePitch("  D5 ")).toEqual({ letter: "D", accidental: "", octave: 5 });
  });

  it("throws on non-string input", () => {
    expect(() => parsePitch(null)).toThrow(TypeError);
    expect(() => parsePitch(440)).toThrow(TypeError);
  });

  it("throws on malformed pitch strings", () => {
    expect(() => parsePitch("")).toThrow();
    expect(() => parsePitch("H4")).toThrow(); // no such letter
    expect(() => parsePitch("C")).toThrow(); // missing octave
    expect(() => parsePitch("C#b4")).toThrow(); // mixed accidentals
    expect(() => parsePitch("###C4")).toThrow();
    expect(() => parsePitch("Cx4")).toThrow(); // 'x' double-sharp not supported
  });
});

describe("sciToVexFlow", () => {
  it("lowercases the letter and slashes the octave", () => {
    expect(sciToVexFlow("C4")).toBe("c/4");
    expect(sciToVexFlow("F#4")).toBe("f#/4");
    expect(sciToVexFlow("Bb3")).toBe("bb/3");
    expect(sciToVexFlow("C##5")).toBe("c##/5");
  });

  it("accepts lowercase input", () => {
    expect(sciToVexFlow("a4")).toBe("a/4");
  });

  it("propagates parse errors", () => {
    expect(() => sciToVexFlow("nope")).toThrow();
  });
});

describe("sciToTone", () => {
  it("canonicalizes to uppercase scientific notation", () => {
    expect(sciToTone("c4")).toBe("C4");
    expect(sciToTone("f#4")).toBe("F#4");
    expect(sciToTone("  bb3 ")).toBe("Bb3");
  });

  it("propagates parse errors", () => {
    expect(() => sciToTone("X9")).toThrow();
  });
});
