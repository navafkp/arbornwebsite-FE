const KEY = "arborn_preferred_size";

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
