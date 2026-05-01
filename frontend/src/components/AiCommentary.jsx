import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic2 } from "lucide-react";

export default function AiCommentary({ winProb, matchState, rrr }) {
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  
  const prevScore = useRef(matchState.score);
  const prevWickets = useRef(matchState.wickets);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let newText = "";
    let isEvent = false;

    const runsScored = matchState.score - prevScore.current;
    const wicketFell = matchState.wickets < prevWickets.current;

    if (wicketFell) {
      newText = "OUT! Huge wicket falls! The pressure is mounting! 😱";
      isEvent = true;
    } else if (runsScored >= 6) {
      newText = "SIX! Into the stands! What a massive strike! 🚀";
      isEvent = true;
    } else if (runsScored >= 4) {
      newText = "FOUR! Pierces the gap beautifully! 🏏";
      isEvent = true;
    } else {
      // Fallback base commentary based on situation
      if (winProb > 75) newText = "Dominating performance. They are cruising to victory! 🔥";
      else if (winProb > 55) newText = "Strong position, but they can't afford to be complacent. 😎";
      else if (winProb > 40) newText = "The game hangs in the balance! Every ball counts now! ⚖️";
      else if (rrr > 12) newText = "Required rate is skyrocketing! They need boundaries urgently! 🚨";
      else newText = "Under immense pressure. It's an uphill battle from here. 😬";
    }

    if (newText !== text) {
      setText(newText);
      setDisplayText("");
    }

    // Update refs for next render
    prevScore.current = matchState.score;
    prevWickets.current = matchState.wickets;

    // If an event occurred, we clear the event message after 4 seconds and revert to base
    if (isEvent) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        let baseText = "Under immense pressure. It's an uphill battle from here. 😬";
        if (winProb > 75) baseText = "Dominating performance. They are cruising to victory! 🔥";
        else if (winProb > 55) baseText = "Strong position, but they can't afford to be complacent. 😎";
        else if (winProb > 40) baseText = "The game hangs in the balance! Every ball counts now! ⚖️";
        else if (rrr > 12) baseText = "Required rate is skyrocketing! They need boundaries urgently! 🚨";
        
        setText(baseText);
        setDisplayText("");
      }, 4000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [winProb, matchState.score, matchState.wickets, rrr, text]);

  useEffect(() => {
    if (text === "") return;
    
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(intervalId);
    }, 30); // Faster typing speed for hype

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-panelBg/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Mic2 className="w-24 h-24" />
      </div>
      <h3 className="text-neonGreen text-sm font-bold tracking-wider mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neonRed animate-pulse"></span>
        AI COMMENTARY
      </h3>
      <div className="min-h-[60px] flex items-center">
        <p className="text-xl md:text-2xl font-medium text-white italic">
          "{displayText}"<span className="animate-pulse">_</span>
        </p>
      </div>
    </motion.div>
  );
}
