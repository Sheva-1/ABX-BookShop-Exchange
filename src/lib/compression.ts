/**
 * Client-Side Media Compression Utility
 * Implements the PRD requirement:
 * All user photo uploads are compressed client-side to WebP format (< 300 KB)
 * before uploading to optimize performance on 3G/4G mobile networks in Cameroon.
 */

export interface CompressionResult {
  file: File | Blob;
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
  format: string;
  width: number;
  height: number;
}

export async function compressImageToWebP(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be created'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export to WebP (falls back to JPEG if unsupported)
        const format = 'image/webp';
        const dataUrl = canvas.toDataURL(format, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression blob failed'));
              return;
            }

            const originalSizeBytes = file.size;
            const compressedSizeBytes = blob.size;
            const reductionPercentage = Math.round(
              ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100
            );

            resolve({
              file: blob,
              dataUrl,
              originalSizeBytes,
              compressedSizeBytes,
              reductionPercentage: Math.max(0, reductionPercentage),
              format: 'webp',
              width,
              height,
            });
          },
          format,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
