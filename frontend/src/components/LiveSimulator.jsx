import { motion } from "framer-motion";
import { Sliders, Zap, Play, Square, RotateCcw } from "lucide-react";

export default function LiveSimulator({ 
  matchState, 
  updateMatchState, 
  resetMatch,
  isLiveMode, 
  toggleLiveMode 
}) {
  
  const handleSliderChange = (field, value) => {
    updateMatchState((prev) => {
      const newState = { ...prev, [field]: value };
      
      // Keep state logically consistent based on sliders
      if (field === 'runs_left') {
        newState.score = prev.target - value;
      }
      if (field === 'balls_left') {
        const ballsBowled = 120 - value;
        newState.overs = Number((Math.floor(ballsBowled / 6) + ((ballsBowled % 6) / 10)).toFixed(1));
      }
      return newState;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-panelBg/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-xl relative"
    >
      <div className="absolute -top-4 -right-4 flex items-center gap-2">
        <button 
          onClick={resetMatch}
          className="flex items-center gap-2 px-3 py-2 rounded-full font-bold shadow-lg transition-all bg-gray-700 text-white hover:bg-gray-600 hover:scale-105"
          title="Reset Match State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button 
          onClick={toggleLiveMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all ${
            isLiveMode 
              ? "bg-neonRed text-white shadow-[0_0_15px_rgba(255,7,58,0.6)] animate-pulse" 
              : "bg-neonGreen text-black shadow-[0_0_15px_rgba(57,255,20,0.6)] hover:scale-105"
          }`}
        >
          {isLiveMode ? (
            <><Square className="w-4 h-4 fill-current" /> STOP LIVE</>
          ) : (
            <><Play className="w-4 h-4 fill-current" /> AUTO SIM</>
          )}
        </button>
      </div>

      <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
        <Sliders className="w-5 h-5 text-emerald-400" /> Manual Simulator
      </h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Runs Required</label>
            <span className="text-neonGreen font-bold">{matchState.runs_left}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={matchState.target || 300} 
            value={matchState.runs_left} 
            onChange={(e) => handleSliderChange('runs_left', Number(e.target.value))}
            disabled={isLiveMode}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neonGreen disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>{matchState.target}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Balls Remaining</label>
            <span className="text-blue-400 font-bold">{matchState.balls_left}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="120" 
            value={matchState.balls_left} 
            onChange={(e) => handleSliderChange('balls_left', Number(e.target.value))}
            disabled={isLiveMode}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400 disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>120</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Wickets Remaining</label>
            <span className="text-neonRed font-bold">{matchState.wickets}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={matchState.wickets} 
            onChange={(e) => handleSliderChange('wickets', Number(e.target.value))}
            disabled={isLiveMode}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neonRed disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>10</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
