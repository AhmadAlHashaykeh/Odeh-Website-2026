/**
 * Copy text to the clipboard. Returns true on success, false otherwise.
 */
export async function copyToClipboard(text) {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      navigator.clipboard?.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
