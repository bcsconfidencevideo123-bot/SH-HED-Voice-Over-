
import { VoiceOption, VoiceGender } from './types';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'Kore', name: 'কোরে (Kore)', gender: VoiceGender.FEMALE, description: 'শান্ত ও মধুর কণ্ঠস্বর' },
  { id: 'Puck', name: 'পাক (Puck)', gender: VoiceGender.MALE, description: 'উদ্যমী ও স্পষ্ট কণ্ঠস্বর' },
  { id: 'Charon', name: 'ক্যারন (Charon)', gender: VoiceGender.MALE, description: 'গম্ভীর ও প্রাঞ্জল কণ্ঠস্বর' },
  { id: 'Fenrir', name: 'ফেনরির (Fenrir)', gender: VoiceGender.MALE, description: 'ভারী ও বলিষ্ঠ কণ্ঠস্বর' },
  { id: 'Zephyr', name: 'জেফির (Zephyr)', gender: VoiceGender.MALE, description: 'হালকা ও সাবলীল কণ্ঠস্বর' }
];

export const MAX_TEXT_LENGTH = 1000;
