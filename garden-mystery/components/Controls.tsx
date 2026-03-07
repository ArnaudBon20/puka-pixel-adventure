import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Hand, Search, Box } from 'lucide-react';
import { clsx } from 'clsx';

interface ControlsProps {
  onMove: (dx: number, dy: number) => void;
  onSniffStart: () => void;
  onSniffEnd: () => void;
  onItem: (type: 'yarn' | 'toy') => void;
  yarnCount: number;
  toyCount: number;
  isSniffing: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onMove, 
  onSniffStart, 
  onSniffEnd, 
  onItem, 
  yarnCount, 
  toyCount,
  isSniffing
}) => {
  const btnClass = "bg-[#2E7D32] border-2 border-[#1B5E20] rounded-lg active:bg-[#1B5E20] shadow-md touch-manipulation flex items-center justify-center transition-transform active:scale-95 text-[#E8F5E9]";

  return (
    <div className="w-full max-w-2xl mt-4 px-4 flex justify-between items-end gap-4 select-none">
      {/* D-Pad */}
      <div className="grid grid-cols-3 gap-2 w-40 h-40">
        <div />
        <button 
          className={clsx(btnClass, "h-12")}
          onPointerDown={(e) => { e.preventDefault(); onMove(0, -1); }}
        >
          <ChevronUp size={28} className="text-[#E8F5E9]" />
        </button>
        <div />
        
        <button 
          className={clsx(btnClass, "h-12")}
          onPointerDown={(e) => { e.preventDefault(); onMove(-1, 0); }}
        >
          <ChevronLeft size={28} className="text-[#E8F5E9]" />
        </button>
        <button 
          className={clsx(btnClass, "h-12 bg-[#1B5E20]")} // Center dummy
          disabled
        >
          <div className="w-2 h-2 bg-[#81C784] rounded-full" />
        </button>
        <button 
          className={clsx(btnClass, "h-12")}
          onPointerDown={(e) => { e.preventDefault(); onMove(1, 0); }}
        >
          <ChevronRight size={28} className="text-[#E8F5E9]" />
        </button>
        
        <div />
        <button 
          className={clsx(btnClass, "h-12")}
          onPointerDown={(e) => { e.preventDefault(); onMove(0, 1); }}
        >
          <ChevronDown size={28} className="text-[#E8F5E9]" />
        </button>
        <div />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pb-2">
         <div className="flex gap-3">
            <button 
                className={clsx(btnClass, "w-16 h-16 flex-col gap-1", isSniffing && "bg-[#F8BBD0] border-[#F06292]")}
                onPointerDown={(e) => { e.preventDefault(); onSniffStart(); }}
                onPointerUp={(e) => { e.preventDefault(); onSniffEnd(); }}
                onPointerLeave={(e) => { e.preventDefault(); onSniffEnd(); }}
            >
                <Search size={24} className={isSniffing ? "text-[#880E4F]" : "text-[#E8F5E9]"} />
                <span className="text-[9px] uppercase">Schnueffeln</span>
            </button>
         </div>
         <div className="flex gap-3">
             <button 
                className={clsx(btnClass, "w-14 h-14 flex-col gap-0.5", yarnCount === 0 && "opacity-50")}
                onClick={() => onItem('yarn')}
                disabled={yarnCount === 0}
             >
                <div className="w-4 h-4 bg-rose-400 rounded-full border border-rose-600 shadow-sm" />
                <span className="text-[9px] text-[#E8F5E9]">Garn ({yarnCount})</span>
             </button>
             <button 
                className={clsx(btnClass, "w-14 h-14 flex-col gap-0.5", toyCount === 0 && "opacity-50")}
                onClick={() => onItem('toy')}
                disabled={toyCount === 0}
             >
                <div className="w-4 h-4 bg-yellow-400 rounded-md border border-yellow-600 shadow-sm" />
                <span className="text-[9px] text-[#E8F5E9]">Spielz. ({toyCount})</span>
             </button>
         </div>
      </div>
    </div>
  );
};

export default Controls;
