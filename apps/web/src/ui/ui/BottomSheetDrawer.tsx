import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface BottomSheetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheetDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
}: BottomSheetDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={`relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border-t border-border bg-card p-6 shadow-2xl ${className}`}
          >
            {/* Drag Handle Pill */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/30" />

            {/* Header with Title and Close Button */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h2 className="text-title-lg font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Content */}
            <div className="pb-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default BottomSheetDrawer;
