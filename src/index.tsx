
console.log("src/index.tsx: Script execution started by Babel.");

import React from 'react';
import ReactDOM from 'react-dom/client';

console.log("src/index.tsx: React and ReactDOM imported.");

import App from './App'; 

console.log("src/index.tsx: App component imported.");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("src/index.tsx: Fatal Error - Root element #root NOT FOUND.");
  document.body.innerHTML = "<p style='color:red; text-align:center; font-size:1.5em;'>Error Crítico: Elemento #root no encontrado. La aplicación no puede iniciar.</p>";
  throw new Error("Could not find root element to mount to");
} else {
  console.log("src/index.tsx: Root element #root found.");
}

try {
  console.log("src/index.tsx: Attempting to create React root and render App component.");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("src/index.tsx: React App component render call complete.");
} catch (error) {
  console.error("src/index.tsx: Error during React rendering:", error);
  if (rootElement) {
    rootElement.innerHTML = `<div style="color: red; padding: 20px; text-align: center; background-color: #333; border: 1px solid red;">
        <h2 style="color: #ffcccc;">Error Durante la Inicialización de React</h2>
        <p style="color: #ffdddd; white-space: pre-wrap;">${error instanceof Error ? error.message : String(error)}</p>
        <p style="color: #ffaaaa; margin-top: 10px;">Revisa la consola del navegador (F12 o clic derecho > Inspeccionar > Consola) para más detalles.</p>
      </div>`;
  }
}
