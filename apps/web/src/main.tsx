import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "./config/global.css";
import App from "./App";
import { PreferencesProvider } from "@/logic/PreferencesProvider";
import { TooltipProvider } from "@/ui/ui/tooltip";
import { Toaster } from "@/ui/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PreferencesProvider>
      <TooltipProvider>
        <BrowserRouter>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
          <Toaster position="top-center" richColors closeButton />
        </BrowserRouter>
      </TooltipProvider>
    </PreferencesProvider>
  </StrictMode>,
);
