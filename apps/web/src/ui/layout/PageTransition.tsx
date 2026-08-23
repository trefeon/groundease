import { motion } from "framer-motion";
import { pageFade } from "@/logic/motion";
import type { ReactNode } from "react";

/** Wraps routed content so each page fades in on navigation */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageFade}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
