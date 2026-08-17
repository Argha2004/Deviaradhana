import { useQuery } from '@tanstack/react-query';
import { fetchR2Playlists } from '../services/r2Service';
import type { Song } from '../store/playerStore';
import { preloadArtworkBatch } from '../utils/imagePreloader';

export interface PlaylistsData {
  durga: Song[];
  mahalaya: Song[];
  'mahalaya-songs': Song[];
}

export function usePlaylists() {
  return useQuery<PlaylistsData, Error>({
    queryKey: ['r2-playlists'],
    queryFn: async () => {
      const data = await fetchR2Playlists();
      // Preload first 25 album artworks into browser memory
      const allCovers = [
        ...(data.durga || []).map((s) => s.coverArt),
        ...(data.mahalaya || []).map((s) => s.coverArt),
        ...(data['mahalaya-songs'] || []).map((s) => s.coverArt),
      ];
      preloadArtworkBatch(allCovers, 30);
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
