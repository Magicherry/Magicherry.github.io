import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";

function shouldEnableVercelAnalytics() {
  if (typeof window === "undefined") {
    return false;
  }

  return /(^|\.)vercel\.app$/i.test(window.location.hostname);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
    {shouldEnableVercelAnalytics() ? <Analytics /> : null}
  </React.StrictMode>
);
