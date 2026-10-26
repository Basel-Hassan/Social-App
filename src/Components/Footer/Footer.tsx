import {
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiTwitter
} from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo2.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/suggestions", label: "Suggestions"},
  { to: "/settings", label: "Settings" },
];

const socials = [
  { href: "https://github.com/Basel-Hassan", label: "GitHub", icon: FiGithub },
  { href: "https://www.linkedin.com/in/basel-hassan-dev/", label: "LinkedIn", icon: FiLinkedin },
  { href: "#", label: "Twitter", icon: FiTwitter },
  { href: "#", label: "Instagram", icon: FiInstagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-center sm:gap-6 justify-between">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-40 sm:w-48"><img src={logo} alt="Elvora" className="w-full"/></div>
            </Link>
          </div>

          <ul className="hidden sm:flex items-center gap-1 sm:gap-2">
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
                  className="flex w-8 h-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-50 text-lg text-slate-500 ring-1 ring-slate-100 transition hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-200 hover:ring-indigo-600"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
