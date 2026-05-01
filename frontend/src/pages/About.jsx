import { motion } from "framer-motion";
import { BrainCircuit, Database, Cpu, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panelBg rounded-2xl border border-gray-800 p-8 md:p-12 shadow-xl"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our IPL Match Predictor uses an advanced Machine Learning model trained on historical IPL match data to calculate real-time win probabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-darkBg rounded-xl p-6 border border-gray-800">
            <Database className="w-10 h-10 text-neonGreen mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Historical Data</h3>
            <p className="text-gray-400">
              The model is trained on thousands of past IPL matches, analyzing ball-by-ball data, team performances, and venue statistics to identify winning patterns.
            </p>
          </div>
          
          <div className="bg-darkBg rounded-xl p-6 border border-gray-800">
            <BrainCircuit className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Machine Learning</h3>
            <p className="text-gray-400">
              We use Logistic Regression/Random Forest algorithms to calculate probabilities based on current match situations, including run rates and wickets in hand.
            </p>
          </div>

          <div className="bg-darkBg rounded-xl p-6 border border-gray-800">
            <Zap className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Analysis</h3>
            <p className="text-gray-400">
              As the match progresses, the model recalibrates the win probability dynamically based on the current Run Rate (CRR) and Required Run Rate (RRR).
            </p>
          </div>

          <div className="bg-darkBg rounded-xl p-6 border border-gray-800">
            <Cpu className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Backend Integration</h3>
            <p className="text-gray-400">
              A robust Python Flask backend serves the prediction API, seamlessly integrating the trained ML model with our responsive React frontend.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
