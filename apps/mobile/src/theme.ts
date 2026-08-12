export const colors = {
  paper: '#FFF9F0',
  paperRaised: '#FFFDF8',
  charcoal: '#272A2D',
  muted: '#6D6A64',
  line: '#DED5C8',
  coral: '#F04F3D',
  coralDark: '#D83C2D',
  herb: '#627C3E',
  herbSoft: '#E7EED9',
  citrus: '#E5A72A',
  blue: '#5488A3',
  white: '#FFFFFF'
} as const;

export const radii = { small: 10, medium: 16, large: 24, round: 999 } as const;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const typography = {
  display: { fontFamily: 'Georgia', fontWeight: '700' as const, letterSpacing: -0.8 },
  title: { fontFamily: 'Georgia', fontWeight: '700' as const, letterSpacing: -0.4 },
  body: { fontWeight: '400' as const },
  label: { fontWeight: '700' as const },
  action: { fontWeight: '800' as const }
} as const;
