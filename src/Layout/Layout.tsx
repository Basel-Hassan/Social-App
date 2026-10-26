import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";
import { useEffect, useState } from "react";

export default function Layout() {

  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowFooter(false);
      }
      else if (currentScrollY > lastScrollY) {
        setShowFooter(true);
      }
      else if (currentScrollY < lastScrollY + 10) {
        setShowFooter(false);
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div className="min-h-screen">
      <Navbar/>
      <main>
        <Outlet/>
      </main>
       <div
        className={`fixed bottom-0 left-0 z-40 w-full transition-transform duration-300 ${
          showFooter ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Footer />
      </div>
    </div>
  )
}
