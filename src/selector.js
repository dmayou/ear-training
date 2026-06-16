// Round selection logic. Pure functions — no DOM, no audio — so they are
// fully unit-testable in Node. Randomness is injectable (rng param) so tests
// can be deterministic; defaults to Math.random in the app.

/**
 * Pick a random round from a pool, avoiding an immediate repeat of lastId.
 * If the pool has only one entry (or every entry shares lastId), that
 * constraint is relaxed rather than returning nothing.
 * @param {object[]} pool entries for one mode
 * @param {string|null} lastId id of the previous round, or null
 * @param {() => number} rng random source in [0, 1); defaults to Math.random
 * @returns {object} the chosen entry
 */
export function pickRound(pool, lastId = null, rng = Math.random) {
  if (!Array.isArray(pool) || pool.length === 0) {
    throw new Error("pickRound: pool must be a non-empty array");
  }
  let candidates = pool.filter((round) => round.id !== lastId);
  if (candidates.length === 0) {
    candidates = pool; // pool was all lastId (e.g. single-entry pool)
  }
  const index = Math.floor(rng() * candidates.length);
  return candidates[index];
}

/**
 * Return the round's choices in randomized display order plus the new index of
 * the correct answer. Does not mutate the input.
 * @param {object} round a round with { choices: string[], correctIndex: number }
 * @param {() => number} rng random source in [0, 1); defaults to Math.random
 * @returns {{ choices: string[], correctIndex: number }}
 */
export function shuffleChoices(round, rng = Math.random) {
  const order = round.choices.map((_, i) => i);
  // Fisher-Yates over the index list, then map back to labels.
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    choices: order.map((i) => round.choices[i]),
    correctIndex: order.indexOf(round.correctIndex),
  };
}
