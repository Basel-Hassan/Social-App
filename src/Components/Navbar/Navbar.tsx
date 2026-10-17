import { useContext } from "react";
import { FiHome, FiLogIn, FiLogOut, FiUser, FiUserPlus } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "../../Context/LoginContext";

export default function Navbar() {
  const { userLogin, setUserLogin } = useContext(LoginContext);
  const navigat = useNavigate()

  const links = userLogin
    ? [
        { to: "/", label: "Home", icon: FiHome },
        { to: "/profile", label: "Profile", icon: FiUser },
      ]
    : [
        { to: "/register", label: "Register", icon: FiUserPlus },
        { to: "/login", label: "Login", icon: FiLogIn },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16  items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <FiHome className="text-xl" />
          </span>
          <span className="hidden text-lg font-bold text-slate-900 sm:block">
            MyApp
          </span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                aria-label={label}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition sm:px-4 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`
                }
              >
                <Icon className="text-lg" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            </li>
          ))}

          {!userLogin ? (
            ""
          ) : (
            <>
              {/* Divider */}
              <li
                aria-hidden="true"
                className="mx-1 h-6 w-px bg-slate-200 sm:mx-2"
              />

              {/* Logout */}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("userToken")
                    setUserLogin(null)
                    navigat("/login")
                  }}
                  aria-label="Logout"
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-200 focus:outline-none focus:ring-4 focus:ring-red-100 sm:px-4"
                >
                  <FiLogOut className="text-lg" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
