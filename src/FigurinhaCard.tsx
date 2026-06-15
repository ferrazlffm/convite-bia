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

          // Target Area: x=50, y=120, w=560, h=720 in 810x1013 canvas
          const targetX = 50;
          const targetY = 120;
          const targetW = 560;
          const targetH = 720;

          const borderWidth = 18; // Largura da borda branca de colagem
          const borderRadius = 32; // Raio para cantos arredondados (estilo desenho animado)

          ctx.save();

          // 1. Cria caminho arredondado para o fundo branco
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(targetX, targetY, targetW, targetH, borderRadius);
          } else {
            ctx.rect(targetX, targetY, targetW, targetH);
          }

          // Preenche a área de branco (borda da colagem)
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          // Clip para conter a foto dentro dos cantos arredondados se necessário
          ctx.clip();

          // 2. Calcula a área interna para a foto (encolhida pela borda)
          const photoX = targetX + borderWidth;
          const photoY = targetY + borderWidth;
          const photoW = targetW - (2 * borderWidth);
          const photoH = targetH - (2 * borderWidth);
          const photoRadius = Math.max(0, borderRadius - borderWidth);

          // Draw cropped photo (object-fit: cover implementation)
          const imgRatio = photo.width / photo.height;
          const targetRatio = photoW / photoH;
          let sx = 0, sy = 0, sw = photo.width, sh = photo.height;

          if (imgRatio > targetRatio) {
            sw = photo.height * targetRatio;
            sx = (photo.width - sw) / 2;
          } else {
            sh = photo.width / targetRatio;
            sy = (photo.height - sh) / 2;
          }

          // Clip arredondado para a foto interna
          ctx.save();
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
          } else {
            ctx.rect(photoX, photoY, photoW, photoH);
          }
          ctx.clip();

          ctx.drawImage(photo, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
          ctx.restore(); // Restaura o clipe da foto interna

          ctx.restore(); // Restaura o clipe do fundo branco geral

          // 3. Desenha os contornos pretos para o efeito de desenho animado/adesivo
          ctx.strokeStyle = '#000000';

          // Borda externa grossa arredondada
          ctx.lineWidth = 6;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(targetX, targetY, targetW, targetH, borderRadius);
          } else {
            ctx.rect(targetX, targetY, targetW, targetH);
          }
          ctx.stroke();

          // Borda interna fina arredondada ao redor da foto
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
          } else {
            ctx.rect(photoX, photoY, photoW, photoH);
          }
          ctx.stroke();

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
      // Name area coordinates
      const x = 50;
      const y = 925;
      const w = 560;
      const h = 60;

      ctx.save();
      // Design: Player's name printed in black bold uppercase text
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Let's set a responsive font size, starting at 48px
      let fontSize = 48;
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
