
import React from 'react';
import { TipoTraumaGeneral, CronologiaTrauma } from '../../types';
import { CRONOLOGIA_TRAUMA_FIELDS } from '../../constants';

interface TraumaIdentificacionStepProps {
  tiposTrauma: TipoTraumaGeneral[];
  cronologia: CronologiaTrauma;
  onToggleTipoTrauma: (id: string) => void;
  onUpdateNivelImpacto: (id:string, nivel: number) => void;
  onUpdateCronologia: (field: keyof CronologiaTrauma, value: string) => void;
}

const TraumaIdentificacionStep: React.FC<TraumaIdentificacionStepProps> = ({
  tiposTrauma,
  cronologia,
  onToggleTipoTrauma,
  onUpdateNivelImpacto,
  onUpdateCronologia,
}) => {
  return (
    <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 3.1 &amp; 3.2: Tipo de Trauma, Impacto y Cronología (Manual V4.0, p.8)</h2>
      
      <h3 className="text-2xl font-medium text-fuchsia-400 mb-3">3.1 Tipos de Trauma y Nivel de Impacto</h3>
      <p className="text-sm text-slate-400 mb-4">Seleccione los tipos de trauma que apliquen y ajuste el nivel de impacto (0-10).</p>
      <div className="space-y-4 mb-6">
        {tiposTrauma.map((trauma) => (
          <div key={trauma.id} className="p-4 border border-slate-700 rounded-lg bg-slate-850 shadow">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor={`trauma-${trauma.id}`} className="flex-grow text-lg text-gray-200">
                <span className="font-medium text-sky-400">{trauma.tipo}:</span> {trauma.preguntaConfirmacion}
              </label>
              <input 
                type="checkbox" 
                id={`trauma-${trauma.id}`} 
                checked={trauma.activo} 
                onChange={() => onToggleTipoTrauma(trauma.id)} 
                className="ml-4 h-5 w-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600"
              />
            </div>
            {trauma.activo && (
              <div>
                <label htmlFor={`impacto-${trauma.id}`} className="block text-base font-medium text-sky-300 mb-1">
                  Nivel de Impacto (0-10): {trauma.nivelImpacto}
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  id={`impacto-${trauma.id}`} 
                  value={trauma.nivelImpacto} 
                  onChange={(e) => onUpdateNivelImpacto(trauma.id, parseInt(e.target.value))} 
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-medium text-fuchsia-400 mb-3 mt-8">3.2 Cronología del Trauma</h3>
      <p className="text-sm text-slate-400 mb-4">Complete la información sobre la cronología del trauma principal identificado.</p>
      <div className="space-y-4">
        {CRONOLOGIA_TRAUMA_FIELDS.map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-base font-medium text-sky-300 mb-1">
              {field.label}:
            </label>
            <input
              type="text"
              id={field.id}
              value={cronologia[field.id as keyof CronologiaTrauma]}
              onChange={(e) => onUpdateCronologia(field.id as keyof CronologiaTrauma, e.target.value)}
              placeholder={field.placeholder}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-base"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraumaIdentificacionStep;
