import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "./Brand";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#101a35] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Brand light />

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A full-stack business management platform built to simplify
              workflows, organize leads and demonstrate secure application
              architecture.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold">Explore</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <a href="/#features" className="hover:text-white">
                Features
              </a>
              <a href="/#technology" className="hover:text-white">
                Technology
              </a>
              <a href="/#guide" className="hover:text-white">
                Project guide
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold">Project</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
              <Link to="/register" className="hover:text-white">
                Create account
              </Link>
              <a
                href="https://github.com/Subbu0071"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                GitHub <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NexaFlow. All rights reserved.</p>
          <p>Developed as a technical project for Conception Technology.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
