import { hexToRgbChannels } from '@/lib/theme';

interface ThemeStyleProps {
  colorBackground: string;
  colorCard: string;
  colorAccent: string;
  colorText: string;
}

export function ThemeStyle({
  colorBackground,
  colorCard,
  colorAccent,
  colorText,
}: ThemeStyleProps) {
  const css = `:root{--color-bg:${hexToRgbChannels(colorBackground)};--color-card:${hexToRgbChannels(colorCard)};--color-accent:${hexToRgbChannels(colorAccent)};--color-text:${hexToRgbChannels(colorText)};}`;
  return <style>{css}</style>;
}

export default ThemeStyle;
