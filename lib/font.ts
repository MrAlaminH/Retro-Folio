export type Font = "Kalam" | "inter" | "departureMono";

const FONT_FAMILIES: Record<Font, string> = {
  Kalam: "'Kalam', cursive",
  inter: "'Inter', sans-serif",
  departureMono: "'Departure Mono', monospace",
};

export function parseStoredFont(raw: string | null): Font {
  if (raw && Object.prototype.hasOwnProperty.call(FONT_FAMILIES, raw)) {
    return raw as Font;
  }
  return "departureMono";
}

export function getFontFamily(font: Font): string {
  return FONT_FAMILIES[font];
}
