import { Dispatch, LegacyRef, SetStateAction } from 'react';

export interface Component {
  endX?: number;
  endY?: number;
  id: string;
  type: string;
  x: number;
  y: number;
  name: string;
  musicName?: string;
  next?: number | null;
  musicId?: number | undefined;
}

export interface Variable {
  id: number;
  type: string | null;
  val: string;
}

export interface Music {
  id: number;
  name: string;
  file: Blob | null;
  isPlaying?: boolean;
}

export interface Connection {
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
}

export interface Scenario {
  id: number;
  name: string;
  variables: Variable[];
  components: Component[];
  musicPlaylist: Music[];
  connections: Connection[];
}

export interface FooterProps {
  handleSaveScenario: () => void;
  handleLoadScenario: () => void;
  clearField: () => void;
}

export interface FieldProps {
  selectedComponent: Component | null;
  scenario: Scenario;
  setScenario: Dispatch<SetStateAction<Scenario>>;
  selectedComponents: Component[];
  setSelectedComponents: Dispatch<SetStateAction<Component[]>>;
  connectionCanvasRef: LegacyRef<HTMLCanvasElement> | undefined;
  setSelectedComponent: Dispatch<SetStateAction<Component | null>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  handleDrag: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleDragStop: () => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

export interface MusicPlaylistProps {
  handlePlayStop: () => void;
  play: () => void;
  allow: boolean;
  handlePlayMusic: () => void;
  scenario: Scenario;
  setScenario: Dispatch<SetStateAction<Scenario>>;
  setSelectedMusic: Dispatch<SetStateAction<Music | null>>;
}

export interface PopupProps {
  showPopup: boolean;
  setShowPopup: Dispatch<SetStateAction<boolean>>;
}
