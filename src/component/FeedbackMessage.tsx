import { useState, useEffect, useCallback, useRef } from "react";
import "./feedbackmessage.css";

type FeedbackType = "success" | "error" | "warning" | "info";
type FeedbackPosition = "top-center" | "top-left" | "top-right" | "bottom-center" | "bottom-left" | "bottom-right";

interface FeedbackMessageProps {
  message: string;
  type: FeedbackType;
  duration?: number;
  isOpen: boolean;
  onClose?: () => void;
  position?: FeedbackPosition;
}

const icons: Record<FeedbackType, JSX.Element> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

// Animation sequence:
// Enter:  hidden -> mounted (off-screen) -> circle -> expanded -> visible
// Exit:   visible -> collapsing -> circle-out -> hidden
type Phase = "hidden" | "mounted" | "circle" | "expanded" | "visible" | "collapsing" | "circle-out";

export default function FeedbackMessage({
  message,
  type,
  duration = 5000,
  isOpen,
  onClose,
  position = "top-center",
}: FeedbackMessageProps) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enterTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startTimeRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    enterTimers.current.forEach(clearTimeout);
    timerRef.current = null;
    progressRef.current = null;
    enterTimers.current = [];
  }, []);

  const dismiss = useCallback(() => {
    cleanup();
    setPhase("collapsing");
    const t1 = setTimeout(() => {
      setPhase("circle-out");
      const t2 = setTimeout(() => {
        setPhase("hidden");
        setProgress(100);
        onClose?.();
      }, 500);
      enterTimers.current.push(t2);
    }, 600);
    enterTimers.current.push(t1);
  }, [cleanup, onClose]);

  useEffect(() => {
    if (isOpen) {
      cleanup();
      setProgress(100);

      // Mount off-screen first, then animate circle in on next frame
      setPhase("mounted");

      const t0 = setTimeout(() => {
        setPhase("circle");

        // Phase 2: Expand to rectangle (after circle settles)
        const t1 = setTimeout(() => {
          setPhase("expanded");

          // Phase 3: Content fades in, fully interactive
          const t2 = setTimeout(() => {
            setPhase("visible");

            // Start progress tracking
            startTimeRef.current = Date.now();
            progressRef.current = setInterval(() => {
              const elapsed = Date.now() - startTimeRef.current;
              const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
              setProgress(remaining);
              if (remaining <= 0 && progressRef.current) {
                clearInterval(progressRef.current);
              }
            }, 30);

            // Auto-dismiss
            timerRef.current = setTimeout(dismiss, duration);
          }, 600);
          enterTimers.current.push(t2);
        }, 700);
        enterTimers.current.push(t1);
      }, 20);
      enterTimers.current.push(t0);
    } else if (phase !== "hidden") {
      dismiss();
    }

    return cleanup;
  }, [isOpen, duration]);

  useEffect(() => {
    if (phase !== "hidden") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") dismiss();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [phase, dismiss]);

  if (phase === "hidden") return null;

  const showContent = phase === "expanded" || phase === "visible";
  const phaseClass = phase === "mounted" ? "" : `fm--${phase}`;

  return (
    <div
      className={`fm fm--${type} fm--${position} ${phaseClass}`}
      onClick={dismiss}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") dismiss(); }}
      role="alert"
      aria-live="assertive"
      tabIndex={0}
    >
      <div className="fm__icon">{icons[type]}</div>
      <div className="fm__body">
        <span className="fm__text">{message}</span>
      </div>
      {showContent && (
        <button
          className="fm__close"
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          aria-label="Close notification"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      <div className="fm__progress-track">
        <div className="fm__progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export type { FeedbackMessageProps, FeedbackType, FeedbackPosition };
