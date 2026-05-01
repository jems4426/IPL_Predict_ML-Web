import { Link, useLocation } from "react-router-dom";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Predict", path: "/predict" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-panelBg/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-neonGreen" />
            <span className="font-bold text-xl tracking-wider text-white">
              IPL<span className="text-neonRed">PREDICT</span>
            </span>
          </Link>
          <div className="flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-white text-gray-300"
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neonGreen"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
