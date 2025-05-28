import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from "./App";
import "./index.css"; // Assure-toi que ce fichier existe

// Crée un client React Query
const queryClient = new QueryClient();

// Rendu de l'application dans le DOM
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // Récupère l'élément 'root'

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

