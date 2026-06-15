import React, { useState, useEffect, useRef } from 'react';
import {
  Music, Volume2, VolumeX, Calendar, Clock, MapPin,
  Share2, Copy, Check, Plus, Heart, Award, ArrowUp, Send,
  Sparkles, Flame, User, Disc, MessageSquare, Compass, Play, Pause, ListMusic,
  Timer
} from 'lucide-react';
import heroBia from './public/6.svg';
// @ts-ignore
import pagodeSong from './public/bagaço.mp3';
// @ts-ignore
import bgSplash from './public/37.svg';
// @ts-ignore
import centerImage from './public/3.svg';
// @ts-ignore
import djCollage from './public/10.png';
// @ts-ignore
import filtroImage from './public/filtro.png';


// Interfaces for structured interactive states
interface Recado {
  id: string;
  nome: string;
  mensagem: string;
  stamp: string;
  color: string;
  timestamp: string;
}

interface SugestaoMusica {
  id: string;
  nome: string;
  musica: string;
  votos: number;
}

export default function App() {
  // Navigation & UI States
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [votosTotais, setVotosTotais] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState(false);

  // Splash Screen & Audio States
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  // 1. Live Countdown States (Target: July 09, 2026 - Beatriz's Feriado Birthday!)
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize countdown and retrieve board/playlist items on mount
  useEffect(() => {
    // Initialize Audio Player
    audioRef.current = new Audio(pagodeSong);
    audioRef.current.loop = true;

    // 2. Countdown calculation
    const calculateCountdown = () => {
      const targetDate = new Date('2026-07-09T13:00:00-03:00').getTime(); // July 09, 2026, 13h00 (SP Time)
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleAudioToggle = () => {
    if (!audioRef.current) return;

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch((err) => console.log("Erro ao reproduzir o áudio:", err));
    }
  };

  const handleEnterBar = () => {
    setIsFading(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch((err) => console.log("Erro de autoplay bloqueado:", err));
    }
    setTimeout(() => {
      setShowSplash(false);
    }, 700);
  };

  // ----------------- EVENT HANDLERS & SIMULATIONS -----------------




  return (
    <div className="min-h-screen bg-[#FFFDF1] font-sans pb-24 overflow-x-hidden relative bg-grid-paper">

      {/* Tela de Entrada / Splash Screen (Abordagem A) */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FFFDF1] p-4 border-8 border-black transition-all duration-700 ease-in-out bg-cover bg-center bg-no-repeat ${isFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          style={{ backgroundImage: `url(${bgSplash})` }}
        >
          <div
            className="border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full relative overflow-hidden text-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            {/* Selo / Badge */}
            <div className="inline-block bg-stone-950 text-white font-display text-xs tracking-widest uppercase px-4 py-1.5 rounded-full border-2 border-white shadow-md rotate-[-2deg] mb-6">
              ✨ CONVITE ESPECIAL ✨
            </div>

            {/* Ilustração de Entrada */}
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

      {/* Dynamic Full Screen Samba Confetti Overlay */}
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

      {/* ------------------- STICKY FLOATING TOP PLAY BAR ------------------- */}
      <nav id="sticky-header" className="sticky top-0 z-40 bg-stone-900 text-white border-b-4 border-black px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-canary flex items-center justify-center animate-spin overflow-hidden border-2 border-black" style={{ animationDuration: '4s', animationPlayState: audioPlaying ? 'running' : 'paused' }}>
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
            className={`px-4 py-1.5 rounded-full font-display border-2 border-white flex items-center gap-2 text-xs uppercase cursor-pointer transition-all active:scale-95 ${audioPlaying ? 'bg-greenflag text-white border-green-400' : 'bg-rosepop text-stone-950 border-stone-850 hover:bg-rose-400'
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

      {/* ------------------- SECTION 1: HERO BANNER ("O ABRE-ALAS") ------------------- */}
      <section id="primeiro-ato" className="relative pt-12 pb-16 px-4 md:px-8 border-b-8 border-black overflow-hidden bg-stripes-pink-orange">
        <div className="max-w-xl mx-auto text-center relative z-10">

          {/* MAIN HEADLINE */}
          <h2 className="font-display text-4xl md:text-5xl text-stone-950 uppercase leading-none tracking-tight mb-4 drop-shadow-[2px_2px_0px_#FFF]">
            <span className="text-retro-red bg-white border-2 border-black inline-block px-4 py-2 mt-2 transform rotate-[-1deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-3xl md:text-4xl">
              BIA 30 ANOS
            </span>
          </h2>


          {/* HERO IMAGE */}
          <div className="relative w-80 max-w-full mx-auto mb-8">
            <img
              src={heroBia}
              alt="Bia - Já pode ou tá cedo?"
              className="w-full h-auto rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-rosepop transform rotate-[-1deg] hover:rotate-0 hover:scale-105 transition-all duration-300"
            />
          </div>

          <h2 className="font-display text-3xl md:text-4xl text-orange-600 uppercase leading-none tracking-tight mb-4 drop-shadow-[2px_2px_0px_#FFF]">
            BORA BB!
          </h2>

          {/* QUICK DETAILS GRID */}
          <div className="grid grid-cols-2 gap-4 mb-10 max-w-sm mx-auto">
            {/* Date block */}
            <div className="bg-pink-100 p-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <Calendar className="w-8 h-8 text-pink-600 mb-1 animate-retro-wiggle" />
              <p className="font-display text-lg text-pink-950 uppercase">09 de Julho</p>
              <p className="text-[10px] uppercase font-bold text-pink-700">Feriadin</p>
            </div>

            {/* Hour block */}
            <div className="bg-orange-100 p-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <Clock className="w-8 h-8 text-orange-600 mb-1 animate-pulse" />
              <p className="font-display text-lg text-orange-950 uppercase">A partir 13h</p>
              <p className="text-[10px] uppercase font-bold text-orange-700">Sem hora pra acabar</p>
            </div>
          </div>

          {/* SAMBA COUNTDOWN ENGINE */}
          <div className="bg-white border-4 border-black p-5 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 py-1 px-4 text-[9px] font-mono bg-orange-600 text-white uppercase font-bold uppercase tracking-wider rounded-bl-xl border-l-2 border-b-2 border-black">
              Contagem Regressiva
            </div>

            <h3 className="font-display text-base text-stone-800 text-left mb-3 uppercase tracking-wide flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-600 animate-pulse" />
              Já pode ou tá cedo?
            </h3>

            <div className="grid grid-cols-4 gap-2 text-stone-900">
              <div className="bg-stone-50 border-2 border-black rounded-xl p-2.5 flex flex-col items-center">
                <span className="font-mono text-3xl font-extrabold text-stone-900 tracking-tight">{timeLeft.dias.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold text-stone-500">Dias</span>
              </div>
              <div className="bg-stone-50 border-2 border-black rounded-xl p-2.5 flex flex-col items-center">
                <span className="font-mono text-3xl font-extrabold text-stone-900 tracking-tight">{timeLeft.horas.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold text-stone-500">Horas</span>
              </div>
              <div className="bg-stone-50 border-2 border-black rounded-xl p-2.5 flex flex-col items-center">
                <span className="font-mono text-3xl font-extrabold text-stone-900 tracking-tight">{timeLeft.minutos.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold text-stone-500">Mins</span>
              </div>
              <div className="bg-stone-50 border-2 border-black rounded-xl p-2.5 flex flex-col items-center border-orange-500 bg-orange-50">
                <span className="font-mono text-3xl font-extrabold text-orange-600 tracking-tight animate-pulse">{timeLeft.segundos.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold text-orange-500">Segs</span>
              </div>
            </div>
          </div>

          {/* CONFIRMAÇÃO DE PRESENÇA */}
          <div className="bg-white border-4 border-black p-5 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 py-1 px-4 text-[9px] font-mono bg-rosepop text-stone-950 uppercase font-bold tracking-wider rounded-bl-xl border-l-2 border-b-2 border-black">
              Presença
            </div>

            <h3 className="font-display text-base text-stone-800 text-left mb-3 uppercase tracking-wide flex items-center gap-2">
              <Check className="w-5 h-5 text-rosepop animate-bounce" />
              Bora festejar com a Bia?
            </h3>

            <p className="text-xs text-stone-600 text-left mb-4 leading-relaxed">
              Confirme sua presença pelo WhatsApp e garanta seu lugar nessa roda de samba!
            </p>

            <a
              href="https://wa.me/5512982096572?text=Conte%20comigo%20Bia!"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-rosepop hover:bg-pink-400 active:scale-95 text-stone-950 font-display text-base uppercase py-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer transition-transform text-center"
            >
              <span>Confirmar Presença 🍻</span>
            </a>
          </div>

        </div>
      </section>

      {/* ------------------- SECTION 3: OS MANDAMENTOS DA FESTA ------------------- */}
      <section id="mandamentos" className="py-16 px-4 md:px-8 border-b-8 border-black bg-checkered-pink-orange text-white">
        <div className="max-w-xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-canary mt-5 uppercase drop-shadow-[2px_2px_0px_#000]">Regras do rolê</h2>
          </div>

          {/* Cards styled with beer crates perspective patterns */}
          <div className="space-y-6">

            {/* Crate Card 1 */}
            <div className="bg-[#B91C1C] border-3 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-stone-900 text-yellow-400 font-display text-sm border-l-2 border-b-2 border-black rotate-[-5deg]">
                #01
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">😊</span>
                <div>
                  <h4 className="font-display text-lg text-white mb-1 uppercase tracking-wider">Sorriso & Leveza</h4>
                  <p className="text-[12px] text-stone-200">
                    Traga seu sorriso, leveza da alma e muita disposição para curtir. A cara feia a gente deixa em casa!
                  </p>
                </div>
              </div>
            </div>

            {/* Crate Card 2 */}
            <div className="bg-[#15803D] border-3 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-stone-900 text-yellow-400 font-display text-sm border-l-2 border-b-2 border-black rotate-[-5deg]">
                #02
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">💃</span>
                <div>
                  <h4 className="font-display text-lg text-white mb-1 uppercase tracking-wider">Dança y Dança</h4>
                  <p className="text-[12px] text-stone-200">
                    Abre a roda que hoje tem samba! Dance como se não houvesse amanhã!
                  </p>
                </div>
              </div>
            </div>

            {/* Crate Card 3 */}
            <div className="bg-[#D97706] border-3 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-stone-900 text-yellow-400 font-display text-sm border-l-2 border-b-2 border-black rotate-[-5deg]">
                #03
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">🍻</span>
                <div>
                  <h4 className="font-display text-lg text-white mb-1 uppercase tracking-wider">Traga sua Bebida</h4>
                  <p className="text-[12px] text-stone-200">
                    Traga sua bebida preferida (e um cooler se puder).
                  </p>
                </div>
              </div>
            </div>

            {/* Crate Card 4 */}
            <div className="bg-[#4F46E5] border-3 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-stone-900 text-yellow-400 font-display text-sm border-l-2 border-b-2 border-black rotate-[-5deg]">
                💙
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">💖</span>
                <div>
                  <h4 className="font-display text-lg text-white mb-1 uppercase tracking-wider">Eu quero viver esse momento com você!</h4>
                  <p className="text-[12px] text-stone-200">
                    O meu maior presente é a sua presença! Só vem!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- SECTION 4: ESPAÇO DJ (PLAYLIST COLABORATIVA) ------------------- */}
      <section id="espaco-dj" className="py-16 px-4 md:px-8 border-b-8 border-black bg-[#FFE5E8]">
        <div className="max-w-xl mx-auto text-center">

          <div className="mb-8">
            <span className="text-xs font-bold bg-rosepop text-stone-900 border-2 border-black px-4 py-1.5 rounded-full uppercase tracking-wider">🎧 PLAYLIST COLABORATIVA</span>
            <h2 className="font-display text-4xl text-stone-900 mt-5 uppercase">Espaço DJ</h2>
          </div>

          {/* Colagem DJ */}
          <div className="max-w-40 mx-auto mb-8 transform rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
            <img
              src={djCollage}
              alt="Espaço DJ Colagem"
              className="w-full h-auto rounded-3xl"
            />
          </div>

          <div className="mb-8">
            <p className="text-xs text-stone-700 mt-2 max-w-sm mx-auto">
              Manda a boa! Adicione na playlist as músicas que gostaria de ouvir no dia!
            </p>
          </div>

          <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm mx-auto relative overflow-hidden">
            <div className="absolute -right-4 -bottom-6 opacity-10 transform rotate-12">
              <span className="text-8xl text-stone-900 font-black">♪</span>
            </div>

            <div className="w-16 h-16 bg-[#1DB954] rounded-full border-3 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Music className="w-8 h-8 text-white animate-pulse" />
            </div>

            <h3 className="font-display text-xl text-stone-900 mb-3 uppercase">Spotify da Bia</h3>
            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              Abra a playlist pública no seu Spotify e adicione seus sambas, pagodes e brasilidades favoritas diretamente no nosso setlist do aniversário!
            </p>

            <a
              href="https://open.spotify.com/playlist/53sJukNJbx93shYPtrgbd6?si=mZhtWIraTROkh7eJIoqDNg&pi=LLQrPterSi-SI"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#1DB954] hover:bg-[#1ed760] active:scale-95 text-white font-display text-sm uppercase py-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer transition-transform"
            >
              <span>Abrir Playlist no Spotify 🟢</span>
            </a>
          </div>

        </div>
      </section>



      {/* ------------------- SECTION 6: LOCALIZAÇÃO ------------------- */}
      <section id="localizacao" className="py-16 px-4 md:px-8 border-b-8 border-black bg-stone-100">
        <div className="max-w-xl mx-auto">

          <div className="text-center mb-10">
            <span className="text-xs font-bold bg-green-200 text-green-800 px-3 py-1.5 rounded-full uppercase tracking-widest border-2 border-black">COMO CHEGAR NO Rolê</span>
            <h2 className="font-display text-4xl text-stone-900 mt-4 uppercase">Localização</h2>
            <p className="text-sm font-semibold text-rosepop drop-shadow-[1px_1px_0px_#000] mt-1 font-mono">Av. São Pedro, 186, Pedro Leme - Roseira - SP</p>
          </div>

          <div className="bg-white border-4 border-black p-5 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">

            {/* ILLUSTRATIVE MAP GRAPHICS SVG - High-vibe representation of location */}
            <div className="w-full h-56 bg-[#ECFDF5] border-3 border-black rounded-2xl relative overflow-hidden mb-6 shadow-inner">

              {/* Fake grid map road lines representing a cute neighborhood */}
              <svg className="w-full h-full opacity-65" viewBox="0 0 400 200" fill="none">
                {/* Rivers and trees layout */}
                <path d="M-20,180 Q80,180 120,40 Q160,-10 280,30 Q330,50 420,10" stroke="#93C5FD" strokeWidth="15" fill="none" opacity="0.6" />

                {/* Roads */}
                <line x1="50" y1="-20" x2="50" y2="250" stroke="#FFF" strokeWidth="18" />
                <line x1="50" y1="-20" x2="50" y2="250" stroke="#D1D5DB" strokeWidth="3" />

                <line x1="-20" y1="120" x2="450" y2="120" stroke="#FFF" strokeWidth="18" />
                <line x1="-20" y1="120" x2="450" y2="120" stroke="#D1D5DB" strokeWidth="3" />

                <line x1="260" y1="-20" x2="260" y2="250" stroke="#FFF" strokeWidth="18" />
                <line x1="260" y1="-20" x2="260" y2="250" stroke="#D1D5DB" strokeWidth="3" />

                {/* Road Banners Text */}
                <text x="70" y="110" fill="#6B7280" fontSize="8" fontFamily="monospace" rotate="0">AVENIDA SÃO PEDRO</text>
                <text x="180" y="60" fill="#6B7280" fontSize="8" fontFamily="monospace" rotate="90">RUA DO SAMBA</text>

                {/* Neighborhood spots layout */}
                <g transform="translate(110, 50)">
                  {/* Oasis filter de barro */}
                  <rect x="0" y="0" width="40" height="25" rx="5" fill="#FEF3C7" stroke="#000" strokeWidth="1.5" />
                  <text x="4" y="16" fill="#D97706" fontSize="7" fontWeight="bold">Oasis Chopp</text>
                </g>

                <g transform="translate(10, 20)">
                  {/* Bar Seu Zé */}
                  <rect x="0" y="0" width="35" height="25" rx="5" fill="#FEE2E2" stroke="#000" strokeWidth="1.5" />
                  <text x="3" y="16" fill="#DC2626" fontSize="6.5" fontWeight="bold">Bar Seu Zé</text>
                </g>

                <g transform="translate(300, 135)">
                  {/* Padaria */}
                  <rect x="0" y="0" width="45" height="25" rx="5" fill="#E0F2FE" stroke="#000" strokeWidth="1.5" />
                  <text x="4" y="16" fill="#0284C7" fontSize="7" fontWeight="bold">Padaria Leme</text>
                </g>

                {/* Bia&#39;s Celebration Center spot pinpoint */}
                <g transform="translate(240, 95)" className="animate-bounce" style={{ animationDuration: '2s' }}>
                  {/* Yellow target circle */}
                  <circle cx="20" cy="25" r="22" fill="#F17FB6" opacity="0.3" />
                  <circle cx="20" cy="25" r="14" fill="#00933B" stroke="#000" strokeWidth="2" />
                  <polygon points="20,40 10,24 30,24" fill="#E11D48" stroke="#000" strokeWidth="1.5" />
                  <circle cx="20" cy="22" r="5" fill="#FFF" />
                </g>
              </svg>

              {/* Float Badge overlay for map */}
              <div className="absolute top-3 left-3 bg-stone-900 border-2 border-black text-white px-3 py-1 text-[10px] uppercase font-display tracking-wider rounded-lg shadow-md">
                📍 Ponto de Referência: Aniversário da Beatriz SP-186
              </div>

              {/* Pin indicator on hover */}
              <div className="absolute bottom-3 right-3 bg-[#00933B] border-2 border-black text-white px-3 py-1 text-[9px] uppercase font-mono rounded-lg">
                Festa da Bia 🍻
              </div>
            </div>

            <h4 className="font-display text-lg text-stone-900 mb-2 uppercase">Av. São Pedro, 186 – Roseira</h4>
            <p className="text-xs text-stone-600 mb-6 font-sans">
              Na rua da APAE, estacionamento no local ou na rua do evento.
            </p>

            {/* DIRECT ACTION BUTTON ROUTE */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+S%C3%A3o+Pedro,+186,+Pedro+Leme+-+Roseira+-+SP"
                target="_blank"
                rel="noreferrer"
                className="bg-stone-950 hover:bg-stone-850 active:scale-95 text-white font-display text-xs p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-greenflag animate-spin" style={{ animationDuration: '3s' }} />
                <span>Google Maps</span>
              </a>

              <a
                href="https://waze.com/ul?q=Av.+S%C3%A3o+Pedro,+186,+Pedro+Leme+-+Roseira+-+SP"
                target="_blank"
                rel="noreferrer"
                className="bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-stone-950 font-display text-xs p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-stone-950 animate-bounce" />
                <span>Rotas pelo Waze</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------- FOOTER DE VOLTA PARA O BAR ------------------- */}
      <footer className="py-12 bg-stone-950 text-stone-400 text-center border-t-4 border-black relative px-4">
        <div className="max-w-xl mx-auto space-y-4">
          <p className="font-display text-xl text-white tracking-widest uppercase">
            BRASILIDADES DA BIA 🇧🇷
          </p>

          {/* Clay water filter retro trademark sign */}
          <div className="flex items-center justify-center gap-3 py-2">
            <img src={filtroImage} alt="Filtro de Barro" className="w-10 h-16 object-contain animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-stone-200">Selado com Filtro de Barro</p>
              <p className="text-[9px] text-stone-500 font-mono">100% Autêntico CASA BRASIL Mat. Construções</p>
            </div>
          </div>

          <p className="text-[11px] font-mono leading-relaxed max-w-xs mx-auto text-stone-500">
            Idealizado pela Bia para você, com todo o carinho que a comemoração exige!
          </p>
          <p className="text-[9px] text-stone-600 font-mono">
            © 2026 Brasilidades da Bia • Desenvolvido com amor e cachaça
          </p>
        </div>
      </footer>



    </div>
  );
}
