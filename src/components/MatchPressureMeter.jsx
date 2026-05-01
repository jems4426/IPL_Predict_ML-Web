import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";
import clsx from "clsx";

export default function MatchPressureMeter({ crr, rrr }) {
  const diff = rrr - crr;
  
  let pressureStatus = "Under pressure";
  let pressureColor = "text-neonRed";
  let borderColor = "border-neonRed/30";
  let isWinning = false;

  if (diff <= 0) {
    pressureStatus = "In total control";
    pressureColor = "text-neonGreen";
    borderColor = "border-neonGreen/30";
    isWinning = true;
  } else if (diff < 2) {
    pressureStatus = "Game is balanced";
    pressureColor = "text-yellow-400";
    borderColor = "border-yellow-400/30";
    isWinning = true;
  }

  // Map diff range [-5, +5] to percentage [100%, 0%]
  // diff = +5 (High pressure) -> 0% (Left)
  // diff = -5 (In control) -> 100% (Right)
  // diff = 0 -> 50% (Center)
  const markerPos = Math.max(0, Math.min(100, 50 - (diff * 10)));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-panelBg/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-shadow"
    >
      <h3 className="text-gray-400 text-sm font-medium mb-4 flex items-center">
        <ShieldAlert className="w-4 h-4 mr-2" /> Match Pressure (RRR vs CRR)
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className={clsx("p-3 rounded-full bg-darkBg border transition-colors duration-500", borderColor, pressureColor)}>
            {isWinning ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          </div>
          <div>
            <p className={clsx("text-lg font-bold transition-colors duration-500", pressureColor)}>{pressureStatus}</p>
            <p className="text-sm text-gray-500">Diff: {diff > 0 ? "+" : ""}{diff.toFixed(2)}</p>
          </div>
        </div>

        {/* Horizontal Bar for pressure */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1 font-semibold tracking-wider">
            <span className="text-neonRed">HIGH PRESSURE</span>
            <span className="text-neonGreen">IN CONTROL</span>
          </div>
          <div className="h-3 w-full bg-gradient-to-r from-neonRed via-yellow-400 to-neonGreen rounded-full relative overflow-hidden shadow-inner">
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] border-[3px] border-darkBg"
              initial={{ left: "50%" }}
              animate={{ left: `${markerPos}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
