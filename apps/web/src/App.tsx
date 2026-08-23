import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/ui/layout/Layout";
import PageTransition from "@/ui/layout/PageTransition";

// Route-level code splitting — each page is its own chunk
const HomePage = lazy(() => import("@/routes/HomePage"));
const SosPage = lazy(() => import("@/routes/SosPage"));
const LibraryPage = lazy(() => import("@/routes/LibraryPage"));
const SessionPage = lazy(() => import("@/routes/SessionPage"));
const ProgressPage = lazy(() => import("@/routes/ProgressPage"));
const SettingsPage = lazy(() => import("@/routes/SettingsPage"));
const SessionCompletePage = lazy(() => import("@/routes/SessionCompletePage"));
const FeedbackPage = lazy(() => import("@/routes/FeedbackPage"));
const AdminFeedbackPage = lazy(() => import("@/routes/AdminFeedbackPage"));

/** Gentle loading state while a route chunk is fetched */
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        role="status"
        aria-label="Memuat"
        className="size-10 rounded-full border-2 border-primary/20 border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="session/:techniqueId" element={<SessionPage />} />
        </Route>
        {/* Transactional / Standalone pages */}
        <Route
          path="/session-complete"
          element={
            <PageTransition>
              <SessionCompletePage />
            </PageTransition>
          }
        />
        <Route
          path="/sos"
          element={
            <PageTransition>
              <SosPage />
            </PageTransition>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <PageTransition>
              <AdminFeedbackPage />
            </PageTransition>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
