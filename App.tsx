import React, { useState } from 'react';
import { GameRunner } from './components/GameRunner';
import { GameState, PugSkin } from './types';

// Placeholder/Default Skin
const DEFAULT_SKIN: PugSkin = {
  id: 'default',
  name: 'Party Bunny',
  imageUrl: null // triggers default drawing code
};

const BABY_PUKA_SKIN: PugSkin = {
  id: 'bebe-puka',
  name: 'Baby Puka',
  imageUrl: null
};

const MAMA_PUKA_SKIN: PugSkin = {
  id: 'maman-puka',
  name: 'Mama Puka',
  imageUrl: null
};

const App: React.FC = () => {
  const [isHome, setIsHome] = useState(true);
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [skins, setSkins] = useState<PugSkin[]>([DEFAULT_SKIN, BABY_PUKA_SKIN, MAMA_PUKA_SKIN]);
  const [activeSkinId, setActiveSkinId] = useState<string>('default');
  const [lastScore, setLastScore] = useState<number>(0);
  
  // Initialize high score from local storage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bunny_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      console.warn('Failed to access local storage', e);
      return 0;
    }
  });

  const activeSkin = skins.find(s => s.id === activeSkinId) || DEFAULT_SKIN;

  const handleStartGame = () => {
    setGameState(GameState.PLAYING);
  };

  const handleOpenRunner = () => {
    setIsHome(false);
    setGameState(GameState.MENU);
  };

  const handleBackToHome = () => {
    setGameState(GameState.MENU);
    setIsHome(true);
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('bunny_high_score', score.toString());
      } catch (e) {
        console.warn('Failed to save to local storage', e);
      }
    }
    setGameState(GameState.MENU);
  };

  const basePath = window.location.pathname.includes('/puka-pixel-adventure/') ? '/puka-pixel-adventure' : '';

  return (
    <div className="min-h-screen bg-[#1b2e1b] flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-5xl py-4 md:py-0">
        
        {/* Header/Title */}
        {gameState !== GameState.PLAYING && isHome && (
          <div className="text-center mb-10 animate-bounce">
            <h1 className="text-4xl md:text-6xl text-[#FFEB3B] pixel-text mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
              Puka&apos;s Party
            </h1>
            <p className="text-[#A5D6A7] text-sm md:text-lg">
              Waehle ein Spiel und starte mit Puka ins Abenteuer.
            </p>
          </div>
        )}

        {/* --- HOME --- */}
        {isHome && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#2E7D32] p-5 rounded-lg border-4 border-[#1B5E20] shadow-xl flex flex-col">
              <h2 className="text-[#E8F5E9] text-lg mb-3 pixel-text">Puka&apos;s Party</h2>
              <p className="text-[#C8E6C9] text-xs md:text-sm mb-6 leading-6">
                Endlos-Runner: Springe, weiche aus und hole den besten Punktestand mit deinem Hasen.
              </p>
              <button
                onClick={handleOpenRunner}
                className="mt-auto bg-[#F06292] hover:bg-[#EC407A] text-white text-sm py-3 px-4 rounded border-b-4 border-[#880E4F] active:border-b-0 active:mt-[2px] font-bold pixel-text transition-all"
              >
                SPIELEN
              </button>
            </div>

            <div className="bg-[#2E7D32] p-5 rounded-lg border-4 border-[#1B5E20] shadow-xl flex flex-col">
              <h2 className="text-[#E8F5E9] text-lg mb-3 pixel-text">Gartengeheimnis</h2>
              <p className="text-[#C8E6C9] text-xs md:text-sm mb-6 leading-6">
                Schleichspiel: Sammle die Leckereien, ohne erwischt zu werden.
              </p>
              <a
                href={`${basePath}/puka-garden-mystery/`}
                className="mt-auto inline-flex justify-center bg-[#66BB6A] hover:bg-[#4CAF50] text-white text-sm py-3 px-4 rounded border-b-4 border-[#1B5E20] active:border-b-0 active:mt-[2px] font-bold pixel-text transition-all"
              >
                SPIELEN
              </a>
            </div>

            <div className="bg-[#2E7D32] p-5 rounded-lg border-4 border-[#1B5E20] shadow-xl flex flex-col">
              <h2 className="text-[#E8F5E9] text-lg mb-3 pixel-text">Super Blue Bunny Bros</h2>
              <p className="text-[#C8E6C9] text-xs md:text-sm mb-6 leading-6">
                Plattformspiel mit blauem Hasen, spielbar per Tastatur und iPhone.
              </p>
              <a
                href={`${basePath}/super-bunny-bros/`}
                className="mt-auto inline-flex justify-center bg-[#42A5F5] hover:bg-[#1E88E5] text-white text-sm py-3 px-4 rounded border-b-4 border-[#0D47A1] active:border-b-0 active:mt-[2px] font-bold pixel-text transition-all"
              >
                SPIELEN
              </a>
            </div>

            <div className="bg-[#2E7D32] p-5 rounded-lg border-4 border-[#1B5E20] shadow-xl flex flex-col">
              <h2 className="text-[#E8F5E9] text-lg mb-3 pixel-text">Puka Memory</h2>
              <p className="text-[#C8E6C9] text-xs md:text-sm mb-6 leading-6">
                Memory mit Puka, Familie, Tieren und Flaggen.
              </p>
              <a
                href={`${basePath}/puka-memory/`}
                className="mt-auto inline-flex justify-center bg-[#FFCA28] hover:bg-[#FFB300] text-[#1B5E20] text-sm py-3 px-4 rounded border-b-4 border-[#F57F17] active:border-b-0 active:mt-[2px] font-bold pixel-text transition-all"
              >
                SPIELEN
              </a>
            </div>
          </div>
        )}

        {/* --- MAIN MENU --- */}
        {!isHome && gameState === GameState.MENU && (
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-3xl md:text-5xl text-[#FFEB3B] pixel-text drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-center">
              Puka&apos;s Party
            </h1>
            
            <div className="bg-[#2E7D32] p-6 rounded-lg border-4 border-[#1B5E20] shadow-xl w-full max-w-md">
              <h2 className="text-[#E8F5E9] text-xl mb-4 text-center pixel-text">GAST WAHLEN</h2>
              <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2">
                {skins.map(skin => (
                  <button
                    key={skin.id}
                    onClick={() => setActiveSkinId(skin.id)}
                    className={`aspect-square rounded border-2 flex flex-col items-center justify-center p-1 transition-all ${
                      activeSkinId === skin.id 
                        ? 'border-[#FFEB3B] bg-[#1B5E20] scale-105 shadow-[0_0_10px_rgba(255,235,59,0.5)]' 
                        : 'border-[#558B2F] bg-[#1B5E20]/50 hover:border-[#81C784]'
                    }`}
                  >
                    {skin.imageUrl ? (
                      <img src={skin.imageUrl} alt={skin.name} className="w-full h-full object-contain pixelated" style={{ imageRendering: 'pixelated' }} />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-[10px] text-black font-bold relative overflow-hidden ${
                        skin.id === 'bebe-puka' ? 'bg-white' : skin.id === 'maman-puka' ? 'bg-[#B3E5FC]' : 'bg-[#E5C098]'
                      }`}>
                        <span className="z-10">
                          {skin.id === 'bebe-puka' ? 'BABY' : skin.id === 'maman-puka' ? 'MAMA' : 'PUKA'}
                        </span>
                        <div className="absolute bottom-0 w-full h-1/4 bg-[#F48FB1]"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="bg-[#F06292] hover:bg-[#EC407A] text-white text-2xl py-4 px-12 rounded border-b-8 border-[#880E4F] active:border-b-0 active:mt-2 font-bold shadow-2xl pixel-text transition-all"
            >
              STARTEN
            </button>

            {highScore > 0 && (
              <div className="text-[#FFEB3B] text-lg pixel-text mt-4">
                BESTE PARTY-PUNKTE: {highScore}
              </div>
            )}

            <button
              onClick={handleBackToHome}
              className="bg-[#546E7A] hover:bg-[#455A64] text-white text-sm md:text-base py-3 px-6 rounded border-b-4 border-[#263238] active:border-b-0 active:mt-1 font-bold shadow-xl pixel-text transition-all"
            >
              SPIELE-UEBERSICHT
            </button>
          </div>
        )}

        {/* --- GAME RUNNER --- */}
        {gameState === GameState.PLAYING && (
          <GameRunner 
            activeSkin={activeSkin} 
            onGameOver={handleGameOver}
            onBack={() => setGameState(GameState.MENU)}
          />
        )}

      </div>
    </div>
  );
};

export default App;
