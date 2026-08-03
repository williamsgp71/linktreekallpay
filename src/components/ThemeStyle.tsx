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
  const css = `:root{--color-bg:${colorBackground};--color-card:${colorCard};--color-accent:${colorAccent};--color-text:${colorText};}`;
  return <style>{css}</style>;
}

export default ThemeStyle;
