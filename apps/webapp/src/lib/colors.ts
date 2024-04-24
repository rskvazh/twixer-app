import { colord } from 'colord'

export function getAccentShades(accentColor: string) {
  const color = colord(accentColor)

  return {
    light: color.lighten(0.08).toHex(),
    dark: color.darken(0.2).desaturate(0.3).toHex(),
  }
}
