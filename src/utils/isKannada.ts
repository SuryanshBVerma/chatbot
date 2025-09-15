// Detect if text contains Kannada script (Unicode range 0C80–0CFF)
export function isKannada(text: string): boolean {
  for (const char of text) {
    if (!char.trim()) continue; // skip whitespace
    const code = char.charCodeAt(0);
    if (code >= 0x0C80 && code <= 0x0CFF) {
      return true;
    }
  }
  return false;
}
