/**
 * Image Optimizer Utility untuk Virtual Tour 360 & Web Admin
 *
 * Fitur:
 * 1. Mengurangi ukuran file foto raksasa (10MB - 50MB) menjadi ~2MB - 3.5MB secara instan di memori browser.
 * 2. Mengonversi ke format modern WebP dengan kualitas visual tinggi (88% - 90%) tanpa kehilangan detail visual (visually lossless).
 * 3. Membatasi resolusi panorama ke standar emas WebGL (maks. lebar 4096px untuk kompatibilitas penuh di Android/iPhone/Desktop).
 * 4. Sangat menghemat bandwidth dan waktu tunggu upload admin dari bermenit-menit menjadi hitungan detik.
 */
export async function optimizeImageForWeb(file, options = {}) {
  const {
    maxWidth = 4096,
    quality = 0.88,
  } = options;

  // Jika file berupa SVG atau GIF animasi, jangan diubah via canvas
  if (!file || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // Jika file sudah berukuran ringan (< 1.5MB) dan sudah WebP, langsung loloskan
  if (file.size < 1.5 * 1024 * 1024 && file.type === 'image/webp') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proporsional jika lebar melebihi batas (misal 6000px/8000px -> 4096px)
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback aman jika canvas tidak didukung
          return;
        }

        // Gambar ulang dengan interpolasi tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP kualitas tinggi
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Ganti ekstensi file menjadi .webp
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const optimizedFile = new File([blob], `${baseName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            console.info(
              `[ImageOptimizer] Sukses kompresi: ${(file.size / (1024 * 1024)).toFixed(2)} MB -> ${(optimizedFile.size / (1024 * 1024)).toFixed(2)} MB (WebP HD ${width}x${height})`
            );

            resolve(optimizedFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        console.warn('[ImageOptimizer] Gagal memuat gambar ke memori, menggunakan file asli.');
        resolve(file);
      };

      img.src = e.target?.result;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}

