import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Brand from "./Brand";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", to: "/" },
    { name: "Features", to: "/#features" },
    { name: "Technology", to: "/#technology" },
    { name: "Project Guide", to: "/#guide" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Brand />

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.to}
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://github.com/Subbu0071"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            GitHub
          </a>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Access workspace
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.to}
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {link.name}
              </a>
            ))}

            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-2 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Access workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
