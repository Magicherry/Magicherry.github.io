import React from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);