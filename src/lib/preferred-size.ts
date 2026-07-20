const KEY = "arborn_preferred_size";
const DECISION_KEY = "arborn_size_decision_made";
const DECISION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function getPreferredSizes(): number[] {
  try {
    const val = localStorage.getItem(KEY);
    return val ? val.split(",").map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}

export function setPreferredSizes(sizes: number[]) {
  try {
    if (sizes.length === 0) {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, sizes.join(","));
    }
  } catch {
    // ignore write failures (e.g. private browsing)
  }
}

export function clearPreferredSize() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore write failures (e.g. private browsing)
  }
}

// Set once the user picks a size or explicitly skips on /select-size — as
// opposed to just having visited the app — so the intro page only stops
// reappearing after that real decision. It expires after DECISION_TTL_MS so
// someone returning after a long gap sees the intro + size flow again.
export function hasMadeSizeDecision(): boolean {
  try {
    const storedAt = Number(localStorage.getItem(DECISION_KEY));
    return Boolean(storedAt) && Date.now() - storedAt < DECISION_TTL_MS;
  } catch {
    return false;
  }
}

export function markSizeDecisionMade() {
  try {
    localStorage.setItem(DECISION_KEY, String(Date.now()));
  } catch {
    // ignore write failures (e.g. private browsing)
  }
}
