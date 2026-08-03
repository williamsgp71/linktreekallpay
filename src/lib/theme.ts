export const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

export function isValidHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_REGEX.test(value);
}

export const DEFAULT_THEME = {
  colorBackground: '#0B0F17',
  colorCard: '#161E2E',
  colorAccent: '#10B981',
  colorText: '#F3F4F6',
} as const;

export function hexToRgbChannels(hex: string): string {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return '11 15 23';
  }
  return `${r} ${g} ${b}`;
}
