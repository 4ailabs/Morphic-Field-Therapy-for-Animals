
import React from 'react';

interface TraumaScreeningStepProps {
  onResponse: (hasTrauma: boolean) => void;
}

const TraumaScreeningStep: React.FC<TraumaScreeningStepProps> = ({ onResponse }) => {
  return (
    <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-semibold text-sky-400 mb-2">
        Paso 3: Evaluación de Trauma Previo 
        <span className="text-yellow-400 text-2xl ml-2">⭐</span>
        <span className="italic text-yellow-500 text-lg ml-1">NUEVO</span>
      </h2>
      <p className="text-lg text-slate-300 mb-6">
        Pregunta de screening: ¿Este animal ha experimentado trauma significativo que afecta sus instintos naturales? (Manual V4.0, p.7)
      </p>
      <div className="flex justify-around mt-8">
        <button
          onClick={() => onResponse(true)}
          className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out text-lg"
          aria-label="Sí, el animal ha experimentado trauma significativo"
        >
          Sí
        </button>
        <button
          onClick={() => onResponse(false)}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out text-lg"
          aria-label="No, el animal no ha experimentado trauma significativo"
        >
          No
        </button>
      </div>
      <p className="text-sm text-slate-400 mt-8">
        Si la respuesta es positiva, se procederá con una evaluación específica del trauma.
        Si es negativa, se continuará con el diagnóstico general de instintos.
      </p>
    </div>
  );
};

export default TraumaScreeningStep;
