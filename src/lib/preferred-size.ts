const KEY = "arborn_preferred_size";

export function getPreferredSize(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setPreferredSize(size: string) {
  try {
    localStorage.setItem(KEY, size);
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
