
export enum VoiceGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: VoiceGender;
  description: string;
}

export interface AudioState {
  blobUrl: string | null;
  isPlaying: boolean;
  duration: number;
}
