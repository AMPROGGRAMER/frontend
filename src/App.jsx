import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter.jsx";
import Toast from "./components/common/Toast.jsx";
import { useApp } from "./context/AppContext.jsx";
import "./styles.css";

const App = () => {
  const { toast } = useApp();

  // Scroll reveal animation
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    // Observe all scroll-reveal elements
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AppRouter />
      <Toast toast={toast} />
    </>
  );
};

export default App;

