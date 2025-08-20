import { useState, useCallback } from "react";
import FeedbackMessage from "./component/FeedbackMessage";
import type { FeedbackType, FeedbackPosition } from "./component/FeedbackMessage";
import "./App.css";

interface Notification {
  type: FeedbackType;
  message: string;
}

function App() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<FeedbackPosition>("top-center");
  const [duration, setDuration] = useState(5000);

  const showNotification = useCallback((type: FeedbackType, message: string) => {
    setIsOpen(false);
    setTimeout(() => {
      setNotification({ type, message });
      setIsOpen(true);
    }, 50);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero__title">FeedbackMessage</h1>
        <p className="hero__subtitle">
          iOS-inspired notification component for React. Smooth animations,
          auto-dismiss with progress bar, and accessible by default.
        </p>
      </header>

      <main className="content">
        <section className="section">
          <h2 className="section__title">Try it out</h2>
          <p className="section__desc">Click any button to trigger a notification.</p>
          <div className="button-grid">
            <button
              className="trigger-btn trigger-btn--success"
              onClick={() => showNotification("success", "Changes saved successfully")}
            >
              Success
            </button>
            <button
              className="trigger-btn trigger-btn--info"
              onClick={() => showNotification("info", "New update available")}
            >
              Info
            </button>
            <button
              className="trigger-btn trigger-btn--warning"
              onClick={() => showNotification("warning", "Storage is almost full")}
            >
              Warning
            </button>
            <button
              className="trigger-btn trigger-btn--error"
              onClick={() => showNotification("error", "Failed to connect to server")}
            >
              Error
            </button>
          </div>
        </section>

        <section className="section">
          <h2 className="section__title">Options</h2>
          <div className="options-grid">
            <div className="option">
              <label className="option__label" htmlFor="position-select">Position</label>
              <select
                id="position-select"
                className="option__select"
                value={position}
                onChange={(e) => setPosition(e.target.value as FeedbackPosition)}
              >
                <option value="top-center">Top Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
            <div className="option">
              <label className="option__label" htmlFor="duration-select">Duration</label>
              <select
                id="duration-select"
                className="option__select"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={2000}>2 seconds</option>
                <option value={3000}>3 seconds</option>
                <option value={5000}>5 seconds</option>
                <option value={8000}>8 seconds</option>
                <option value={10000}>10 seconds</option>
              </select>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section__title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Smooth Animations</h3>
              <p>Slide-in and fade transitions with CSS for a native feel.</p>
            </div>
            <div className="feature-card">
              <h3>Auto-dismiss</h3>
              <p>Configurable duration with a synced progress bar indicator.</p>
            </div>
            <div className="feature-card">
              <h3>Accessible</h3>
              <p>ARIA roles, keyboard dismiss with Escape, and focus indicators.</p>
            </div>
            <div className="feature-card">
              <h3>Positioning</h3>
              <p>Six position options. Responsive on mobile with full-width layout.</p>
            </div>
            <div className="feature-card">
              <h3>Close Callback</h3>
              <p>onClose callback fires when dismissed, manually or automatically.</p>
            </div>
            <div className="feature-card">
              <h3>Lightweight</h3>
              <p>Zero dependencies. Just React and CSS.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section__title">Props</h2>
          <div className="props-table-wrapper">
            <table className="props-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>message</code></td>
                  <td><code>string</code></td>
                  <td>--</td>
                  <td>The notification text</td>
                </tr>
                <tr>
                  <td><code>type</code></td>
                  <td><code>"success" | "error" | "warning" | "info"</code></td>
                  <td>--</td>
                  <td>Determines the color and icon</td>
                </tr>
                <tr>
                  <td><code>duration</code></td>
                  <td><code>number</code></td>
                  <td><code>5000</code></td>
                  <td>Auto-dismiss time in milliseconds</td>
                </tr>
                <tr>
                  <td><code>isOpen</code></td>
                  <td><code>boolean</code></td>
                  <td>--</td>
                  <td>Controls visibility</td>
                </tr>
                <tr>
                  <td><code>onClose</code></td>
                  <td><code>() =&gt; void</code></td>
                  <td>--</td>
                  <td>Called when notification is dismissed</td>
                </tr>
                <tr>
                  <td><code>position</code></td>
                  <td><code>"top-center" | "top-left" | "top-right" | "bottom-center" | "bottom-left" | "bottom-right"</code></td>
                  <td><code>"top-center"</code></td>
                  <td>Where the notification appears</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Built by{" "}
          <a href="https://github.com/DMalagueta" target="_blank" rel="noopener noreferrer">
            Diogo Malagueta
          </a>
        </p>
      </footer>

      {notification && (
        <FeedbackMessage
          message={notification.message}
          type={notification.type}
          duration={duration}
          isOpen={isOpen}
          onClose={handleClose}
          position={position}
        />
      )}
    </div>
  );
}

export default App;
