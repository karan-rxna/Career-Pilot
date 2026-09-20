import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BookmarksProvider } from "./store/useBookmarks";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <BookmarksProvider>
        <App />
      </BookmarksProvider>
    </BrowserRouter>
  </StrictMode>
);
