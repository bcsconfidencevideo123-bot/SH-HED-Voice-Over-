
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VoiceOption, VoiceGender } from './types';
import { AVAILABLE_VOICES, MAX_TEXT_LENGTH } from './constants';
import { generateSpeech } from './services/geminiTTS';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(AVAILABLE_VOICES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError("দয়া করে কিছু টেক্সট লিখুন।");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const audioBlob = await generateSpeech(inputText, selectedVoice.id);
      const url = URL.createObjectURL(audioBlob);
      
      // Revoke previous URL if exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(url);
    } catch (err: any) {
      setError("অডিও জেনারেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `kanthaswar-${selectedVoice.id}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Input Area */}
        <div className="flex-1 p-6 md:p-10 bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fas fa-microphone-lines text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">কণ্ঠস্বর AI</h1>
              <p className="text-gray-500 text-sm">বাংলা টেক্সট টু স্পিচ কনভার্টার</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 ml-1">আপনার লেখা দিন</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
                placeholder="এখানে বাংলা বা ইংরেজি টেক্সট লিখুন..."
                className="w-full h-48 p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none text-lg text-gray-800 placeholder-gray-400 outline-none"
              />
              <div className="flex justify-between mt-2 px-1">
                <span className="text-xs text-gray-400">{inputText.length} / {MAX_TEXT_LENGTH} ক্যারেক্টার</span>
                {inputText.length >= MAX_TEXT_LENGTH && <span className="text-xs text-red-500">সর্বোচ্চ সীমা অতিক্রম করেছেন</span>}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputText.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] ${
                isGenerating || !inputText.trim() 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
              }`}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  প্রসেসিং হচ্ছে...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  ভয়েস জেনারেট করুন
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                <i className="fas fa-circle-exclamation"></i>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Options & Player */}
        <div className="w-full md:w-80 bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-sliders text-indigo-500"></i>
              সেটিংস
            </h2>

            <div className="space-y-8">
              {/* Gender Groups */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">কণ্ঠস্বর নির্বাচন করুন</span>
                
                {/* Female Voices */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <i className="fas fa-venus text-pink-500 text-xs"></i>
                    <span className="text-xs font-semibold text-gray-500">মহিলা কণ্ঠ</span>
                  </div>
                  <div className="grid gap-2">
                    {AVAILABLE_VOICES.filter(v => v.gender === VoiceGender.FEMALE).map(voice => (
                      <VoiceCard 
                        key={voice.id} 
                        voice={voice} 
                        isSelected={selectedVoice.id === voice.id}
                        onClick={() => setSelectedVoice(voice)}
                      />
                    ))}
                  </div>
                </div>

                {/* Male Voices */}
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <i className="fas fa-mars text-blue-500 text-xs"></i>
                    <span className="text-xs font-semibold text-gray-500">পুরুষ কণ্ঠ</span>
                  </div>
                  <div className="grid gap-2">
                    {AVAILABLE_VOICES.filter(v => v.gender === VoiceGender.MALE).map(voice => (
                      <VoiceCard 
                        key={voice.id} 
                        voice={voice} 
                        isSelected={selectedVoice.id === voice.id}
                        onClick={() => setSelectedVoice(voice)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls (Sticky at bottom) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {audioUrl ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <audio 
                    ref={audioRef}
                    src={audioUrl} 
                    controls 
                    className="w-full h-10"
                  />
                </div>
                <button
                  onClick={downloadAudio}
                  className="w-full py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  ডাউনলোড অডিও (WAV)
                </button>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                <i className="fas fa-headphones text-gray-300 text-3xl mb-2"></i>
                <p className="text-xs text-gray-400 px-4">অডিও জেনারেট হওয়ার পর এখানে প্লেয়ার দেখা যাবে</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface VoiceCardProps {
  voice: VoiceOption;
  isSelected: boolean;
  onClick: () => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
        isSelected 
        ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-50' 
        : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        <i className={`fas ${voice.gender === VoiceGender.FEMALE ? 'fa-female' : 'fa-male'}`}></i>
      </div>
      <div className="flex-1">
        <h3 className={`text-sm font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{voice.name}</h3>
        <p className="text-[10px] text-gray-400 line-clamp-1">{voice.description}</p>
      </div>
      {isSelected && (
        <i className="fas fa-check-circle text-indigo-500 text-sm"></i>
      )}
    </button>
  );
};

export default App;
