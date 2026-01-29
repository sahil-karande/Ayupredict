import favicon from "./assets/favicon.png";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import AuthWrapper from "./components/auth/AuthWrapper";

// 🚀 React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🚀 Pages
import History from "./components/History";
import FullReport from "./components/FullReport";

// ✅ Set favicon dynamically
const link =
  document.querySelector("link[rel*='icon']") || document.createElement("link");
link.rel = "icon";
link.href = favicon;
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <BrowserRouter>
        <Routes>
          {/* Home / Prediction page */}
          <Route path="/" element={<App />} />

          {/* History Page */}
          <Route path="/history" element={<History />} />

          {/* Full Report Page (New) */}
          <Route path="/report/:id" element={<FullReport />} />
        </Routes>
      </BrowserRouter>
    </AuthWrapper>
  </React.StrictMode>
);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
