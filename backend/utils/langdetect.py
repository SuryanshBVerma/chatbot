def is_kannada(text):
    """Detect if text contains Kannada script (Unicode range 0C80–0CFF)."""
    return any(0x0C80 <= ord(char) <= 0x0CFF for char in text if not char.isspace())