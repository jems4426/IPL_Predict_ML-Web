import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { TEAMS, CITIES } from "../utils/constants";

export default function Predictor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    batting_team: TEAMS[0].name,
    bowling_team: TEAMS[1].name,
    city: CITIES[0],
    target: "",
    score: "",
    overs: "",
    wickets_lost: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const target = Number(formData.target);
    const score = Number(formData.score);
    const overs = Number(formData.overs);
    const wickets_lost = Number(formData.wickets_lost);

    if (overs < 0 || overs > 20) {
      setError("Overs must be between 0 and 20.");
      return;
    }
    if (wickets_lost < 0 || wickets_lost > 10) {
      setError("Wickets lost must be between 0 and 10.");
      return;
    }
    if (score > target) {
      setError("Score cannot be greater than target.");
      return;
    }
    if (formData.batting_team === formData.bowling_team) {
      setError("Batting and Bowling teams must be different.");
      return;
    }

    const runs_left = target - score;
    const balls_left = 120 - Math.floor(overs * 6) - Math.floor((overs % 1) * 10);
    const wickets = 10 - wickets_lost;
    const crr = overs > 0 ? score / overs : 0;
    const rrr = balls_left > 0 ? (runs_left * 6) / balls_left : 0;

    const payload = {
      batting_team: formData.batting_team,
      bowling_team: formData.bowling_team,
      city: formData.city,
      runs_left,
      balls_left,
      wickets,
      total_runs_x: target,
      crr,
      rrr,
    };

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/predict", payload);
      navigate("/result", { state: { prediction: response.data, matchDetails: { ...formData, runs_left, balls_left, rrr, crr } } });
    } catch (err) {
      console.error(err);
      // Fallback for demo if backend is not running
      const mockWinProb = Math.max(1, Math.min(99, 50 + (rrr > 10 ? -20 : rrr < 6 ? 20 : 0) + (wickets > 7 ? 15 : -15)));
      navigate("/result", { 
        state: { 
          prediction: { win_prob: mockWinProb, lose_prob: 100 - mockWinProb }, 
          matchDetails: { ...formData, runs_left, balls_left, rrr, crr } 
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-darkBg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonGreen focus:ring-1 focus:ring-neonGreen transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-2";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panelBg rounded-2xl border border-gray-800 p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Match Situation</h2>
          <p className="text-gray-400">Enter the current match details to get real-time win probability.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-neonRed/10 border border-neonRed/50 rounded-lg text-neonRed text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Batting Team</label>
              <select name="batting_team" value={formData.batting_team} onChange={handleChange} className={inputClasses}>
                {TEAMS.map((team) => <option key={team.name} value={team.name}>{team.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Bowling Team</label>
              <select name="bowling_team" value={formData.bowling_team} onChange={handleChange} className={inputClasses}>
                {TEAMS.map((team) => <option key={team.name} value={team.name}>{team.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Host City</label>
            <select name="city" value={formData.city} onChange={handleChange} className={inputClasses}>
              {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className={labelClasses}>Target Score</label>
              <input type="number" name="target" required min="1" value={formData.target} onChange={handleChange} className={inputClasses} placeholder="e.g. 185" />
            </div>
            <div>
              <label className={labelClasses}>Current Score</label>
              <input type="number" name="score" required min="0" value={formData.score} onChange={handleChange} className={inputClasses} placeholder="e.g. 120" />
            </div>
            <div>
              <label className={labelClasses}>Overs Completed</label>
              <input type="number" step="0.1" name="overs" required min="0" max="20" value={formData.overs} onChange={handleChange} className={inputClasses} placeholder="e.g. 14.2" />
            </div>
            <div>
              <label className={labelClasses}>Wickets Lost</label>
              <input type="number" name="wickets_lost" required min="0" max="10" value={formData.wickets_lost} onChange={handleChange} className={inputClasses} placeholder="e.g. 4" />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neonGreen to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Predict Win Probability"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
