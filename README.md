# FeedbackMessage

iOS-inspired notification component for React with smooth animations, auto-dismiss with progress bar, and full accessibility.

URL: https://dmalagueta.github.io/feedbackmessageios/

![FeedbackMessage Demo](./preview.gif)

## Features

- Smooth slide-in/fade-out animations driven by CSS transitions
- Auto-dismiss with configurable duration and synced progress bar
- Six position options (top/bottom, left/center/right)
- Close button and click-to-dismiss
- Keyboard dismiss with Escape
- ARIA roles and focus indicators
- Fully responsive on mobile
- onClose callback for parent state sync
- Zero external dependencies

## Installation
```bash
npm install
```

## Usage

```tsx
import { useState } from "react";
import FeedbackMessage from "./component/FeedbackMessage";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Show</button>
      <FeedbackMessage
        message="Changes saved successfully"
        type="success"
        duration={5000}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="top-center"
      />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | required | The notification text |
| `type` | `"success" \| "error" \| "warning" \| "info"` | required | Determines color and icon |
| `duration` | `number` | `5000` | Auto-dismiss time in milliseconds |
| `isOpen` | `boolean` | required | Controls visibility |
| `onClose` | `() => void` | -- | Called when notification is dismissed |
| `position` | `"top-center" \| "top-left" \| "top-right" \| "bottom-center" \| "bottom-left" \| "bottom-right"` | `"top-center"` | Where the notification appears |

## Running the Project

```bash
npm run dev
```

## Deploying

```bash
npm run build && npm run deploy
```
