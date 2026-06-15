import React, { useEffect, useRef } from 'react';
// @ts-ignore
import figurinhaSvg from './public/figurinha.svg';

interface FigurinhaCardProps {
  nome: string;
  fotoUrl: string | null; // Can be a local object URL (preview) or remote URL
  onRenderComplete?: (dataUrl: string) => void;
}

export default function FigurinhaCard({ nome, fotoUrl, onRenderComplete }: FigurinhaCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    // Load background SVG
    const bgImg = new Image();
    bgImg.src = figurinhaSvg;

    const render = () => {
      if (!isSubscribed) return;

      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Background SVG
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // 3. Draw Guest Photo (if available)
      if (fotoUrl) {
        const photo = new Image();
        // Enable CORS for remote assets (e.g. Supabase Storage CDN)
        if (fotoUrl.startsWith('http')) {
          photo.crossOrigin = 'anonymous';
        }
        photo.src = fotoUrl;

        photo.onload = () => {
          if (!isSubscribed) return;

          // Target Area: x=75, y=220, w=510, h=600 in 810x1013 canvas
          const targetX = 75;
          const targetY = 220;
          const targetW = 510;
          const targetH = 600;

          // Draw cropped photo (object-fit: cover implementation)
          const imgRatio = photo.width / photo.height;
          const targetRatio = targetW / targetH;
          let sx = 0, sy = 0, sw = photo.width, sh = photo.height;

          if (imgRatio > targetRatio) {
            sw = photo.height * targetRatio;
            sx = (photo.width - sw) / 2;
          } else {
            sh = photo.width / targetRatio;
            sy = (photo.height - sh) / 2;
          }

          ctx.drawImage(photo, sx, sy, sw, sh, targetX, targetY, targetW, targetH);

          // 4. Draw Guest Name (over the photo and SVG background)
          drawName();

          // 5. Trigger Completion Callback
          if (onRenderComplete) {
            onRenderComplete(canvas.toDataURL('image/png'));
          }
        };

        photo.onerror = () => {
          console.error("Erro ao carregar a foto do convidado.");
          // Still draw name even if image fails
          drawName();
        };
      } else {
        // Draw name if no photo is provided
        drawName();
        if (onRenderComplete) {
          onRenderComplete(canvas.toDataURL('image/png'));
        }
      }
    };

    const drawName = () => {
      // Name area coordinates: x=75, y=870, w=510, h=60
      const x = 75;
      const y = 870;
      const w = 510;
      const h = 60;

      ctx.save();
      // Design: Player's name printed in black bold uppercase text
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Let's set a responsive font size, starting at 38px
      let fontSize = 38;
      ctx.font = `bold ${fontSize}px "Lilita One", Arial, sans-serif`;

      const formattedName = (nome || 'SEU NOME').toUpperCase().trim();

      // Adjust font size if text is too wide for the box
      while (ctx.measureText(formattedName).width > w - 20 && fontSize > 18) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px "Lilita One", Arial, sans-serif`;
      }

      ctx.fillText(formattedName, x + w / 2, y + h / 2);
      ctx.restore();
    };

    bgImg.onload = () => {
      render();
    };

    // Listen to font load events to ensure font is ready before drawing
    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (isSubscribed) {
          render();
        }
      });
    }

    return () => {
      isSubscribed = false;
    };
  }, [nome, fotoUrl]);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={810}
        height={1013}
        className="w-full max-w-[340px] md:max-w-[380px] h-auto border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-stone-900"
      />
    </div>
  );
}
