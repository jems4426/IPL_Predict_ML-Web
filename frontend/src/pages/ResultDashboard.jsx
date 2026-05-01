import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Target, Activity } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import clsx from "clsx";

import { getTeamColor, getTeamAbbr } from "../utils/constants";
import { useMatchSimulation } from "../hooks/useMatchSimulation";
import LiveSimulator from "../components/LiveSimulator";
import AiCommentary from "../components/AiCommentary";
import MatchPressureMeter from "../components/MatchPressureMeter";

export default function ResultDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if no data
  if (!location.state || !location.state.prediction) {
    return <Navigate to="/predict" />;
  }

  const {
    matchState,
    updateMatchState,
    resetMatch,
    resultState,
    derivedCalculations,
    isLoading,
    isLiveMode,
    toggleLiveMode,
    chartData
  } = useMatchSimulation(location.state.matchDetails, location.state.prediction);

  const { winProb, loseProb } = resultState;
  const { score, overs, wickets, target, batting_team, bowling_team, city } = matchState;
  const { crr, rrr } = derivedCalculations;

  const formattedWinProb = Number(winProb.toFixed(1));
  const formattedLoseProb = Number(loseProb.toFixed(1));

  // Dynamic Theme
  const themeColor = getTeamColor(batting_team);
  const oppColor = getTeamColor(bowling_team);
  const batAbbr = getTeamAbbr(batting_team);
  const bowlAbbr = getTeamAbbr(bowling_team);

  let pressureStatus = "Under pressure";
  let pressureColor = "text-neonRed";
  if (formattedWinProb >= 70) {
    pressureStatus = "Dominating performance";
    pressureColor = "text-neonGreen";
  } else if (formattedWinProb >= 40) {
    pressureStatus = "Balanced match";
    pressureColor = "text-yellow-400";
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-panelBg/90 backdrop-blur-sm border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300 text-sm mb-1">Over: {label}</p>
          <p className="font-bold" style={{ color: themeColor }}>
            Win Prob: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Color-coded animation cards
  const isWinning = formattedWinProb >= 50;
  const statusColorClass = isWinning ? "text-neonGreen" : "text-neonRed";
  const borderStatusClass = isWinning ? "border-neonGreen/30" : "border-neonRed/30";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <button
        onClick={() => navigate("/predict")}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Predictor
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Probability Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 bg-panelBg/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden group"
          style={{ boxShadow: `0 10px 40px -10px ${themeColor}20` }}
        >
          {/* Dynamic Glow background */}
          <div 
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000"
            style={{ backgroundColor: themeColor }}
          />

          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Target className="w-64 h-64" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-12 relative z-10">
            <div className="text-center md:text-left mb-6 md:mb-0 flex-1">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white/20 flex items-center justify-center font-black text-xl text-white" style={{ backgroundColor: themeColor }}>
                  {batAbbr}
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">{batting_team}</h2>
              </div>
              <p className="text-xl font-semibold mt-2" style={{ color: themeColor }}>Chasing {target}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 mb-6 md:mb-0">
              <span className="px-4 py-1 rounded-full bg-darkBg border border-gray-700 text-xs font-bold tracking-widest text-gray-400 mb-2">
                LIVE SIMULATION
              </span>
              <p className="text-sm text-gray-500 font-medium">{city}</p>
            </div>

            <div className="text-center md:text-right flex-1">
              <div className="flex items-center justify-center md:justify-end gap-4 mb-2">
                <h2 className="text-3xl font-black text-gray-300 tracking-tight">{bowling_team}</h2>
                <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white/10 flex items-center justify-center font-black text-xl text-white/50" style={{ backgroundColor: oppColor }}>
                  {bowlAbbr}
                </div>
              </div>
              <p className="text-xl font-semibold mt-2 text-gray-500">Defending</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-4 relative z-10">
            {/* Circular Indicator */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                <circle cx="96" cy="96" r="88" className="stroke-gray-800/50" strokeWidth="12" fill="none" />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="552.92"
                  initial={{ strokeDashoffset: 552.92 }}
                  animate={{ strokeDashoffset: 552.92 - (552.92 * formattedWinProb) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                  style={{ stroke: themeColor, filter: `drop-shadow(0 0 8px ${themeColor}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={formattedWinProb}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-black text-white"
                  >
                    {formattedWinProb}%
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm text-gray-400 mt-1 font-medium tracking-wide">WIN CHANCE</span>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="flex-1 w-full max-w-sm">
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 font-bold tracking-wide">
                  <span style={{ color: themeColor }}>{batAbbr}</span>
                  <span className="text-white">{formattedWinProb}%</span>
                </div>
                <div className="h-4 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${formattedWinProb}%` }}
                    transition={{ duration: 1, type: "spring", stiffness: 50 }}
                    className="h-full relative"
                    style={{ backgroundColor: themeColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                  </motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-bold tracking-wide">
                  <span style={{ color: oppColor }}>{bowlAbbr}</span>
                  <span className="text-white">{formattedLoseProb}%</span>
                </div>
                <div className="h-4 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${formattedLoseProb}%` }}
                    transition={{ duration: 1, type: "spring", stiffness: 50 }}
                    className="h-full relative"
                    style={{ backgroundColor: oppColor }}
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Simulator Panel */}
        <div className="lg:col-span-4 h-full">
           <LiveSimulator 
             matchState={matchState}
             updateMatchState={updateMatchState}
             resetMatch={resetMatch}
             isLiveMode={isLiveMode}
             toggleLiveMode={toggleLiveMode}
           />
        </div>

        {/* Secondary Info Row */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-panelBg/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-xl"
          >
            <h3 className="text-gray-400 text-sm font-medium mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2" /> Match Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={clsx(`bg-darkBg/50 rounded-xl p-4 border ${borderStatusClass} backdrop-blur-sm transition-colors`, isLoading && "animate-pulse opacity-60")}>
                  <p className="text-gray-400 text-xs mb-1 font-semibold tracking-wider">SCORE</p>
                  <p className={`text-2xl font-bold ${statusColorClass}`}>
                    {score}/{10 - wickets}
                  </p>
                </motion.div>

                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={clsx("bg-darkBg/50 rounded-xl p-4 border border-gray-800/50 backdrop-blur-sm", isLoading && "animate-pulse opacity-60")}>
                  <p className="text-gray-400 text-xs mb-1 font-semibold tracking-wider">OVERS</p>
                  <p className="text-2xl font-bold text-white">{overs}</p>
                </motion.div>

                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={clsx("bg-darkBg/50 rounded-xl p-4 border border-gray-800/50 backdrop-blur-sm", isLoading && "animate-pulse opacity-60")}>
                  <p className="text-gray-400 text-xs mb-1 font-semibold tracking-wider">CRR</p>
                  <p className="text-2xl font-bold text-white">{crr.toFixed(2)}</p>
                </motion.div>

                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={clsx(`bg-darkBg/50 rounded-xl p-4 border ${borderStatusClass} backdrop-blur-sm transition-colors`, isLoading && "animate-pulse opacity-60")}>
                  <p className="text-gray-400 text-xs mb-1 font-semibold tracking-wider">RRR</p>
                  <p className={`text-2xl font-bold ${rrr > 10 ? "text-neonRed" : rrr < 6 ? "text-neonGreen" : "text-yellow-400"}`}>
                    {rrr.toFixed(2)}
                  </p>
                </motion.div>
              </AnimatePresence>

            </div>
          </motion.div>

          <MatchPressureMeter crr={crr} rrr={rrr} />
        </div>

        {/* AI Commentary and Graph */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AiCommentary winProb={formattedWinProb} matchState={matchState} rrr={rrr} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-panelBg/80 backdrop-blur-md rounded-2xl border border-gray-800 p-8 shadow-xl flex-1"
          >
            <h3 className="text-white font-semibold mb-6 flex items-center">
              Win Probability Trend
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorWin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.5} />
                  <XAxis dataKey="over" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Win" 
                    stroke={themeColor} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorWin)"
                    isAnimationActive={!isLiveMode} 
                    activeDot={{ r: 8, fill: themeColor, stroke: '#111827', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
