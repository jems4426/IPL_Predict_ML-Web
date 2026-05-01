/**
 * Safe calculation utility functions for match prediction
 */

// Safely calculate Current Run Rate (CRR)
export const calculateCRR = (score, overs) => {
  const safeScore = Number(score) || 0;
  const safeOvers = Number(overs) || 0;
  
  if (safeOvers === 0) return 0;
  return safeScore / safeOvers;
};

// Safely calculate Required Run Rate (RRR)
export const calculateRRR = (runsLeft, ballsLeft) => {
  const safeRunsLeft = Number(runsLeft) || 0;
  const safeBallsLeft = Number(ballsLeft) || 0;
  
  if (safeRunsLeft <= 0) return 0;
  if (safeBallsLeft === 0) return safeRunsLeft > 0 ? 99.99 : 0; // Extremely high RRR if balls are 0 and runs are left
  
  return (safeRunsLeft * 6) / safeBallsLeft;
};

// Ensure all numeric values are sanitized to prevent NaN
export const sanitizeNumber = (val, fallback = 0) => {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

// Calculate derived match state variables from inputs
export const getDerivedMatchState = (state) => {
  const score = sanitizeNumber(state.score);
  const target = sanitizeNumber(state.target);
  const overs = sanitizeNumber(state.overs);
  const wickets = sanitizeNumber(state.wickets); // wickets remaining

  // Fallback if runs_left or balls_left are not directly provided
  const runs_left = sanitizeNumber(state.runs_left, target - score);
  const balls_left = sanitizeNumber(state.balls_left, 120 - Math.floor(overs * 6) - Math.floor((overs % 1) * 10));

  const crr = calculateCRR(score, overs);
  const rrr = calculateRRR(runs_left, balls_left);

  return {
    runs_left,
    balls_left,
    crr,
    rrr,
    score,
    target,
    overs,
    wickets
  };
};
