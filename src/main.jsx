import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { requestDuration, shutdownMetrics } from "../metrics/metrics.js";

const startTime = performance.now();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const endTime = performance.now();
requestDuration.record(endTime - startTime, {
  component: "main",
  operation: "app_init",
});

window.addEventListener("beforeunload", () => {
  shutdownMetrics();
});
