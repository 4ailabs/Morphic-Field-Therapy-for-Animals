import React, { useState, useCallback } from 'react';
import { 
    AnimalInfo, Conflicto, DiagnosticoCompleto, Paso, MemoriaLugar, 
    SanacionSugerida, FlorBach, ComandoEspecifico, CronologiaTrauma
} from './types';
import { 
    TITULO_APP, VERSION_APP,
    CONFLICTOS_CON_DUENO_DATA, 
    MEMORIAS_LUGAR_DATA, NECESIDADES_BIOLOGICAS_DATA, FLORES_BACH_DATA, 
    COMANDOS_ESPECIFICOS_DATA, 
    INSTINTOS_PRIMARIOS_DATA, CAUSAS_BLOQUEO_INSTINTO_DATA, ZONAS_HOGAR_DATA,
    ESPECIES_ANIMALES, SEXO_OPCIONES, ESTADO_REPRODUCTIVO_OPCIONES, 
    AMBIENTE_ACTUAL_OPCIONES, HISTORIA_PREVIA_OPCIONES,
    TIPOS_TRAUMA_GENERAL_DATA
} from './constants';
import NavButtons from './components/shared/NavButtons';
import TraumaScreeningStep from './components/trauma/TraumaScreeningStep';
import TraumaIdentificacionStep from './components/trauma/TraumaIdentificacionStep';


const initialAnimalInfo: AnimalInfo = {
  nombre: '', especie: 'Perro', razaSubespecie: '', edad: '',
  sexo: 'Desconocido', estadoReproductivo: 'Desconocido', pesoAproximado: '',
  caracteristicasDistintivas: '', tiempoConDuenoActual: '',
  ambienteActual: 'Urbano', historiaPrevia: 'Desconocida',
  otrosAnimalesCasa: 'Ninguno', cambiosRecientes: 'Ninguno',
  numeroRadionico: ''
};

const initialCronologiaTrauma: CronologiaTrauma = {
    edadCuandoOcurrio: '',
    duracionDelTrauma: '',
    tiempoDesdeRescate: '',
    tratamientosPrevios: '',
};

const initialDiagnostico: DiagnosticoCompleto = {
  animalInfo: initialAnimalInfo,
  instintosBloqueados: INSTINTOS_PRIMARIOS_DATA.map(ip => ({ instintoId: ip.id, activo: false, nivelBloqueo: 0, causaPrincipalId: undefined })),
  conflictosDueno: CONFLICTOS_CON_DUENO_DATA.map(c => ({ ...c, activo: false, intensidad: 0 })),
  conflictosAnimal: [], 
  memoriasLugar: MEMORIAS_LUGAR_DATA.map(m => ({...m, activo: false, intensidad: 0})),
  zonasHogarAfectadas: [],
  necesidadesBiologicas: NECESIDADES_BIOLOGICAS_DATA.map(n => ({...n, satisfecha: true, intensidadNoSatisfecha: 0})),
  sanacionSugerida: {
    flores: [],
    comandos: [],
    comandoIntegrado: '',
    duracionDias: 14,
  },
  // Initialize V4.0 trauma fields
  traumaDetectadoConfirmado: undefined, 
  traumaEvaluado: false, 
  tiposTraumaGeneral: TIPOS_TRAUMA_GENERAL_DATA.map(ttg => ({...ttg, activo: false, nivelImpacto: 0})),
  cronologiaTrauma: initialCronologiaTrauma,
  expedienteTrauma: {}, 
};

const getFlorDescription = (flor: FlorBach): string => {
  let mainPurpose = "";
  if (flor.instintoQueRestaura) mainPurpose = `Restaura: ${flor.instintoQueRestaura}`;
  else if (flor.tipoConflicto) mainPurpose = `Conflicto: ${flor.tipoConflicto}`;
  else if (flor.memoriaQueTrata) mainPurpose = `Memoria: ${flor.memoriaQueTrata}`;
  else if (flor.resuelve) mainPurpose = `Resuelve: ${flor.resuelve}`;
  else if (flor.categoria) mainPurpose = `Categoría: ${flor.categoria}`;
  else mainPurpose = "Uso general";

  let details = `(Tasa: ${flor.tasa}, Grupo: ${flor.grupo || 'N/A'})`;
  
  if (flor.comandoDual) {
    details += ` (Comando Dual: ${flor.comandoDual})`;
  }
  return `${mainPurpose} ${details}`;
};

const AnimatedStep: React.FC<{ children: React.ReactNode, stepKey: string }> = ({ children, stepKey }) => {
  const [prevKey, setPrevKey] = useState(stepKey);
  const [fade, setFade] = useState(true);

  React.useEffect(() => {
    if (stepKey !== prevKey) {
      setFade(false);
      const timeout = setTimeout(() => {
        setPrevKey(stepKey);
        setFade(true);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [stepKey, prevKey]);

  return (
    <div
      key={prevKey}
      className={`transition-opacity duration-100 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Paso>(Paso.Inicio);
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto>(initialDiagnostico);
  
  // Estados para filtros y búsqueda
  const [filtroGrupoFlor, setFiltroGrupoFlor] = useState<string>('todos');
  const [busquedaFlor, setBusquedaFlor] = useState<string>('');
  const [filtroCategoriaComando, setFiltroCategoriaComando] = useState<string>('todos');
  const [busquedaComando, setBusquedaComando] = useState<string>('');

  const updateAnimalInfo = (data: Partial<AnimalInfo>) => {
    setDiagnostico(prev => ({ ...prev, animalInfo: { ...prev.animalInfo, ...data } }));
  };

  const toggleInstintoBloqueado = (instintoId: string) => {
    setDiagnostico(prev => ({
      ...prev,
      instintosBloqueados: prev.instintosBloqueados.map(ib =>
        ib.instintoId === instintoId ? { ...ib, activo: !ib.activo, nivelBloqueo: !ib.activo ? 5 : 0, causaPrincipalId: !ib.activo ? ib.causaPrincipalId: undefined } : ib
      )
    }));
  };

  const updateNivelBloqueoInstinto = (instintoId: string, nivel: number) => {
    setDiagnostico(prev => ({
      ...prev,
      instintosBloqueados: prev.instintosBloqueados.map(ib =>
        ib.instintoId === instintoId ? { ...ib, nivelBloqueo: nivel } : ib
      )
    }));
  };

  const updateCausaBloqueoInstinto = (instintoId: string, causaId?: string) => {
     setDiagnostico(prev => ({
      ...prev,
      instintosBloqueados: prev.instintosBloqueados.map(ib =>
        ib.instintoId === instintoId ? { ...ib, causaPrincipalId: causaId } : ib
      )
    }));
  };
  
  const toggleItemActivo = (id: string, listName: keyof Pick<DiagnosticoCompleto, 'conflictosDueno' | 'memoriasLugar'>) => {
    setDiagnostico(prev => {
      const newList = (prev[listName] as Array<Conflicto | MemoriaLugar>).map(item =>
        item.id === id ? { ...item, activo: !item.activo, intensidad: !item.activo ? 5 : 0 } : item
      );
      return { ...prev, [listName]: newList };
    });
  };

  const updateItemIntensidad = (id: string, intensidad: number, listName: keyof Pick<DiagnosticoCompleto, 'conflictosDueno' | 'memoriasLugar'>) => {
     setDiagnostico(prev => {
      const newList = (prev[listName] as Array<Conflicto | MemoriaLugar>).map(item =>
        item.id === id ? { ...item, intensidad: intensidad } : item
      );
      return { ...prev, [listName]: newList };
    });
  };

  const toggleZonaHogar = (zonaId: string) => {
    setDiagnostico(prev => {
        const newZonas = prev.zonasHogarAfectadas.includes(zonaId)
            ? prev.zonasHogarAfectadas.filter(id => id !== zonaId)
            : [...prev.zonasHogarAfectadas, zonaId];
        return {...prev, zonasHogarAfectadas: newZonas};
    });
  };

  const toggleNecesidadSatisfecha = (id: string) => {
    setDiagnostico(prev => ({
      ...prev,
      necesidadesBiologicas: prev.necesidadesBiologicas.map(n => {
        if (n.id === id) {
          const newSatisfecha = !n.satisfecha;
          return { ...n, satisfecha: newSatisfecha, intensidadNoSatisfecha: newSatisfecha ? 0 : 5 };
        }
        return n;
      })
    }));
  };

  const updateIntensidadNecesidad = (id: string, intensidad: number) => {
    setDiagnostico(prev => ({
      ...prev,
      necesidadesBiologicas: prev.necesidadesBiologicas.map(n =>
        n.id === id ? { ...n, intensidadNoSatisfecha: intensidad } : n
      )
    }));
  };
  
   const handleFlorSelection = (florToToggle: FlorBach) => {
    setDiagnostico(prev => {
        const currentFlores = prev.sanacionSugerida?.flores || [];
        const isSelected = currentFlores.some(f => f.tasa === florToToggle.tasa);
        const newFlores = isSelected 
            ? currentFlores.filter(f => f.tasa !== florToToggle.tasa)
            : [...currentFlores, florToToggle];
        return {
            ...prev,
            sanacionSugerida: {
                ...(prev.sanacionSugerida as SanacionSugerida),
                flores: newFlores,
            }
        }
    });
  };

  const handleComandoSelection = (comandoToToggle: ComandoEspecifico) => {
     setDiagnostico(prev => {
        const currentComandos = prev.sanacionSugerida?.comandos || [];
        const isSelected = currentComandos.some(c => c.id === comandoToToggle.id);
        const newComandos = isSelected
            ? currentComandos.filter(c => c.id !== comandoToToggle.id)
            : [...currentComandos, comandoToToggle];
        return {
            ...prev,
            sanacionSugerida: {
                ...(prev.sanacionSugerida as SanacionSugerida),
                comandos: newComandos,
            }
        }
    });
  };

  const handleComandoIntegradoChange = (text: string) => {
    setDiagnostico(prev => ({
        ...prev,
        sanacionSugerida: {
            ...(prev.sanacionSugerida as SanacionSugerida),
            comandoIntegrado: text,
        }
    }));
  };

  const handleDuracionChange = (dias: number) => {
    setDiagnostico(prev => ({
        ...prev,
        sanacionSugerida: {
            ...(prev.sanacionSugerida as SanacionSugerida),
            duracionDias: dias,
        }
    }));
  };

  // --- Trauma Handlers ---
  const handleTraumaScreeningResponse = useCallback((response: boolean) => {
    setDiagnostico(prev => ({
      ...prev,
      traumaDetectadoConfirmado: response,
      traumaEvaluado: true, // Mark trauma as evaluated once screening is done
    }));
    if (response) {
      setCurrentStep(Paso.TraumaIdentificacion);
    } else {
      setCurrentStep(Paso.DiagnosticoInstintos); 
    }
  }, []); 

  const toggleTipoTraumaGeneral = (id: string) => {
    setDiagnostico(prev => ({
        ...prev,
        tiposTraumaGeneral: prev.tiposTraumaGeneral.map(ttg => 
            ttg.id === id ? { ...ttg, activo: !ttg.activo, nivelImpacto: !ttg.activo ? 5 : 0 } : ttg
        )
    }));
  };

  const updateNivelImpactoTrauma = (id: string, nivel: number) => {
      setDiagnostico(prev => ({
          ...prev,
          tiposTraumaGeneral: prev.tiposTraumaGeneral.map(ttg =>
              ttg.id === id ? { ...ttg, nivelImpacto: nivel } : ttg
          )
      }));
  };

  const updateCronologiaTrauma = (field: keyof CronologiaTrauma, value: string) => {
      setDiagnostico(prev => ({
          ...prev,
          cronologiaTrauma: {
              ...(prev.cronologiaTrauma || initialCronologiaTrauma), 
              [field]: value,
          }
      }));
  };


  const handleExportCartaRadionica = () => {
    const { 
        animalInfo: finalAnimalInfo, 
        instintosBloqueados, 
        conflictosDueno, 
        memoriasLugar, 
        zonasHogarAfectadas, 
        necesidadesBiologicas, 
        sanacionSugerida: finalSanacionSugerida,
        traumaEvaluado,
        traumaDetectadoConfirmado,
        tiposTraumaGeneral,
        cronologiaTrauma
    } = diagnostico;
    const finalSanacion = finalSanacionSugerida as SanacionSugerida;

    const necesidadesBiologicasFiltradasParaCarta = necesidadesBiologicas
        .filter(n =>
            n.especieAnimal.includes(finalAnimalInfo.especie) ||
            finalAnimalInfo.especie === 'Otro' ||
            n.especieAnimal.includes('Otro')
        );

    // Obtener fecha y hora actual
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let content = `${TITULO_APP}\n`;
    content += `${VERSION_APP}\n`;
    content += `=====================================\n`;
    content += `Fecha y Hora de Generación: ${fechaHora}\n`;
    content += `=====================================\n\n`;

    content += `DATOS BÁSICOS DEL ANIMAL (Pasos 1 & 2)\n`;
    content += `------------------------------------\n`;
    content += `Número Radiónico: ${finalAnimalInfo.numeroRadionico}\n`;
    content += `Nombre: ${finalAnimalInfo.nombre}\n`;
    content += `Especie: ${finalAnimalInfo.especie}, Raza/Subespecie: ${finalAnimalInfo.razaSubespecie}\n`;
    content += `Edad: ${finalAnimalInfo.edad}, Sexo: ${finalAnimalInfo.sexo}, Estado Reproductivo: ${finalAnimalInfo.estadoReproductivo}\n`;
    content += `Peso Aproximado: ${finalAnimalInfo.pesoAproximado}\n`;
    content += `Características Distintivas: ${finalAnimalInfo.caracteristicasDistintivas}\n`;
    content += `Tiempo con Dueño Actual: ${finalAnimalInfo.tiempoConDuenoActual}\n`;
    content += `Ambiente Actual: ${finalAnimalInfo.ambienteActual}, Historia Previa: ${finalAnimalInfo.historiaPrevia}\n`;
    content += `Otros Animales en Casa: ${finalAnimalInfo.otrosAnimalesCasa}\n`;
    content += `Cambios Recientes: ${finalAnimalInfo.cambiosRecientes}\n\n`;

    if (traumaEvaluado) { 
        content += `Evaluación de Trauma Previo (Paso 3)\n`;
        content += `------------------------------------\n`;
        content += `¿Animal ha experimentado trauma significativo?: ${traumaDetectadoConfirmado ? 'Sí' : 'No'}\n`;
        if (traumaDetectadoConfirmado) {
            const traumasActivos = tiposTraumaGeneral.filter(t => t.activo);
            if (traumasActivos.length > 0) {
                content += `Tipos de Trauma Identificados (Paso 3.1):\n`;
                traumasActivos.forEach(t => {
                    content += `  - ${t.tipo} (Nivel de Impacto: ${t.nivelImpacto}/10)\n`;
                });
            }
            if (cronologiaTrauma) { 
                content += `Cronología del Trauma (Paso 3.2):\n`;
                content += `  - Edad cuando ocurrió: ${cronologiaTrauma.edadCuandoOcurrio || 'N/A'}\n`;
                content += `  - Duración del trauma: ${cronologiaTrauma.duracionDelTrauma || 'N/A'}\n`;
                content += `  - Tiempo desde el rescate: ${cronologiaTrauma.tiempoDesdeRescate || 'N/A'}\n`;
                content += `  - Tratamientos previos: ${cronologiaTrauma.tratamientosPrevios || 'N/A'}\n`;
            }
        }
        content += `\n`;
    }

    if (instintosBloqueados.some(ib => ib.activo)) {
        content += `Instintos Bloqueados (Paso 4)\n`;
        content += `------------------------------------\n`;
        instintosBloqueados.filter(ib => ib.activo).forEach(ib => {
            const instintoData = INSTINTOS_PRIMARIOS_DATA.find(ip => ip.id === ib.instintoId);
            const causaData = CAUSAS_BLOQUEO_INSTINTO_DATA.find(cb => cb.id === ib.causaPrincipalId);
            content += `- ${instintoData?.nombreInstinto} (Nivel: ${ib.nivelBloqueo})${causaData ? ` - Causa: ${causaData.causa}` : ''}\n`;
        });
        content += `\n`;
    }

    if (conflictosDueno.some(c => c.activo)) {
        content += `Conflictos con Dueño (Activos) (Paso 5)\n`;
        content += `------------------------------------\n`;
        conflictosDueno.filter(c => c.activo).forEach(c => {
            content += `- ${c.tipo} (Intensidad: ${c.intensidad})\n`;
        });
        content += `\n`;
    }

    if (memoriasLugar.some(m => m.activo) || zonasHogarAfectadas.length > 0) {
        content += `Influencias del Lugar (Activas) (Paso 6)\n`;
        content += `------------------------------------\n`;
        memoriasLugar.filter(m => m.activo).forEach(m => {
            content += `- ${m.memoria} (Intensidad: ${m.intensidad})\n`;
        });
        if (zonasHogarAfectadas.length > 0) {
            content += `Zonas Afectadas: ${zonasHogarAfectadas.map(zid => ZONAS_HOGAR_DATA.find(z=>z.id === zid)?.nombre).join(', ')}\n`;
        }
        content += `\n`;
    }
    
    if (necesidadesBiologicasFiltradasParaCarta.some(n => !n.satisfecha)) {
        content += `Necesidades Biológicas No Satisfechas (${finalAnimalInfo.especie}) (Paso 7)\n`;
        content += `------------------------------------\n`;
        necesidadesBiologicasFiltradasParaCarta.filter(n => !n.satisfecha).forEach(n => {
            content += `- ${n.necesidad} (Carencia: ${n.intensidadNoSatisfecha})\n`;
        });
        content += `\n`;
    }

    content += `Protocolo Aplicado (Pasos 8, 9, 10)\n`;
    content += `------------------------------------\n`;
    content += `Comando Integrado: ${finalSanacion.comandoIntegrado || 'No ingresado'}\n`;
    content += `Flores Seleccionadas: ${finalSanacion.flores.map(f => `${f.nombre} (T${f.tasa})`).join(', ') || 'Ninguna'}\n`;
    content += `Comandos Específicos: ${finalSanacion.comandos.length > 0 ? finalSanacion.comandos.map(c => c.id).join(', ') : 'Ninguno'}\n`;
    content += `Duración: ${finalSanacion.duracionDias} días\n\n`;

    content += `------------------------------------\n`;
    content += `${TITULO_APP} | Morphic Field Therapy® | 2025\n`;
    content += `Desarrollado por: Dr. Miguel Ojeda Rios\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Crear nombre de archivo con fecha y hora
    const fechaArchivo = ahora.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
    const nombreArchivo = `Carta_Radionica_${finalAnimalInfo.nombre.replace(/\s+/g, '_') || 'Animal'}_${fechaArchivo}_V4.txt`;
    
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const handleNext = useCallback(() => {
    switch (currentStep) {
      case Paso.Inicio:
        setCurrentStep(Paso.AnimalInfo);
        break;
      case Paso.AnimalInfo:
        setCurrentStep(Paso.TraumaScreening);
        break;
      case Paso.TraumaScreening:
        if (diagnostico.traumaDetectadoConfirmado === true) {
            setCurrentStep(Paso.TraumaIdentificacion);
        } else if (diagnostico.traumaDetectadoConfirmado === false) {
            setCurrentStep(Paso.DiagnosticoInstintos);
        }
        break;
      case Paso.TraumaIdentificacion:
        setCurrentStep(Paso.DiagnosticoInstintos);
        break;
      case Paso.DiagnosticoInstintos:
        setCurrentStep(Paso.ConflictosDueno);
        break;
      case Paso.ConflictosDueno:
        setCurrentStep(Paso.InfluenciaLugar);
        break;
      case Paso.InfluenciaLugar:
        setCurrentStep(Paso.NecesidadesBiologicas);
        break;
      case Paso.NecesidadesBiologicas:
        setCurrentStep(Paso.RecursosSanacionFlores);
        break;
      case Paso.RecursosSanacionFlores:
        setCurrentStep(Paso.RecursosSanacionComandos);
        break;
      case Paso.RecursosSanacionComandos:
        setCurrentStep(Paso.RecursosSanacionProtocolo);
        break;
      case Paso.RecursosSanacionProtocolo:
        setCurrentStep(Paso.CartaRadionica);
        break;
      case Paso.CartaRadionica:
        break;
      default:
        break;
    }
  }, [currentStep, diagnostico.traumaDetectadoConfirmado]);

  const handleBack = useCallback(() => {
    switch (currentStep) {
      case Paso.AnimalInfo:
        setCurrentStep(Paso.Inicio);
        break;
      case Paso.TraumaScreening:
        setCurrentStep(Paso.AnimalInfo);
        break;
      case Paso.TraumaIdentificacion:
        setCurrentStep(Paso.TraumaScreening);
        break;
      case Paso.DiagnosticoInstintos:
        if (diagnostico.traumaEvaluado) {
          setCurrentStep(diagnostico.traumaDetectadoConfirmado ? Paso.TraumaIdentificacion : Paso.TraumaScreening);
        } else {
          setCurrentStep(Paso.AnimalInfo); 
        }
        break;
      case Paso.ConflictosDueno:
        setCurrentStep(Paso.DiagnosticoInstintos);
        break;
      case Paso.InfluenciaLugar:
        setCurrentStep(Paso.ConflictosDueno);
        break;
      case Paso.NecesidadesBiologicas:
        setCurrentStep(Paso.InfluenciaLugar);
        break;
      case Paso.RecursosSanacionFlores:
        setCurrentStep(Paso.NecesidadesBiologicas);
        break;
      case Paso.RecursosSanacionComandos:
        setCurrentStep(Paso.RecursosSanacionFlores);
        break;
      case Paso.RecursosSanacionProtocolo:
        setCurrentStep(Paso.RecursosSanacionComandos);
        break;
      case Paso.CartaRadionica:
        setCurrentStep(Paso.RecursosSanacionProtocolo);
        break;
      default:
        break;
    }
  }, [currentStep, diagnostico.traumaEvaluado, diagnostico.traumaDetectadoConfirmado]);
  
  const renderInput = (label: string, name: keyof AnimalInfo, value: string | undefined, type: string = "text", options?: string[]) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-base font-medium text-sky-300 mb-1">{label}:</label>
      {type === "select" && options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => updateAnimalInfo({ [name]: e.target.value } as Partial<AnimalInfo>)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-base"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === "textarea" ? (
         <textarea
          id={name}
          name={name}
          value={value}
          rows={2}
          onChange={(e) => updateAnimalInfo({ [name]: e.target.value } as Partial<AnimalInfo>)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-base"
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(e) => updateAnimalInfo({ [name]: e.target.value } as Partial<AnimalInfo>)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-base"
        />
      )}
    </div>
  );

  const renderNumeroRadionico = (value: string | undefined) => (
    <div className="mb-6">
      <label htmlFor="numeroRadionico" className="block text-base font-medium text-sky-300 mb-3">
        ⚡ Número Radiónico (5-6 dígitos) - <span className="text-yellow-400 font-semibold">CÓDIGO ÚNICO IMPORTANTE</span>:
      </label>
      <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 rounded-lg px-2 py-3 flex items-center gap-2 shadow-lg mb-2">
        <span className="text-yellow-600 text-xl">⚡</span>
        <input
          type="text"
          id="numeroRadionico"
          name="numeroRadionico"
          value={value}
          onChange={(e) => updateAnimalInfo({ numeroRadionico: e.target.value } as Partial<AnimalInfo>)}
          className="flex-1 font-semibold text-lg text-yellow-800 bg-transparent border-none outline-none placeholder-yellow-600 min-h-[48px]"
          placeholder="Ej: 12345"
        />
        <span className="hidden sm:inline text-yellow-600 text-xs font-medium">Código único</span>
      </div>
      <p className="text-sm text-yellow-300 mt-2 italic">
        ⚠️ Este número es fundamental para el seguimiento radiónico. Anótalo cuidadosamente.
      </p>
    </div>
  );

  const renderCurrentStep = () => {
    const sanacion = diagnostico.sanacionSugerida as SanacionSugerida;
    switch (currentStep) {
      case Paso.Inicio:
        return (
          <div className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl">
            <img 
                src="https://images.squarespace-cdn.com/content/v1/63937c55c3c2e84a13a3ede9/a5ec48ba-61f8-47d8-b46e-38f475b6837a/MFT+logo.png?format=500w" 
                alt="Morphic Field Therapy Logo" 
                className="mb-6 w-36 h-auto mx-auto"
            />
            <img 
                src="https://images.squarespace-cdn.com/content/v1/63937c55c3c2e84a13a3ede9/01f6c706-e02f-4286-ac0b-6fcc4e7c73a1/replicate-prediction-fdmgyac9m1rj40cqm0wssy2sk8.png?format=500w" 
                alt="Animal radionico" 
                className="rounded-lg shadow-lg mx-auto mb-6 w-full max-w-md h-auto object-cover" 
            />
            <h1 className="text-5xl font-bold text-sky-400 mb-4">Protocolo de Diagnóstico Radiónico para Animales</h1>
            <p className="text-xl text-slate-300 mb-2">{VERSION_APP}</p>
            <p className="text-lg text-slate-400 mb-8">Desarrollado por: Dr. Miguel Ojeda Rios</p>
            <p className="text-xl text-slate-300 mb-8">Bienvenido al asistente interactivo para el diagnóstico radiónico en animales, ahora con módulo de trauma integrado.</p>
            <button
              onClick={() => setCurrentStep(Paso.AnimalInfo)} 
              className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-xl transition duration-150 ease-in-out text-xl"
            >
              Comenzar Diagnóstico
            </button>
          </div>
        );
      case Paso.AnimalInfo:
        const { animalInfo } = diagnostico;
        return (
          <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 1 y 2</h2>
            {renderInput("Nombre del Animal", "nombre", animalInfo.nombre)}
            {renderInput("Especie", "especie", animalInfo.especie, "select", ESPECIES_ANIMALES)}
            {renderInput("Raza/Subespecie", "razaSubespecie", animalInfo.razaSubespecie)}
            {renderInput("Edad (aprox.)", "edad", animalInfo.edad)}
            {renderInput("Sexo", "sexo", animalInfo.sexo, "select", SEXO_OPCIONES)}
            {renderInput("Estado Reproductivo", "estadoReproductivo", animalInfo.estadoReproductivo, "select", ESTADO_REPRODUCTIVO_OPCIONES)}
            {renderInput("Peso Aproximado", "pesoAproximado", animalInfo.pesoAproximado)}
            {renderInput("Características Distintivas", "caracteristicasDistintivas", animalInfo.caracteristicasDistintivas, "textarea")}
            {renderInput("Tiempo con Dueño Actual", "tiempoConDuenoActual", animalInfo.tiempoConDuenoActual)}
            {renderInput("Ambiente Actual", "ambienteActual", animalInfo.ambienteActual, "select", AMBIENTE_ACTUAL_OPCIONES)}
            {renderInput("Historia Previa", "historiaPrevia", animalInfo.historiaPrevia, "select", HISTORIA_PREVIA_OPCIONES)}
            {renderInput("Otros Animales en Casa", "otrosAnimalesCasa", animalInfo.otrosAnimalesCasa, "textarea")}
            {renderInput("Cambios Recientes", "cambiosRecientes", animalInfo.cambiosRecientes, "textarea")}
            {renderNumeroRadionico(animalInfo.numeroRadionico)}
          </div>
        );
      case Paso.TraumaScreening:
        return <TraumaScreeningStep onResponse={handleTraumaScreeningResponse} />;
      
      case Paso.TraumaIdentificacion:
        return (
            <TraumaIdentificacionStep
                tiposTrauma={diagnostico.tiposTraumaGeneral}
                cronologia={diagnostico.cronologiaTrauma || initialCronologiaTrauma}
                onToggleTipoTrauma={toggleTipoTraumaGeneral}
                onUpdateNivelImpacto={updateNivelImpactoTrauma}
                onUpdateCronologia={updateCronologiaTrauma}
            />
        );

      case Paso.DiagnosticoInstintos:
        const instintosFiltrados = INSTINTOS_PRIMARIOS_DATA.filter(ip => ip.especieAnimal.includes(diagnostico.animalInfo.especie) || diagnostico.animalInfo.especie === 'Otro');
        return (
            <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 4: Diagnóstico de Instintos Bloqueados ({diagnostico.animalInfo.especie})</h2>
                {instintosFiltrados.map(instinto => {
                    const diagInstinto = diagnostico.instintosBloqueados.find(ib => ib.instintoId === instinto.id);
                    if (!diagInstinto) return null;
                    return (
                        <div key={instinto.id} className="mb-5 p-4 border border-slate-700 rounded-lg bg-slate-850 shadow">
                            <div className="flex items-center justify-between">
                                <label htmlFor={`instinto-${instinto.id}`} className="flex-grow text-lg text-gray-200">
                                    <span className="font-medium text-sky-400">{instinto.nombreInstinto}:</span> {instinto.preguntaTesteo}
                                    <p className="text-sm text-slate-400 mt-1">Función: {instinto.funcionNatural}. Sano: {instinto.manifestacionSana}. Distorsión: {instinto.distorsionDomestica}</p>
                                </label>
                                <input type="checkbox" id={`instinto-${instinto.id}`} checked={diagInstinto.activo} onChange={() => toggleInstintoBloqueado(instinto.id)} className="ml-4 h-5 w-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600" />
                            </div>
                            {diagInstinto.activo && (
                                <div className="mt-3 space-y-3">
                                    <div>
                                        <label htmlFor={`nivel-${instinto.id}`} className="block text-base font-medium text-sky-300 mb-1">Nivel de Bloqueo (0-10): {diagInstinto.nivelBloqueo}</label>
                                        <input type="range" min="0" max="10" id={`nivel-${instinto.id}`} value={diagInstinto.nivelBloqueo} onChange={(e) => updateNivelBloqueoInstinto(instinto.id, parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500" />
                                    </div>
                                    {diagInstinto.nivelBloqueo >=6 && (
                                    <div>
                                        <label htmlFor={`causa-${instinto.id}`} className="block text-base font-medium text-sky-300 mb-1">Causa Principal del Bloqueo:</label>
                                        <select id={`causa-${instinto.id}`} value={diagInstinto.causaPrincipalId || ""} onChange={(e) => updateCausaBloqueoInstinto(instinto.id, e.target.value || undefined)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-base">
                                            <option value="">Seleccionar causa...</option>
                                            {CAUSAS_BLOQUEO_INSTINTO_DATA.map(causa => <option key={causa.id} value={causa.id}>{causa.causa} - {causa.preguntaConfirmacion}</option>)}
                                        </select>
                                    </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
      case Paso.ConflictosDueno:
        return (
          <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 5: Diagnóstico de Conflicto con el Dueño</h2>
            {diagnostico.conflictosDueno.map(conflicto => (
              <div key={conflicto.id} className="mb-5 p-4 border border-slate-700 rounded-lg bg-slate-850 shadow">
                <div className="flex items-center justify-between">
                  <label htmlFor={`conflictoD-${conflicto.id}`} className="flex-grow text-lg text-gray-200">
                    <span className="font-medium text-sky-400">{conflicto.tipo}:</span> {conflicto.pregunta}
                    {conflicto.efectoEnInstintos && <p className="text-sm text-slate-400 mt-1">Efecto en Instintos: {conflicto.efectoEnInstintos}</p>}
                  </label>
                  <input type="checkbox" id={`conflictoD-${conflicto.id}`} checked={conflicto.activo} onChange={() => toggleItemActivo(conflicto.id, 'conflictosDueno')} className="ml-4 h-5 w-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600" />
                </div>
                {conflicto.activo && (
                  <div className="mt-3">
                    <label htmlFor={`intensidadCD-${conflicto.id}`} className="block text-base font-medium text-sky-300 mb-1">Intensidad (0-10): {conflicto.intensidad}</label>
                    <input type="range" min="0" max="10" id={`intensidadCD-${conflicto.id}`} value={conflicto.intensidad} onChange={(e) => updateItemIntensidad(conflicto.id, parseInt(e.target.value), 'conflictosDueno')} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case Paso.InfluenciaLugar:
        return (
            <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 6: Influencia del Lugar</h2>
                <h3 className="text-2xl font-medium text-fuchsia-400 mb-3">6.1 Memorias del Lugar que Afectan Instintos</h3>
                {diagnostico.memoriasLugar.map(memoria => (
                    <div key={memoria.id} className="mb-5 p-4 border border-slate-700 rounded-lg bg-slate-850 shadow">
                        <div className="flex items-center justify-between">
                            <label htmlFor={`memoria-${memoria.id}`} className="flex-grow text-lg text-gray-200">
                                <span className="font-medium text-sky-400">{memoria.memoria}:</span> {memoria.pregunta}
                                {memoria.efectoEnInstintos && <p className="text-sm text-slate-400 mt-1">Efecto en Instintos: {memoria.efectoEnInstintos}</p>}
                            </label>
                            <input type="checkbox" id={`memoria-${memoria.id}`} checked={memoria.activo} onChange={() => toggleItemActivo(memoria.id, 'memoriasLugar')} className="ml-4 h-5 w-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600"/>
                        </div>
                        {memoria.activo && (
                            <div className="mt-3">
                                <label htmlFor={`intensidadML-${memoria.id}`} className="block text-base font-medium text-sky-300 mb-1">Intensidad (0-10): {memoria.intensidad}</label>
                                <input type="range" min="0" max="10" id={`intensidadML-${memoria.id}`} value={memoria.intensidad} onChange={(e) => updateItemIntensidad(memoria.id, parseInt(e.target.value), 'memoriasLugar')} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"/>
                            </div>
                        )}
                    </div>
                ))}
                <h3 className="text-2xl font-medium text-fuchsia-400 mb-3 mt-6">6.2 Zonas Específicas del Hogar Afectadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ZONAS_HOGAR_DATA.map(zona => (
                    <div key={zona.id} className="flex items-center p-2 bg-slate-850 rounded">
                        <input type="checkbox" id={`zona-${zona.id}`} checked={diagnostico.zonasHogarAfectadas.includes(zona.id)} onChange={() => toggleZonaHogar(zona.id)} className="mr-2 h-4 w-4 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600"/>
                        <label htmlFor={`zona-${zona.id}`} className="text-base text-slate-300">{zona.nombre} <span className="text-sm text-slate-400">({zona.memoriasAsociadas})</span></label>
                    </div>
                ))}
                </div>
            </div>
        );
      case Paso.NecesidadesBiologicas:
        const necesidadesFiltradas = diagnostico.necesidadesBiologicas.filter(n => n.especieAnimal.includes(diagnostico.animalInfo.especie) || diagnostico.animalInfo.especie === 'Otro' || n.especieAnimal.includes('Otro'));
        return (
            <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-semibold text-sky-400 mb-4">Paso 7: Evaluación de Necesidades Biológicas ({diagnostico.animalInfo.especie})</h2>
                <p className="text-base text-slate-300 mb-6">
                  A continuación, evalúe cada necesidad biológica para <strong>{diagnostico.animalInfo.nombre || 'el animal'}</strong>.
                  Por defecto, todas las necesidades se marcan como 'Satisfecha'.
                  <br />Si una necesidad específica no está cubierta:
                  <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                    <li>Desmarque la casilla 'Satisfecha'.</li>
                    <li>Ajuste el 'Nivel de Carencia' usando el control deslizante que aparecerá (0 indica carencia mínima, 10 máxima).</li>
                  </ol>
                </p>
                {necesidadesFiltradas.map(necesidad => (
                    <div key={necesidad.id} className="mb-5 p-4 border border-slate-700 rounded-lg bg-slate-850 shadow">
                        <div className="flex items-center justify-between">
                             <span className="flex-grow text-lg text-gray-200 pr-4">
                                <span className="font-medium text-sky-400">{necesidad.necesidad}:</span> {necesidad.preguntaEvaluacion}
                            </span>
                            <div className="flex items-center flex-shrink-0">
                                <label htmlFor={`necesidad-${necesidad.id}-satisfecha`} className="mr-2 text-base text-slate-300">Satisfecha:</label>
                                <input 
                                    type="checkbox" 
                                    id={`necesidad-${necesidad.id}-satisfecha`} 
                                    checked={necesidad.satisfecha} 
                                    onChange={() => toggleNecesidadSatisfecha(necesidad.id)} 
                                    className="h-5 w-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600"
                                    aria-labelledby={`necesidad-label-${necesidad.id}`}
                                />
                                <span id={`necesidad-label-${necesidad.id}`} className="sr-only">{necesidad.necesidad}: {necesidad.preguntaEvaluacion} - Satisfecha</span>
                            </div>
                        </div>
                        {!necesidad.satisfecha && (
                            <div className="mt-3">
                                <label htmlFor={`intensidadNB-${necesidad.id}`} className="block text-base font-medium text-sky-300 mb-1">Nivel de Carencia (0-10): {necesidad.intensidadNoSatisfecha}</label>
                                <input type="range" min="0" max="10" id={`intensidadNB-${necesidad.id}`} value={necesidad.intensidadNoSatisfecha} onChange={(e) => updateIntensidadNecesidad(necesidad.id, parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"/>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
      case Paso.RecursosSanacionFlores:
        // Filtrar flores por grupo y búsqueda
        const floresFiltradas = FLORES_BACH_DATA.filter(flor => {
          const cumpleGrupo = filtroGrupoFlor === 'todos' || flor.grupo === filtroGrupoFlor;
          const cumpleBusqueda = busquedaFlor === '' || 
            flor.nombre.toLowerCase().includes(busquedaFlor.toLowerCase()) ||
            (flor.instintoQueRestaura && flor.instintoQueRestaura.toLowerCase().includes(busquedaFlor.toLowerCase())) ||
            (flor.resuelve && flor.resuelve.toLowerCase().includes(busquedaFlor.toLowerCase()));
          return cumpleGrupo && cumpleBusqueda;
        });

        return (
          <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 8: Selección de Flores de Bach</h2>
            
            {/* Filtros */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Filtro por grupo */}
                <div className="flex-1">
                  <label htmlFor="filtro-grupo" className="block text-base font-medium text-sky-300 mb-2">
                    Filtrar por Grupo:
                  </label>
                  <select
                    id="filtro-grupo"
                    value={filtroGrupoFlor}
                    onChange={(e) => setFiltroGrupoFlor(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-base"
                  >
                    <option value="todos">Todos los grupos</option>
                    <option value="A">Grupo A: Reconexión con Instintos Primarios</option>
                    <option value="B">Grupo B: Instintos Específicos Bloqueados</option>
                    <option value="C">Grupo C: Conflictos con Dueño</option>
                    <option value="D">Grupo D: Influencia del Lugar</option>
                    <option value="TraumaGeneral">Trauma General</option>
                  </select>
                </div>
                
                {/* Búsqueda por nombre */}
                <div className="flex-1">
                  <label htmlFor="busqueda-flor" className="block text-base font-medium text-sky-300 mb-2">
                    Buscar por nombre o descripción:
                  </label>
                  <input
                    type="text"
                    id="busqueda-flor"
                    value={busquedaFlor}
                    onChange={(e) => setBusquedaFlor(e.target.value)}
                    placeholder="Ej: Wild Oat, caza, trauma..."
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-base"
                  />
                </div>
              </div>
              
              {/* Contador de resultados */}
              <div className="text-sm text-slate-400">
                Mostrando {floresFiltradas.length} de {FLORES_BACH_DATA.length} flores
              </div>
            </div>

            {/* Lista de flores filtradas */}
            <div className="mb-6">
              <h3 className="text-2xl font-medium text-fuchsia-400 mb-2">Flores de Bach:</h3>
              <div className="max-h-[600px] overflow-y-auto space-y-2 p-3 border border-slate-700 rounded-md bg-slate-850">
                {floresFiltradas.length > 0 ? (
                  floresFiltradas.map(flor => (
                    <div key={flor.tasa} className="flex items-start p-2 hover:bg-slate-700 rounded">
                      <input 
                        type="checkbox" 
                        id={`flor-${flor.tasa}`} 
                        checked={sanacion.flores.some(f => f.tasa === flor.tasa)} 
                        onChange={() => handleFlorSelection(flor)} 
                        className="mr-3 mt-1 h-4 w-4 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600"
                      />
                      <label htmlFor={`flor-${flor.tasa}`} className="text-base text-slate-300 cursor-pointer flex-1">
                        <div className="font-semibold text-sky-300">{flor.nombre} (T{flor.tasa})</div>
                        <div className="text-sm text-slate-400">{getFlorDescription(flor)}</div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    No se encontraron flores con los filtros aplicados
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case Paso.RecursosSanacionComandos:
        // Filtrar comandos por categoría y búsqueda
        const comandosFiltrados = COMANDOS_ESPECIFICOS_DATA.filter(cmd => {
          const cumpleCategoria = filtroCategoriaComando === 'todos' || cmd.categoriaGeneral === filtroCategoriaComando;
          const cumpleBusqueda = busquedaComando === '' || 
            cmd.comando.toLowerCase().includes(busquedaComando.toLowerCase()) ||
            (cmd.subCategoria && cmd.subCategoria.toLowerCase().includes(busquedaComando.toLowerCase()));
          return cumpleCategoria && cumpleBusqueda;
        });

        return (
          <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 9: Selección de Comandos Radiónicos Específicos</h2>
            
            {/* Filtros */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Filtro por categoría */}
                <div className="flex-1">
                  <label htmlFor="filtro-categoria" className="block text-base font-medium text-sky-300 mb-2">
                    Filtrar por Categoría:
                  </label>
                  <select
                    id="filtro-categoria"
                    value={filtroCategoriaComando}
                    onChange={(e) => setFiltroCategoriaComando(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-base"
                  >
                    <option value="todos">Todas las categorías</option>
                    <option value="ReconexionInstintiva">Reconexión Instintiva</option>
                    <option value="ConflictosSituacionales">Conflictos Situacionales</option>
                    <option value="Emergencia">Emergencia</option>
                    <option value="ProtocoloFases">Protocolo de Fases</option>
                    <option value="TraumaGeneral">Trauma General</option>
                    <option value="TraumaEspecificoAnimal">Trauma Específico Animal</option>
                    <option value="TraumaFaseProtocolo">Trauma Fase Protocolo</option>
                    <option value="TraumaComandoEspecificoTipo">Trauma Comando Específico Tipo</option>
                    <option value="TraumaEmergenciaRecuperacion">Trauma Emergencia Recuperación</option>
                  </select>
                </div>
                
                {/* Búsqueda por comando */}
                <div className="flex-1">
                  <label htmlFor="busqueda-comando" className="block text-base font-medium text-sky-300 mb-2">
                    Buscar por comando o subcategoría:
                  </label>
                  <input
                    type="text"
                    id="busqueda-comando"
                    value={busquedaComando}
                    onChange={(e) => setBusquedaComando(e.target.value)}
                    placeholder="Ej: manada, trauma, emergencia..."
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-base"
                  />
                </div>
              </div>
              
              {/* Contador de resultados */}
              <div className="text-sm text-slate-400">
                Mostrando {comandosFiltrados.length} de {COMANDOS_ESPECIFICOS_DATA.length} comandos
              </div>
            </div>

            {/* Lista de comandos filtrados */}
            <div className="mb-6">
              <h3 className="text-2xl font-medium text-fuchsia-400 mb-2">Comandos Radiónicos Específicos:</h3>
              <div className="max-h-[600px] overflow-y-auto space-y-2 p-3 border border-slate-700 rounded-md bg-slate-850">
                {comandosFiltrados.length > 0 ? (
                  comandosFiltrados.map(cmd => (
                    <div key={cmd.id} className="flex items-start p-2 hover:bg-slate-700 rounded">
                      <input 
                        type="checkbox" 
                        id={`cmd-${cmd.id}`} 
                        checked={sanacion.comandos.some(c => c.id === cmd.id)} 
                        onChange={() => handleComandoSelection(cmd)} 
                        className="mr-3 mt-1 h-4 w-4 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-600"
                      />
                      <label htmlFor={`cmd-${cmd.id}`} className="text-base text-slate-300 cursor-pointer flex-1">
                        <div className="font-semibold text-sky-300">
                          {cmd.comando.replace('[nombre]', diagnostico.animalInfo.nombre || 'el animal').replace('[especie]', diagnostico.animalInfo.especie)}
                        </div>
                        <div className="text-sm text-slate-400">
                          Categoría: {cmd.categoriaGeneral}
                          {cmd.subCategoria && ` / ${cmd.subCategoria}`}
                          {cmd.especie && cmd.especie !== 'Universal' && ` (${cmd.especie})`}
                          {cmd.duracionSugerida && ` | Duración: ${cmd.duracionSugerida}`}
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    No se encontraron comandos con los filtros aplicados
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case Paso.RecursosSanacionProtocolo:
        return (
          <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-sky-400 mb-6">Paso 10: Protocolo Final y Duración</h2>
            <div className="mb-6">
              <h3 className="text-2xl font-medium text-fuchsia-400 mb-1">Comando Integrado:</h3>
              <textarea value={sanacion.comandoIntegrado} onChange={(e) => handleComandoIntegradoChange(e.target.value)} rows={4} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-base" placeholder="Escriba aquí el comando integrado, combinando flores y comandos específicos si es necesario..."/>
            </div>
            <div>
              <h3 className="text-2xl font-medium text-fuchsia-400 mb-1">Duración del Trabajo (días):</h3>
              <input type="number" value={sanacion.duracionDias} onChange={(e) => handleDuracionChange(parseInt(e.target.value, 10) || 0)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-base" min="0"/>
              <p className="text-base text-slate-400 mt-1">Consultar Anexo A3 del manual para duraciones promedio.</p>
            </div>
          </div>
        );
      case Paso.CartaRadionica:
        const { 
            animalInfo: finalAnimalInfoCR, 
            instintosBloqueados: instintosBloqueadosCR, 
            conflictosDueno: conflictosDuenoCR, 
            memoriasLugar: memoriasLugarCR, 
            zonasHogarAfectadas: zonasHogarAfectadasCR, 
            necesidadesBiologicas: necesidadesBiologicasCR, 
            sanacionSugerida: finalSanacionSugeridaCR,
            traumaEvaluado: traumaEvaluadoCR,
            traumaDetectadoConfirmado: traumaDetectadoConfirmadoCR,
            tiposTraumaGeneral: tiposTraumaGeneralCR,
            cronologiaTrauma: cronologiaTraumaCR
        } = diagnostico;
        const finalSanacionCR = finalSanacionSugeridaCR as SanacionSugerida;

        const necesidadesBiologicasFiltradasParaCartaCR = necesidadesBiologicasCR
            .filter(n =>
                n.especieAnimal.includes(finalAnimalInfoCR.especie) ||
                finalAnimalInfoCR.especie === 'Otro' ||
                n.especieAnimal.includes('Otro')
            );

        return (
          <div className="p-6 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-4xl font-bold text-center text-sky-400 mb-8">Expediente Radiónico Animal</h2>
            <div className="space-y-6">
                <div className="bg-slate-850 p-5 rounded-lg shadow">
                    <h3 className="text-2xl font-semibold text-fuchsia-400 mb-3">Datos Básicos del Animal (Pasos 1 & 2)</h3>
                    <p className="text-lg"><strong>Número Radiónico:</strong> <span className="font-bold text-xl text-yellow-400">{finalAnimalInfoCR.numeroRadionico}</span></p>
                    <p className="text-lg"><strong>Nombre:</strong> {finalAnimalInfoCR.nombre}</p>
                    <p className="text-lg"><strong>Especie:</strong> {finalAnimalInfoCR.especie}, <strong>Raza/Subespecie:</strong> {finalAnimalInfoCR.razaSubespecie}</p>
                    <p className="text-lg"><strong>Edad:</strong> {finalAnimalInfoCR.edad}, <strong>Sexo:</strong> {finalAnimalInfoCR.sexo}, <strong>Estado Reproductivo:</strong> {finalAnimalInfoCR.estadoReproductivo}</p>
                     <p className="text-lg"><strong>Ambiente:</strong> {finalAnimalInfoCR.ambienteActual}, <strong>Historia:</strong> {finalAnimalInfoCR.historiaPrevia}</p>
                </div>
                
                {traumaEvaluadoCR && (
                <div className="bg-slate-850 p-5 rounded-lg shadow">
                    <h3 className="text-2xl font-semibold text-fuchsia-400 mb-3">Evaluación de Trauma (Paso 3)</h3>
                    <p className="text-lg text-slate-300 mb-6">
                      Pregunta de screening: ¿Este animal ha experimentado trauma significativo que afecta sus instintos naturales?
                    </p>
                    <p className="text-lg"><strong>¿Animal ha experimentado trauma significativo?:</strong> {traumaDetectadoConfirmadoCR ? 'Sí' : 'No'}</p>
                    {traumaDetectadoConfirmadoCR && tiposTraumaGeneralCR.filter(t => t.activo).length > 0 && (
                        <>
                            <h4 className="text-xl font-semibold text-sky-300 mt-2 mb-1">Tipos de Trauma Identificados (Paso 3.1):</h4>
                            <ul className="list-disc list-inside pl-4 text-base space-y-1">
                                {tiposTraumaGeneralCR.filter(t => t.activo).map(t => (
                                    <li key={t.id}>{t.tipo} (Nivel de Impacto: {t.nivelImpacto}/10)</li>
                                ))}
                            </ul>
                        </>
                    )}
                    {traumaDetectadoConfirmadoCR && cronologiaTraumaCR && (
                         <>
                            <h4 className="text-xl font-semibold text-sky-300 mt-2 mb-1">Cronología del Trauma (Paso 3.2):</h4>
                            <ul className="list-disc list-inside pl-4 text-base space-y-1">
                                <li>Edad cuando ocurrió: {cronologiaTraumaCR.edadCuandoOcurrio || 'N/A'}</li>
                                <li>Duración del trauma: {cronologiaTraumaCR.duracionDelTrauma || 'N/A'}</li>
                                <li>Tiempo desde el rescate: {cronologiaTraumaCR.tiempoDesdeRescate || 'N/A'}</li>
                                <li>Tratamientos previos: {cronologiaTraumaCR.tratamientosPrevios || 'N/A'}</li>
                            </ul>
                        </>
                    )}
                </div>
                )}


                {instintosBloqueadosCR.some(ib => ib.activo) && (
                <div className="bg-slate-850 p-5 rounded-lg shadow">
                    <h3 className="text-2xl font-semibold text-fuchsia-400 mb-3">Instintos Bloqueados (Paso 4)</h3>
                    <ul className="list-disc list-inside pl-4 text-base space-y-1">
                    {instintosBloqueadosCR.filter(ib => ib.activo).map(ib => {
                        const instintoData = INSTINTOS_PRIMARIOS_DATA.find(ip => ip.id === ib.instintoId);
                        const causaData = CAUSAS_BLOQUEO_INSTINTO_DATA.find(cb => cb.id === ib.causaPrincipalId);
                        return (<li key={ib.instintoId}>{instintoData?.nombreInstinto} (Nivel: {ib.nivelBloqueo}) {causaData ? `- Causa: ${causaData.causa}` : ''}</li>);
                    })}
                    </ul>
                </div>
                )}
                
                {conflictosDuenoCR.some(c => c.activo) && (
                <div className="bg-slate-850 p-5 rounded-lg shadow">
                    <h3 className="text-2xl font-semibold text-fuchsia-400 mb-3">Conflictos con Dueño (Activos) (Paso 5)</h3>
                    <ul className="list-disc list-inside pl-4 text-base space-y-1">
                    {conflictosDuenoCR.filter(c => c.activo).map(c => <li key={c.id}>{c.tipo} (Intensidad: {c.intensidad})</li>)}
                    </ul>
                </div>
                )}

                {(memoriasLugarCR.some(m => m.activo) || zonasHogarAfectadasCR.length > 0) && (
                <div className="bg-slate-850 p-5 rounded-lg shadow">
                    <h3 className="text-2xl font-semibold text-fuchsia-400 mb-3">Influencias del Lugar (Activas) (Paso 6)</h3>
                     <ul className="list-disc list-inside pl-4 text-base space-y-1">
                    {memoriasLugarCR.filter(m => m.activo).map(m => <li key={m.id}>{m.memoria} (Intensidad: {m.intensidad})</li>)}
                    </ul>
                    {zonasHogarAfectadasCR.length > 0 && <p className="text-base mt-2"><strong>Zonas Afectadas:</strong> {zonasHogarAfectadasCR.map(zid => ZONAS_HOGAR_DATA.find(z=>z.id === zid)?.nombre).join(', ')}</p>}
                </div>
                )}

                {necesidadesBiologicasFiltradasParaCartaCR.some(n => !n.satisfecha) && (
                 <div className="bg-slate-850 p-5 rounded-lg shadow">
                    <h3 className="text-2xl font-semibold text-fuchsia-400 mb-3">Necesidades Biológicas No Satisfechas ({finalAnimalInfoCR.especie}) (Paso 7)</h3>
                    <ul className="list-disc list-inside pl-4 text-base space-y-1">
                    {necesidadesBiologicasFiltradasParaCartaCR.filter(n => !n.satisfecha).map(n => <li key={n.id}>{n.necesidad} (Carencia: {n.intensidadNoSatisfecha})</li>)}
                    </ul>
                </div>
                )}
                
                <div className="bg-slate-850 p-5 rounded-lg shadow">
                    <h3 className="text-2xl font-semibold text-fuchsia-400 mb-3">Protocolo Aplicado (Pasos 8, 9, 10)</h3>
                    <p className="text-lg"><strong>Comando Integrado:</strong> {finalSanacionCR.comandoIntegrado || 'No ingresado'}</p>
                    <p className="text-lg"><strong>Flores Seleccionadas:</strong> {finalSanacionCR.flores.map(f => `${f.nombre} (T${f.tasa})`).join(', ') || 'Ninguna'}</p>
                    <p className="text-lg"><strong>Comandos Específicos:</strong> {finalSanacionCR.comandos.length > 0 ? finalSanacionCR.comandos.map(c => c.id).join(', ') : 'Ninguno'}</p>
                    <p className="text-lg"><strong>Duración:</strong> {finalSanacionCR.duracionDias} días</p>
                </div>
            </div>
            <div className="mt-8 text-center">
                <button
                    onClick={handleExportCartaRadionica}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out text-lg"
                >
                    Exportar Carta
                </button>
            </div>
            <p className="mt-10 text-center text-sm text-slate-500">
                {TITULO_APP} | Morphic Field Therapy® | 2025 <br />
                Desarrollado por: Dr. Miguel Ojeda Rios
            </p>
          </div>
        );
      default:
        const pasoName = Object.keys(Paso).find(key => Paso[key as keyof typeof Paso] === currentStep);
        return <div>Paso desconocido: {pasoName || currentStep}</div>;
    }
  };

  const isNextButtonDisabled = currentStep === Paso.TraumaScreening && diagnostico.traumaDetectadoConfirmado === undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100">
      <div className="container mx-auto p-4 md:p-0 w-full max-w-3xl">
        {/* Botón Volver al Inicio - visible en todos los pasos excepto el inicio */}
        {currentStep !== Paso.Inicio && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setCurrentStep(Paso.Inicio)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg shadow-md transition duration-150 ease-in-out text-sm border border-slate-600"
            >
              ← Volver al Inicio
            </button>
          </div>
        )}
        <div className="mb-10">
          <AnimatedStep stepKey={String(currentStep)}>
            {renderCurrentStep()}
          </AnimatedStep>
        </div>
        {currentStep !== Paso.Inicio && (
          <NavButtons
            onBack={currentStep === Paso.AnimalInfo ? undefined : handleBack} 
            onNext={currentStep !== Paso.CartaRadionica ? handleNext : undefined}
            isNextDisabled={isNextButtonDisabled}
            nextLabel={currentStep === Paso.RecursosSanacionProtocolo ? "Ver Carta Radiónica" : "Siguiente"}
          />
        )}
      </div>
    </div>
  );
};

export default App;
