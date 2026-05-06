import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import type { NoiseType } from '../../types';

const NOISE_TYPES: { id: NoiseType; label: string; icon: string }[] = [
  { id: 'rain', label: '雨声', icon: 'fa-solid fa-cloud-rain' },
  { id: 'cafe', label: '咖啡', icon: 'fa-solid fa-mug-hot' },
  { id: 'forest', label: '森林', icon: 'fa-solid fa-tree' },
  { id: 'ocean', label: '海浪', icon: 'fa-solid fa-water' },
];

const AUDIO_URLS: Record<NoiseType, string> = {
  rain: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
  cafe: 'https://assets.mixkit.co/active_storage/sfx/2042/2042-preview.mp3',
  forest: 'https://assets.mixkit.co/active_storage/sfx/1313/1313-preview.mp3',
  ocean: 'https://assets.mixkit.co/active_storage/sfx/1432/1432-preview.mp3',
};

export default function WhiteNoiseBar() {
  const { noise, setNoiseType, setNoiseVolume } = useStore();
  const audioRefs = useRef<Map<NoiseType, HTMLAudioElement>>(new Map());

  useEffect(() => {
    NOISE_TYPES.forEach(({ id }) => {
      const audio = new Audio(AUDIO_URLS[id]);
      audio.loop = true;
      audio.volume = noise.volume / 100;
      audio.preload = 'auto';
      audioRefs.current.set(id, audio);
    });
    return () => {
      audioRefs.current.forEach((a) => { a.pause(); a.src = ''; });
    };
  }, []);

  useEffect(() => {
    audioRefs.current.forEach((a) => { a.volume = noise.volume / 100; });
  }, [noise.volume]);

  useEffect(() => {
    audioRefs.current.forEach((a, type) => {
      if (type === noise.currentType) {
        a.play().catch(() => {});
      } else {
        a.pause();
        a.currentTime = 0;
      }
    });
  }, [noise.currentType]);

  const handleToggle = useCallback(
    (type: NoiseType) => setNoiseType(noise.currentType === type ? null : type),
    [noise.currentType, setNoiseType],
  );

  return (
    <div className="mt-10 w-full max-w-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
      <p className="text-[10px] font-medium tracking-widest uppercase text-morandi-slate/50 dark:text-morandi-mist/40 text-center mb-4">
        白噪音
      </p>
      <div className="flex justify-center gap-3 mb-5">
        {NOISE_TYPES.map(({ id, label, icon }) => {
          const isActive = noise.currentType === id;
          return (
            <button
              key={id}
              onClick={() => handleToggle(id)}
              aria-label={`播放${label}`}
              className="flex flex-col items-center gap-2"
            >
              <i
                className={`${icon} icon-3d ${
                  isActive ? 'icon-3d-indigo' : ''
                }`}
              />
              <span className={`text-[10px] font-medium ${
                isActive
                  ? 'text-morandi-indigo dark:text-morandi-pearl'
                  : 'text-morandi-slate/50 dark:text-morandi-mist/40'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-3 px-2">
        <i className="fa-solid fa-volume-low icon-3d icon-3d-sm" />
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max="100"
            value={noise.volume}
            onChange={(e) => setNoiseVolume(Number(e.target.value))}
            aria-label="音量调节"
            className="w-full h-1 appearance-none bg-morandi-cloud/40 dark:bg-morandi-slate/20 rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3.5
              [&::-webkit-slider-thumb]:h-3.5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-morandi-indigo
              [&::-webkit-slider-thumb]:shadow-soft
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:duration-300
              [&::-webkit-slider-thumb]:hover:scale-125
              [&::-moz-range-thumb]:w-3.5
              [&::-moz-range-thumb]:h-3.5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-morandi-indigo
              [&::-moz-range-thumb]:border-0
            "
          />
        </div>
        <span className="text-[10px] text-morandi-slate/40 dark:text-morandi-mist/30 tabular-nums w-7 text-right">
          {noise.volume}
        </span>
      </div>
    </div>
  );
}
