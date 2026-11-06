import { Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

const Brand = ({ light = false }) => {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
        <Hexagon size={27} className="absolute text-white/50" />
        <span className="relative text-xl font-extrabold text-white">N</span>
      </div>

      <div>
        <span
          className={`block text-xl font-bold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          NexaFlow
        </span>
        <span
          className={`block text-[9px] font-semibold tracking-[0.19em] ${
            light ? "text-slate-400" : "text-slate-500"
          }`}
        >
          BUSINESS MANAGEMENT
        </span>
      </div>
    </Link>
  );
};

export default Brand;
