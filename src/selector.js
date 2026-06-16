// Round selection logic. Pure functions — no DOM, no audio — so they are
// fully unit-testable in Node.
//
// TODO (milestone 6): implement and unit-test selection + shuffling.

/**
 * Pick a random round from a pool, avoiding an immediate repeat of lastId.
 * @param {object[]} pool entries for one mode
 * @param {string|null} lastId id of the previous round, or null
 * @returns {object} the chosen entry
 */
export function pickRound(pool, lastId = null) {
  throw new Error("not implemented");
}

/**
 * Return the round's choices in randomized display order plus the new index of
 * the correct answer. Does not mutate the input.
 * @param {object} round
 * @returns {{ choices: string[], correctIndex: number }}
 */
export function shuffleChoices(round) {
  throw new Error("not implemented");
}
