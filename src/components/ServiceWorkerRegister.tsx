"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for updates periodically
          setInterval(() => reg.update(), 60 * 60 * 1000); // hourly
        })
        .catch(() => {
          // SW registration failed — not critical
        });
    }
  }, []);

  return null;
}
