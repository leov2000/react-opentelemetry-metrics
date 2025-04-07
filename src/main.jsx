import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MetricsProvider, requestCounter, requestDuration } from "../metrics/metrics.jsx";

// Record app initialization
const startTime = performance.now();

// Render the app with the MetricsProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetricsProvider>
      <App />
    </MetricsProvider>
  </React.StrictMode>
);

// Record app initialization time
const endTime = performance.now();
requestDuration.record(endTime - startTime, { 
  component: 'main', 
  operation: 'app_init' 
});