import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-darkBg to-darkBg -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neonGreen/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center px-4 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto bg-panelBg border border-gray-700 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(57,255,20,0.2)]"
        >
          <BarChart2 className="w-10 h-10 text-neonGreen" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Advanced IPL Match
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonGreen to-emerald-400">
            Win Predictor
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience real-time sports analytics with our cutting-edge machine learning model. Get live win probabilities, required run rates, and match insights instantly.
        </p>

        <Link to="/predict">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-neonGreen to-emerald-600 rounded-full overflow-hidden shadow-[0_0_40px_rgba(57,255,20,0.4)] hover:shadow-[0_0_60px_rgba(57,255,20,0.6)] transition-all"
          >
            <span className="mr-2 text-lg">Start Prediction</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
