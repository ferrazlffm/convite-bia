import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image as ImageIcon, Upload, Download, ArrowLeft, Users, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import FigurinhaCard from './FigurinhaCard';

// Helper to convert base64 data URL to Blob for Supabase upload
const dataURLtoBlob = (dataUrl: string) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

interface Convidado {
  id: string;
  nome: string;
  foto_url: string;
  created_at: string;
}

export default function AlbumPage() {
  const [nome, setNome] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(null);
  const [renderedSticker, setRenderedSticker] = useState<string | null>(null);
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load convidados from Supabase
  const fetchConvidados = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        setErrorMessage('Supabase não configurado. Verifique as chaves no arquivo .env.');
        setConvidados([]);
        return;
      }
      const { data, error } = await supabase
        .from('convidados')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setConvidados(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar convidados:', err.message);
      setErrorMessage(`Erro ao carregar convidados: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvidados();
  }, []);

  // Handle file selections
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);

      // Create local URL for Canvas preview
      if (fotoPreviewUrl) {
        URL.revokeObjectURL(fotoPreviewUrl);
      }
      setFotoPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  // Trigger file dialogs
  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerCameraInput = () => cameraInputRef.current?.click();

  // Download sticker composed PNG
  const handleDownload = () => {
    if (!renderedSticker) return;
    const link = document.createElement('a');
    link.download = `figurinha-${nome.trim() || 'convidado'}.png`;
    link.href = renderedSticker;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit sticker to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMessage('Supabase não configurado. Preencha as chaves válidas no seu .env.');
      return;
    }
    if (!nome.trim()) {
      setErrorMessage('Por favor, digite seu nome.');
      return;
    }
    if (nome.length > 20) {
      setErrorMessage('O nome deve ter no máximo 20 caracteres.');
      return;
    }
    if (!renderedSticker || !fotoPreviewUrl) {
      setErrorMessage('Por favor, tire ou selecione uma foto antes de confirmar.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      // 1. Convert composed base64 image to Blob
      const stickerBlob = dataURLtoBlob(renderedSticker);
      const fileName = `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.png`;

      // 2. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotos-figurinhas')
        .upload(fileName, stickerBlob, { contentType: 'image/png' });

      if (uploadError) {
        console.error('Erro no storage:', uploadError);
        throw new Error('Falha ao enviar a imagem. Verifique se o bucket "fotos-figurinhas" foi criado e está público.');
      }

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('fotos-figurinhas')
        .getPublicUrl(fileName);

      const stickerUrl = publicUrlData.publicUrl;

      // 4. Save to Database
      const { error: dbError } = await supabase
        .from('convidados')
        .insert([{ nome: nome.trim(), foto_url: stickerUrl }]);

      if (dbError) {
        console.error('Erro no banco:', dbError);
        throw new Error('Falha ao salvar no banco. Verifique se a tabela "convidados" e as políticas RLS foram criadas.');
      }

      // 5. Success state & animations
      setSuccess(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Reset form
      setNome('');
      setFotoFile(null);
      if (fotoPreviewUrl) {
        URL.revokeObjectURL(fotoPreviewUrl);
        setFotoPreviewUrl(null);
      }

      // Refresh guestlist
      fetchConvidados();

      // Clear success banner after delay
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#005c24] text-white py-8 px-4 relative bg-grid-paper">
      {/* Confetti Overlay for new sticker slap */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex flex-wrap justify-between overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm animate-bounce opacity-85"
              style={{
                backgroundColor: ['#F5D324', '#00933B', '#F17FB6', '#E11D48', '#0EA5E9'][i % 5],
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                marginLeft: `${Math.random() * 100}vw`
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 bg-stone-900 border-3 border-black text-white px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all font-display text-sm uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Convite</span>
          </Link>

          <div className="bg-canary border-3 border-black text-stone-950 px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-display text-sm uppercase flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{convidados.length} Confirmados</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-canary drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-[-1deg] inline-block bg-stone-900 border-4 border-black px-6 py-3 rounded-2xl shadow-[6px_6px_0px_0px_rgba(241,127,182,1)]">
            ÁLBUM DE FIGURINHAS
          </h1>
          <p className="text-sm font-semibold tracking-wide text-rosepop drop-shadow-[1px_1px_0px_#000] mt-4 font-mono uppercase">
            Cole sua figurinha e garanta seu lugar na Seleção da Bia!
          </p>
        </div>

        {/* Section 1: Form & Canvas (Responsive flex layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-16">
          {/* Form Side */}
          <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-stone-900">
            <h2 className="font-display text-2xl uppercase tracking-tight mb-4 text-greenflag border-b-2 border-stone-200 pb-2">
              ⚽ Crie sua Figurinha
            </h2>

            {errorMessage && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-4 font-semibold text-xs leading-relaxed">
                ⚠️ {errorMessage}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-xl mb-4 font-display text-sm uppercase text-center animate-pulse">
                🎉 Figurinha colada com sucesso no álbum!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-sm uppercase tracking-wide text-stone-700 flex justify-between">
                  <span>Seu nome</span>
                  <span className={nome.length > 20 ? 'text-red-500 font-bold' : 'text-stone-400 font-mono'}>
                    {nome.length}/20
                  </span>
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value.slice(0, 20))}
                  placeholder="EX: NEYMAR JR"
                  className="border-3 border-black rounded-xl p-3 text-stone-900 font-display uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-canary w-full bg-stone-50"
                  required
                />
              </div>

              {/* Photo Input (Hidden inputs with styled triggers) */}
              <div className="flex flex-col gap-2">
                <label className="font-display text-sm uppercase tracking-wide text-stone-700">
                  Foto da Figurinha
                </label>

                {/* File selectors (hidden) */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileChange}
                  ref={cameraInputRef}
                  className="hidden"
                />

                {/* Buttons triggers */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={triggerCameraInput}
                    className="flex items-center justify-center gap-2 bg-canary hover:bg-yellow-400 active:scale-95 text-stone-950 font-display text-xs uppercase p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-transform"
                  >
                    <Camera className="w-5 h-5 text-stone-950" />
                    <span>Tirar Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="flex items-center justify-center gap-2 bg-rosepop hover:bg-pink-400 active:scale-95 text-stone-950 font-display text-xs uppercase p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-transform"
                  >
                    <ImageIcon className="w-5 h-5 text-stone-950" />
                    <span>Galeria</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-stone-100 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-greenflag hover:bg-green-700 active:scale-95 text-white font-display text-base uppercase py-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Colando Figurinha...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Confirmar Presença no Álbum</span>
                    </>
                  )}
                </button>

                {renderedSticker && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full bg-stone-900 hover:bg-stone-850 active:scale-95 text-white font-display text-xs uppercase py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Salvar Figurinha no Celular</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Canvas Preview Side */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="font-display text-lg uppercase tracking-wide text-canary mb-4 text-center">
              🔍 Preview da Figurinha
            </h3>
            <FigurinhaCard
              nome={nome}
              fotoUrl={fotoPreviewUrl}
              onRenderComplete={setRenderedSticker}
            />
          </div>
        </div>

        {/* Section 2: Grid Gallery */}
        <div className="border-t-8 border-black pt-12">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl uppercase tracking-wider text-canary drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              📖 CONVOCADOS DA MISTER
            </h2>
            <p className="text-xs font-mono uppercase text-rosepop mt-1">
              Veja quem já está escalado para o Futebol Arte!
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-12 h-12 text-canary animate-spin" />
              <p className="font-mono text-sm uppercase text-stone-300">Carregando álbum...</p>
            </div>
          ) : convidados.length === 0 ? (
            <div className="bg-stone-900 border-4 border-black p-12 rounded-3xl text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto">
              <span className="text-4xl">😢</span>
              <h3 className="font-display text-xl uppercase mt-4 mb-2 text-canary">Nenhuma figurinha colada</h3>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                Ninguém confirmou presença ainda! Seja o primeiro a colar sua figurinha no álbum e iniciar a escalação.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
              {convidados.map((c) => (
                <div
                  key={c.id}
                  className="w-full max-w-[220px] bg-stone-900 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-sticker-slap"
                >
                  <img
                    src={c.foto_url}
                    alt={`Figurinha de ${c.nome}`}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                  <div className="bg-stone-900 text-center py-2 border-t-2 border-black">
                    <p className="font-display text-xs uppercase tracking-wider text-canary px-2 truncate">
                      {c.nome}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
