import React from 'react';
import { GameState, LevelConfig } from '../types';
import { RotateCcw, Home } from 'lucide-react';

interface UIOverlayProps {
  gameState: GameState;
  currentLevel: LevelConfig;
  treatsLeft: number;
  onRestart: () => void;
  onHome: () => void;
  isSniffing: boolean;
  moveCount: number;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  gameState, 
  currentLevel, 
  treatsLeft, 
  onRestart,
  onHome,
  isSniffing,
  moveCount
}) => {
  const movesUntilActive = Math.max(0, 5 - moveCount);

  return (
    <div className="w-full max-w-2xl bg-[#2E7D32] border-4 border-[#1B5E20] p-4 rounded-lg shadow-xl text-[#E8F5E9] mb-4 flex flex-col gap-2">
      <div className="flex justify-between items-center border-b border-[#558B2F] pb-2">
        <div>
          <h2 className="text-base md:text-lg pixel-text">{currentLevel.name}</h2>
          <p className="text-xs opacity-80 mt-1">{currentLevel.description}</p>
        </div>
        <div className="flex gap-2">
             <button onClick={onRestart} className="p-2 hover:bg-[#1B5E20] rounded border border-[#558B2F]" title="Level neu starten">
                <RotateCcw size={20} />
             </button>
             <button onClick={onHome} className="px-2 py-2 hover:bg-[#1B5E20] rounded border border-[#558B2F] text-[10px] inline-flex items-center gap-1" title="Alle Spiele">
                <Home size={20} />
                <span>Alle Spiele</span>
             </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2" title="Karotten uebrig">
            <span className="text-2xl">🥕</span>
            <span className="text-2xl font-bold">{treatsLeft}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
             <div className="flex items-center gap-1 opacity-70">
                <div className="w-4 h-4 bg-rose-400 rounded-full border border-rose-600"></div>
                <span>x {gameState.items.yarn} (Taste 1)</span>
             </div>
             <div className="flex items-center gap-1 opacity-70">
                <div className="w-4 h-4 bg-yellow-400 rounded-md border border-yellow-600"></div>
                <span>x {gameState.items.toys} (Taste 2)</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
            {movesUntilActive > 0 ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded text-[10px] bg-[#90CAF9] border border-[#42A5F5] text-[#0D47A1]">
                    <span>👱‍♂️</span>
                    <span>Junge wartet: {movesUntilActive}</span>
                </div>
            ) : (
                <div className={`px-3 py-1 rounded text-[10px] border ${isSniffing ? 'bg-[#F8BBD0] border-[#F06292] text-[#880E4F] animate-pulse' : 'bg-[#1B5E20] border-[#558B2F] text-[#C8E6C9]'}`}>
                    {isSniffing ? 'SCHNUEFFELN...' : 'LEERTASTE HALTEN ZUM SCHNUEFFELN'}
                </div>
            )}
        </div>
      </div>

      {gameState.messages.length > 0 && (
        <div className="bg-[#1B5E20] border border-[#558B2F] p-2 text-center text-[#E8F5E9] text-xs rounded animate-fade-in-up">
           {gameState.messages[gameState.messages.length - 1]}
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
