import { useEffect, useState } from 'react';
import {
  extractPaletteFromImage,
  getDefaultPalette,
  applyDynamicPaletteToDOM,
  type DynamicPalette,
} from '../utils/colorExtractor';
import { APP_CONFIG } from '../data/mockData';

/**
 * Hook to extract and apply dynamic translucent colors matching the hero background image.
 * Uses local hero background image to guarantee 0 CORS issues and fast response.
 */
export function useDynamicTheme(customBackgroundImage?: string): DynamicPalette {
  const [palette, setPalette] = useState<DynamicPalette>(() => getDefaultPalette());

  const activeImage = customBackgroundImage || APP_CONFIG.heroImage;

  useEffect(() => {
    let isCancelled = false;

    async function loadTheme() {
      if (!activeImage) return;
      try {
        const extracted = await extractPaletteFromImage(activeImage);
        if (!isCancelled) {
          setPalette(extracted);
          applyDynamicPaletteToDOM(extracted);
        }
      } catch (err) {
        console.warn('Failed to extract dynamic colors:', err);
      }
    }

    loadTheme();

    return () => {
      isCancelled = true;
    };
  }, [activeImage]);

  return palette;
}
