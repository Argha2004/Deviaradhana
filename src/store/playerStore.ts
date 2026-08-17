import { create } from 'zustand';

export type Song = {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  coverArt: string;
  audioUrl?: string;
  trackNumber: number;
};

type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  streamQuality: 'lossless' | 'high' | 'data-saver';
  seekTarget: number | null;

  // Actions
  playSong: (song: Song, queue?: Song[], index?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  play: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  clearSeekTarget: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setQueue: (songs: Song[]) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off',
  streamQuality: 'high',
  seekTarget: null,

  playSong: (song, queue, index) => {
    set({
      currentSong: song,
      queue: queue ?? [song],
      currentIndex: index ?? 0,
      isPlaying: true,
      currentTime: 0,
      duration: song.duration || 0,
      seekTarget: null,
    });
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  pause: () => set({ isPlaying: false }),
  play: () => set({ isPlaying: true }),

  next: () => {
    const { queue, currentIndex, isShuffle, repeatMode } = get();
    if (!queue.length) return;

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      return;
    }

    set({
      currentIndex: nextIndex,
      currentSong: queue[nextIndex],
      isPlaying: true,
      currentTime: 0,
      duration: queue[nextIndex]?.duration || 0,
      seekTarget: null,
    });
  },

  previous: () => {
    const { queue, currentIndex, currentTime } = get();
    if (!queue.length) return;

    if (currentTime > 3) {
      set({ currentTime: 0, seekTarget: 0 });
      return;
    }

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    set({
      currentIndex: prevIndex,
      currentSong: queue[prevIndex],
      isPlaying: true,
      currentTime: 0,
      duration: queue[prevIndex]?.duration || 0,
      seekTarget: null,
    });
  },

  seek: (time) => set({ currentTime: time, seekTarget: time }),
  clearSeekTarget: () => set({ seekTarget: null }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (vol) => set({ volume: vol, isMuted: vol === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),

  cycleRepeat: () =>
    set((s) => ({
      repeatMode:
        s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
    })),

  setQueue: (songs) => set({ queue: songs }),
}));
