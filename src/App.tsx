import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

// @ts-ignore
import pagodeSong from './public/bagaço.mp3';
// @ts-ignore
import bgSplash from './public/37.svg';
// @ts-ignore
import centerImage from './public/3.webp';

// Pages
import ConvitePage from './ConvitePage';
import AlbumPage from './AlbumPage';

export default function App() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Initialize Audio Player (runs only once on mount)
    audioRef.current = new Audio(pagodeSong);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    // Check if directly accessing /album or hash contains /album
    const isAlbumPath = location.pathname === '/album' || window.location.hash.includes('/album');
    if (isAlbumPath) {
      setShowSplash(false);
    }
  }, [location.pathname]);

  const handleAudioToggle = () => {
    if (!audioRef.current) return;

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch((err) => console.log('Erro ao reproduzir o áudio:', err));
    }
  };

  const handleEnterBar = () => {
    setIsFading(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch((err) => console.log('Erro de autoplay bloqueado:', err));
    }
    setTimeout(() => {
      setShowSplash(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF1] font-sans overflow-x-hidden relative bg-grid-paper">
      {/* Splash Screen */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FFFDF1] p-4 border-8 border-black transition-all duration-700 ease-in-out bg-cover bg-center bg-no-repeat ${
            isFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
          style={{ backgroundImage: `url(${bgSplash})` }}
        >
          <div
            className="border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative overflow-hidden text-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            <div className="inline-block bg-stone-950 text-white font-display text-xs tracking-widest uppercase px-4 py-1.5 rounded-full border-2 border-white shadow-md rotate-[-2deg] mb-6">
              ✨ CONVITE ESPECIAL ✨
            </div>

            <div className="w-28 h-28 rounded-full bg-canary border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <img src={centerImage} alt="Ilustração de Entrada" className="w-full h-full object-cover" />
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-pink-600 uppercase leading-none tracking-tight mb-4">
              Alô, Rapaziada! <br />
              <span className="text-retro-red bg-yellow-100 border-2 border-black inline-block px-3 py-1 mt-2 transform rotate-[1deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xl">
                A Bia vai trintar!
              </span>
            </h1>

            <p className="text-xs text-stone-600 font-sans max-w-xs mx-auto mb-8 leading-relaxed">
              Prepare o copo americano e entre na roda de samba da Bia!
            </p>

            <button
              onClick={handleEnterBar}
              className="w-full bg-greenflag hover:bg-green-700 active:scale-95 text-white font-display text-base uppercase py-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-3 animate-pulse"
            >
              <Volume2 className="w-5 h-5 animate-bounce" />
              <span>Entrar no Bar 🍻</span>
            </button>
          </div>
        </div>
      )}


      {/* Sticky Play Bar (shared across routes) */}
      {!showSplash && (
        <>
          <nav id="sticky-header" className="sticky top-0 z-40 bg-stone-900 text-white border-b-4 border-black px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-canary flex items-center justify-center animate-spin overflow-hidden border-2 border-black"
                style={{ animationDuration: '4s', animationPlayState: audioPlaying ? 'running' : 'paused' }}
              >
                <img src={centerImage} alt="Bia Top Bar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-display text-lg tracking-wider text-canary">Bia 30 Anos</h1>
                <p className="text-[10px] text-stone-400 font-mono tracking-tight uppercase">Trilha Sonora ao Vivo</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAudioToggle}
                className={`px-4 py-1.5 rounded-full font-display border-2 border-white flex items-center gap-2 text-xs uppercase cursor-pointer transition-all active:scale-95 ${
                  audioPlaying ? 'bg-greenflag text-white border-green-400' : 'bg-rosepop text-stone-950 border-stone-850 hover:bg-rose-400'
                }`}
              >
                {audioPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>Mudo</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-stone-950" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<ConvitePage />} />
            <Route path="/album" element={<AlbumPage />} />
          </Routes>
        </>
      )}
    </div>
  );
}
