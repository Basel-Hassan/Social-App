import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import {
  FiBell,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiSettings,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "../../Context/LoginContext";
import Notification from "../Notfication/Notfication";
import logo from "../../assets/logo2.png";
import smallLogo from "../../assets/smallLogo2.png";

export default function Navbar() {
  const { userLogin, setUserLogin } = useContext(LoginContext);
  const navigat = useNavigate();
  const [isNotficationOpen, setIsNotficationOpen] = useState(false);

  const links = userLogin
    ? [
        { to: "/", label: "Home", icon: FiHome },
        { to: "/profile", label: "Profile", icon: FiUser },
        { to: "/suggestions", label: "Suggestions", icon: FaUserPlus },
        { to: "/settings", icon: FiSettings },
      ]
    : [
        { to: "/register", label: "Register", icon: FiUserPlus },
        { to: "/login", label: "Login", icon: FiLogIn },
      ];

  function notficationCountApi() {
    return axios.get(
      `https://route-posts.routemisr.com/notifications/unread-count`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data } = useQuery({
    queryKey: ["getNotficationCount"],
    queryFn: notficationCountApi,
  });

  const unreadNotficationCount = data?.data.data.unreadCount;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 items-center justify-between gap-2 px-3 sm:px-4 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src={smallLogo}
            alt="Elvora"
            className="h-16 w-16 object-contain lg:hidden"
          />

          <img
            src={logo}
            alt="Elvora"
            className="hidden w-48 object-contain object-left lg:block"
          />
        </Link>

        <ul className="flex shrink-0 items-center gap-0.5 sm:gap-1 lg:gap-2">
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
                {label && <span className="hidden lg:inline">{label}</span>}
              </NavLink>
            </li>
          ))}

          {!userLogin ? (
            ""
          ) : (
            <>
              <li className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => {
                    setIsNotficationOpen(!isNotficationOpen);
                  }}
                  aria-haspopup="menu"
                  aria-expanded="false"
                  className={`relative flex cursor-pointer items-center justify-center rounded-xl px-3 py-2.5  transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none  sm:px-4 ${isNotficationOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-600"}`}
                >
                  <FiBell className="text-lg" />

                  {unreadNotficationCount != 0 && (
                    <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadNotficationCount}
                    </span>
                  )}
                </button>
                {isNotficationOpen && (
                  <Notification
                    unreadNotficationCount={unreadNotficationCount}
                    setIsNotficationOpen={setIsNotficationOpen}
                  />
                )}
              </li>
              <li
                aria-hidden="true"
                className="mx-1 h-6 w-px bg-slate-200 sm:mx-2"
              />

              <li>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("userToken");
                    localStorage.removeItem("loginTime");
                    setUserLogin(null);
                    navigat("/login");
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
