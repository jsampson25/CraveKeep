export const colors = {
  background: '#FFFCF8',
  paper: '#FFFCF8',
  paperRaised: '#FFFFFF',
  charcoal: '#14213D',
  muted: '#667085',
  line: '#E7E7EC',
  coral: '#FF6252',
  coralDark: '#E64B3C',
  mint: '#74D8C7',
  mintSoft: '#E2F8F3',
  lemon: '#FFD66B',
  lemonSoft: '#FFF4C9',
  lavender: '#B9A7F5',
  lavenderSoft: '#F0ECFF',
  herb: '#2DBB9B',
  herbSoft: '#E2F8F3',
  citrus: '#FFB74A',
  blue: '#7BC7EA',
  white: '#FFFFFF'
} as const;

export const radii = { small: 12, medium: 18, large: 28, round: 999 } as const;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const typography = {
  display: { fontFamily: 'System', fontWeight: '800' as const, letterSpacing: -1.2 },
  title: { fontFamily: 'System', fontWeight: '800' as const, letterSpacing: -0.6 },
  body: { fontFamily: 'System', fontWeight: '400' as const },
  label: { fontFamily: 'System', fontWeight: '700' as const },
  action: { fontFamily: 'System', fontWeight: '800' as const }
} as const;
