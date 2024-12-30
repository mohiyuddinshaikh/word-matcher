import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WordMatcher from "./WordMatcher.tsx";

createRoot(document.getElementById("root")!).render(<WordMatcher />);
