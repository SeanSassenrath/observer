export const brightWhite = '#fcfcfc';
export const errorRed = '#C55F41';
export const successGreen = '#77CD48';
export const darkBg = '#0B0E18';

export interface PlaylistGradient {
  colors: string[];
  name: string;
}

export const playlistGradients: PlaylistGradient[] = [
  {colors: ['#5D198E', '#360C66'], name: 'AMETHYST'},
  {colors: ['#007A7A', '#003D45'], name: 'OCEAN'},
  {colors: ['#E8672A', '#D4A03A'], name: 'SUNSET'},
  {colors: ['#891540', '#4C030E'], name: 'ROSE'},
  {colors: ['#2E5E3F', '#1A3A28'], name: 'FOREST'},
  {colors: ['#2E3A8C', '#151C52'], name: 'INDIGO'},
];
