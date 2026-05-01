import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPrediction } from '../services/api';
import { getDerivedMatchState, sanitizeNumber } from '../utils/calculations';

export const useMatchSimulation = (initialMatchDetails, initialPrediction) => {
  // Deep sanitize initial state to prevent any NaN from entering the app
  const safeInitialScore = sanitizeNumber(initialMatchDetails?.score, 0);
  const safeInitialTarget = sanitizeNumber(initialMatchDetails?.target, 1);
  const safeInitialOvers = sanitizeNumber(initialMatchDetails?.overs, 0);
  const safeInitialWicketsLost = sanitizeNumber(initialMatchDetails?.wickets_lost, 0);
  
  const initialState = {
    score: safeInitialScore,
    overs: safeInitialOvers,
    wickets: 10 - safeInitialWicketsLost, // Wickets remaining
    target: safeInitialTarget,
    batting_team: initialMatchDetails?.batting_team || 'Unknown',
    bowling_team: initialMatchDetails?.bowling_team || 'Unknown',
    city: initialMatchDetails?.city || 'Unknown',
    runs_left: Math.max(0, safeInitialTarget - safeInitialScore),
    balls_left: Math.max(0, 120 - Math.floor(safeInitialOvers * 6) - Math.floor((safeInitialOvers % 1) * 10)),
  };

  // Single source of truth for match state
  const [matchState, setMatchState] = useState(initialState);

  // Single source of truth for prediction result
  const safeInitialWinProb = sanitizeNumber(initialPrediction?.win_prob, 50);
  const [resultState, setResultState] = useState({
    winProb: safeInitialWinProb,
    loseProb: 100 - safeInitialWinProb,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Use refs to access latest state inside intervals without re-triggering them
  const stateRef = useRef(matchState);
  useEffect(() => {
    stateRef.current = matchState;
  }, [matchState]);

  // Initial chart setup
  useEffect(() => {
    const points = [];
    let prob = 50;
    for (let i = 0; i <= 5; i++) {
      points.push({
        over: sanitizeNumber(i * Math.floor(matchState.overs / 5), 0),
        Win: i === 5 ? safeInitialWinProb : prob,
      });
      prob = prob + (safeInitialWinProb - prob) / (5 - i);
    }
    // Filter out any NaN points before setting
    setChartData(points.filter(p => !isNaN(p.Win) && !isNaN(p.over)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API Call logic
  const triggerPrediction = useCallback(async (currentState, signal) => {
    setIsLoading(true);
    const derivedState = getDerivedMatchState(currentState);

    const payload = {
      batting_team: currentState.batting_team,
      bowling_team: currentState.bowling_team,
      city: currentState.city,
      runs_left: sanitizeNumber(derivedState.runs_left, 0),
      balls_left: sanitizeNumber(derivedState.balls_left, 0),
      wickets: sanitizeNumber(derivedState.wickets, 0),
      total_runs_x: sanitizeNumber(derivedState.target, 0),
      crr: sanitizeNumber(derivedState.crr, 0),
      rrr: sanitizeNumber(derivedState.rrr, 0),
    };

    console.log("🚀 [DEBUG] API Payload:", payload);

    try {
      const prediction = await fetchPrediction(payload, signal);
      console.log("✅ [DEBUG] API Response:", prediction);
      
      const newWinProb = sanitizeNumber(prediction.win_prob, 50);
      const newLoseProb = sanitizeNumber(prediction.lose_prob, 50);

      setResultState({
        winProb: newWinProb,
        loseProb: newLoseProb,
      });

      setChartData((prev) => {
        const overVal = sanitizeNumber(derivedState.overs, 0);
        if (isNaN(newWinProb) || isNaN(overVal)) return prev; // Graph Validation Guard

        const newPoint = { over: overVal, Win: newWinProb };
        const filtered = prev.filter(p => p.over !== overVal && !isNaN(p.Win) && !isNaN(p.over));
        // Keep graph history size bounded to 120 points (balls)
        const updatedHistory = [...filtered, newPoint].sort((a, b) => a.over - b.over);
        return updatedHistory.length > 120 ? updatedHistory.slice(-120) : updatedHistory;
      });
    } catch (err) {
      if (err.message === "Canceled") return; // Ignore canceled requests entirely
      
      console.error("❌ [DEBUG] API Error, executing safe fallback.", err);
      // Safe fallback
      const rrrSafe = sanitizeNumber(derivedState.rrr, 0);
      const wicketsSafe = sanitizeNumber(derivedState.wickets, 0);
      const mockWinProb = Math.max(1, Math.min(99, 50 + (rrrSafe > 10 ? -20 : rrrSafe < 6 ? 20 : 0) + (wicketsSafe > 7 ? 15 : -15)));
      
      setResultState({ winProb: mockWinProb, loseProb: 100 - mockWinProb });
      
      setChartData((prev) => {
        const overVal = sanitizeNumber(derivedState.overs, 0);
        if (isNaN(mockWinProb) || isNaN(overVal)) return prev;
        
        const newPoint = { over: overVal, Win: mockWinProb };
        const filtered = prev.filter(p => p.over !== overVal && !isNaN(p.Win) && !isNaN(p.over));
        // Keep graph history size bounded to 120 points (balls)
        const updatedHistory = [...filtered, newPoint].sort((a, b) => a.over - b.over);
        return updatedHistory.length > 120 ? updatedHistory.slice(-120) : updatedHistory;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced API Trigger on State Change
  useEffect(() => {
    const controller = new AbortController();
    
    const handler = setTimeout(() => {
      triggerPrediction(matchState, controller.signal);
    }, 300); // 300ms debounce
    
    return () => {
      clearTimeout(handler);
      controller.abort(); // Cancel previous API call if state changes rapidly
    };
  }, [matchState, triggerPrediction]);

  // Live Mode Auto-Simulation
  useEffect(() => {
    let intervalId;
    if (isLiveMode) {
      intervalId = setInterval(() => {
        setMatchState((prev) => {
          if (prev.balls_left <= 0 || prev.runs_left <= 0 || prev.wickets <= 0) {
            setIsLiveMode(false); // Stop simulation if match is over
            return prev;
          }

          const simulatedRuns = Math.floor(Math.random() * 7); // 0-6 runs
          const isWicket = Math.random() < 0.05; // 5% chance of wicket

          const newScore = sanitizeNumber(prev.score + simulatedRuns, 0);
          const newBallsLeft = sanitizeNumber(prev.balls_left - 1, 0);
          const newWickets = isWicket ? Math.max(0, sanitizeNumber(prev.wickets - 1, 0)) : sanitizeNumber(prev.wickets, 0);
          const newRunsLeft = Math.max(0, sanitizeNumber(prev.target - newScore, 0));
          
          // Calculate new overs safely
          const ballsBowled = 120 - newBallsLeft;
          const overBowled = Math.floor(ballsBowled / 6) + ((ballsBowled % 6) / 10);

          return {
            ...prev,
            score: newScore,
            balls_left: newBallsLeft,
            wickets: newWickets,
            runs_left: newRunsLeft,
            overs: sanitizeNumber(Number(overBowled.toFixed(1)), 0),
          };
        });
      }, 2000); // Trigger every 2 seconds for visibility
    }
    return () => clearInterval(intervalId);
  }, [isLiveMode]);

  const updateMatchState = (updater) => {
    setMatchState(updater);
  };

  const resetMatch = () => {
    setMatchState(initialState);
    setIsLiveMode(false);
  };

  const toggleLiveMode = () => setIsLiveMode((prev) => !prev);

  // Derived calculations for current render
  const derivedCalculations = getDerivedMatchState(matchState);

  console.log("📊 [DEBUG] Current matchState:", matchState);

  return {
    matchState,
    updateMatchState,
    resetMatch,
    resultState,
    derivedCalculations,
    isLoading,
    isLiveMode,
    toggleLiveMode,
    chartData
  };
};
