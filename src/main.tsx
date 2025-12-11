import Aura from '@primeuix/themes/aura';
import React from "react";
import ReactDOM from "react-dom/client";
import { PrimeReactProvider } from "@primereact/core/config";
import App from "./App";
// tailwind css
import "./index.css";
// primreact css
import "primeicons/primeicons.css";
import "./App.css";

const theme = {
    preset: Aura
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PrimeReactProvider theme={theme}>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
