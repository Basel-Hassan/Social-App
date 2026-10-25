import {
  FiGithub,
  FiHome,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/suggestions", label: "Suggestions"},
  { to: "/settings", label: "Settings" },
];

const socials = [
  { href: "#", label: "GitHub", icon: FiGithub },
  { href: "#", label: "LinkedIn", icon: FiLinkedin },
  { href: "#", label: "Twitter", icon: FiTwitter },
  { href: "#", label: "Instagram", icon: FiInstagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <FiHome className="text-xl" />
              </span>
              <span className="text-lg font-bold text-slate-900">MyApp</span>
            </Link>
            <p className="max-w-xs text-center text-sm text-slate-500 md:text-left">
              Share moments, follow people, and stay connected.
            </p>
          </div>

          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 sm:px-4"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex items-center gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg text-slate-500 ring-1 ring-slate-100 transition hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-200 hover:ring-indigo-600"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} BaselDev. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
