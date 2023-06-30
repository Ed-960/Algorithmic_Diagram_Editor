export const getComponentIcon = (type: string): string => {
  switch (type) {
    case 'start':
      return '▶️';
    case 'assignment':
      return '📝';
    case 'play_sound':
      return '🎵';
    case 'comparison':
      return '🔁';
    case 'finish':
      return '⏸️';
    default:
      return '';
  }
};

export const getComponentLabel = (type: string): string => {
  switch (type) {
    case 'start':
      return 'Start';
    case 'assignment':
      return 'Assignment';
    case 'play_sound':
      return 'Play Sound';
    case 'comparison':
      return 'Comparison';
    case 'finish':
      return 'Finish';
    default:
      return '';
  }
};

export const BLOCK_WIDTH = 120;
export const BLOCK_HEIGHT = 20;

export const componentPalette = [
  'start',
  'assignment',
  'play_sound',
  'comparison',
  'finish',
];
