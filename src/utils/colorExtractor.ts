export interface DynamicPalette {
  primary: [number, number, number];      // Dominant majority color [r, g, b]
  accent: [number, number, number];       // Vibrant accent color [r, g, b]
  darkTone: [number, number, number];     // Dark background tone [r, g, b]
  glassBg: string;                        // rgba(...) for general glass
  glassPill: string;                      // rgba(...) for pill buttons
  glassSurface: string;                   // rgba(...) for player & modals
  glassBorder: string;                    // rgba(...) for borders
  accentGold: string;                     // rgb(...) for gold text/glow
  accentGlow: string;                     // rgba(...) for luminous glow
}

/**
 * Extracts dominant and accent colors from an image URL using HTML Canvas.
 */
export async function extractPaletteFromImage(imageUrl: string): Promise<DynamicPalette> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(getDefaultPalette());
          return;
        }

        // Downsample to 64x64 for fast pixel sampling
        const sampleSize = 64;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        let totalR = 0, totalG = 0, totalB = 0, count = 0;
        let maxSaturation = -1;
        let vibrantR = 238, vibrantG = 187, vibrantB = 60; // fallback golden

        for (let i = 0; i < imgData.length; i += 16) { // Sample every 4th pixel
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 128) continue; // Ignore transparent pixels

          // Ignore extreme black / extreme white for majority calculation
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness > 15 && brightness < 240) {
            totalR += r;
            totalG += g;
            totalB += b;
            count++;

            // Calculate saturation for vibrant accent
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;

            if (saturation > maxSaturation && brightness > 40 && brightness < 210) {
              maxSaturation = saturation;
              vibrantR = r;
              vibrantG = g;
              vibrantB = b;
            }
          }
        }

        if (count === 0) {
          resolve(getDefaultPalette());
          return;
        }

        const domR = Math.round(totalR / count);
        const domG = Math.round(totalG / count);
        const domB = Math.round(totalB / count);

        // Compute harmonious palette based on majority background color
        const darkR = Math.max(16, Math.round(domR * 0.30));
        const darkG = Math.max(14, Math.round(domG * 0.30));
        const darkB = Math.max(12, Math.round(domB * 0.30));

        const palette: DynamicPalette = {
          primary: [domR, domG, domB],
          accent: [vibrantR, vibrantG, vibrantB],
          darkTone: [darkR, darkG, darkB],
          glassBg: 'rgba(255, 255, 255, 0.22)',
          glassPill: 'rgba(255, 255, 255, 0.28)',
          glassSurface: 'rgba(32, 28, 26, 0.85)',
          glassBorder: 'rgba(255, 255, 255, 0.45)',
          accentGold: `rgb(${vibrantR}, ${vibrantG}, ${vibrantB})`,
          accentGlow: `rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.35)`,
        };

        resolve(palette);
      } catch {
        resolve(getDefaultPalette());
      }
    };

    img.onerror = () => {
      resolve(getDefaultPalette());
    };

    img.src = imageUrl;
  });
}

/**
 * Default festive warm Durga Puja amber/terracotta palette
 */
export function getDefaultPalette(): DynamicPalette {
  return {
    primary: [48, 36, 26],
    accent: [238, 187, 60],
    darkTone: [20, 16, 12],
    glassBg: 'rgba(255, 255, 255, 0.22)',
    glassPill: 'rgba(255, 255, 255, 0.28)',
    glassSurface: 'rgba(32, 28, 26, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.45)',
    accentGold: '#eebb3c',
    accentGlow: 'rgba(238, 187, 60, 0.35)',
  };
}

/**
 * Injects dynamic color palette into CSS custom properties on :root
 */
export function applyDynamicPaletteToDOM(palette: DynamicPalette) {
  const root = document.documentElement;
  root.style.setProperty('--dyn-glass-bg', palette.glassBg);
  root.style.setProperty('--dyn-glass-pill', palette.glassPill);
  root.style.setProperty('--dyn-glass-surface', palette.glassSurface);
  root.style.setProperty('--dyn-glass-border', palette.glassBorder);
  root.style.setProperty('--dyn-accent-gold', palette.accentGold);
  root.style.setProperty('--dyn-accent-glow', palette.accentGlow);
  root.style.setProperty(
    '--dyn-dom-rgb',
    `${palette.primary[0]}, ${palette.primary[1]}, ${palette.primary[2]}`
  );
  root.style.setProperty(
    '--dyn-accent-rgb',
    `${palette.accent[0]}, ${palette.accent[1]}, ${palette.accent[2]}`
  );
}
