
export interface AnimalInfo {
  nombre: string;
  especie: string; 
  razaSubespecie: string;
  edad: string; 
  sexo: 'Macho' | 'Hembra' | 'Desconocido';
  estadoReproductivo: 'Entero' | 'Castrado/Esterilizado' | 'Desconocido';
  pesoAproximado: string;
  caracteristicasDistintivas: string;
  tiempoConDuenoActual: string;
  ambienteActual: 'Urbano' | 'Rural' | 'Mixto' | 'Otro';
  historiaPrevia: 'Rescate' | 'Compra' | 'Nacimiento en casa' | 'Desconocida' | 'Otro';
  otrosAnimalesCasa: string; 
  cambiosRecientes: string; 
  numeroRadionico: string; 
}

export type ComandoCategoriaGeneral =
  | 'ReconexionInstintiva'
  | 'ConflictosSituacionales'
  | 'Emergencia'
  | 'ProtocoloFases'
  | 'TraumaGeneral' // NUEVO V4
  | 'TraumaEspecificoAnimal' // NUEVO V4 (Perro, Caballo, Gato)
  | 'TraumaFaseProtocolo' // NUEVO V4 (Estabilizacion, Desactivacion, Reconexion, Integracion)
  | 'TraumaComandoEspecificoTipo' // NUEVO V4 (Golpes, Latigo, etc.)
  | 'TraumaEmergenciaRecuperacion'; // NUEVO V4

export interface InstintoPrimario {
  id: string;
  especieAnimal: AnimalInfo['especie'][]; 
  nombreInstinto: string;
  funcionNatural: string;
  manifestacionSana: string;
  distorsionDomestica: string;
  preguntaTesteo: string;
  fuenteManual?: string; 
}

export interface CausaBloqueo {
  id: string;
  causa: string;
  descripcionDetallada: string;
  preguntaConfirmacion: string;
}

export interface Conflicto {
  id: string;
  tipo: string;
  pregunta: string;
  efectoEnInstintos?: string;
  activo: boolean;
  intensidad: number; // 0-10
  fuenteManual?: string; // e.g., "P.9"
}

export interface MemoriaLugar {
  id: string;
  memoria: string;
  efectoEnInstintos?: string;
  pregunta: string;
  activo: boolean;
  intensidad: number; // 0-10
  fuenteManual?: string; // e.g., "P.10"
}

export interface ZonaHogar {
    id: string;
    nombre: string;
    memoriasAsociadas: string;
}

export interface NecesidadBiologica {
  id: string;
  especieAnimal: AnimalInfo['especie'][];
  necesidad: string;
  preguntaEvaluacion: string;
  satisfecha: boolean;
  intensidadNoSatisfecha: number; // 0-10, si no satisfecha
}

export interface FlorBach {
  nombre: string;
  tasa: number;
  grupo?: 'A' | 'B' | 'C' | 'D' | 'TraumaGeneral' | 'TraumaEspecifico'; // A: Reconexión Primarios, B: Instintos Bloqueados, C: Dueño, D: Lugar
  categoria?: 'InstintoGeneral' | 'InstintoEspecifico' | 'Dueno' | 'Lugar' | 'Trauma';
  instintoQueRestaura?: string;
  tipoConflicto?: string;
  memoriaQueTrata?: string;
  resuelve?: string; // Para Grupo B o situaciones específicas
  florPrincipal?: string; // Para flores complementarias
  comandoDual?: string;
  efectoPrincipal?: string; // NUEVO V4 - para flores de trauma
  tipoTraumaAsociado?: string; // NUEVO V4
  floresComplementarias?: { nombre: string, tasa: number }[]; // NUEVO V4
  fuenteManual?: string; // e.g., "P.10-11, P.20, P.35-36"
}

export interface ComandoEspecifico {
  id: string;
  comando: string;
  categoriaGeneral: ComandoCategoriaGeneral;
  subCategoria?: string; // e.g., PerrosManada, GatosCaza, AnsiedadSeparacion, TraumaReciente
  descripcionAdicional?: string;
  floresAsociadas?: string; // Nombres o tasas
  especie?: AnimalInfo['especie'] | 'Universal'; // NUEVO V4
  tipoTraumaAsociado?: string; // NUEVO V4
  faseProtocoloTrauma?: string; // NUEVO V4 (Estabilizacion, Desactivacion, etc.)
  duracionSugerida?: string; // NUEVO V4
  fuenteManual?: string; // e.g., "P.12, P.15-19, P.21-23, P.32, P.37"
}

export enum Paso {
  Inicio = "INICIO",
  AnimalInfo = "ANIMAL_INFO", // Pasos 1 & 2
  TraumaScreening = "TRAUMA_SCREENING", // Paso 3 (V4.0)
  TraumaIdentificacion = "TRAUMA_IDENTIFICACION", // Pasos 3.1, 3.2 (V4.0)
  DiagnosticoInstintos = "DIAGNOSTICO_INSTINTOS", // Paso 4 (V4.0)
  ConflictosDueno = "CONFLICTOS_DUENO", // Paso 5 (V4.0)
  InfluenciaLugar = "INFLUENCIA_LUGAR", // Paso 6 (V4.0)
  NecesidadesBiologicas = "NECESIDADES_BIOLOGICAS", // Paso 7 (V4.0)
  RecursosSanacionFlores = "RECURSOS_SANACION_FLORES", // Paso 8 (V4.0)
  RecursosSanacionComandos = "RECURSOS_SANACION_COMANDOS", // Paso 9 (V4.0)
  RecursosSanacionProtocolo = "RECURSOS_SANACION_PROTOCOLO", // Paso 10 (V4.0)
  CartaRadionica = "CARTA_RADIONICA" // Paso 11 (V4.0) -> Exportación
}

export interface SanacionSugerida {
  flores: FlorBach[];
  comandos: ComandoEspecifico[];
  comandoIntegrado: string;
  duracionDias: number;
}

export interface InstintoBloqueadoDiagnostico {
  instintoId: InstintoPrimario['id'];
  activo: boolean;
  nivelBloqueo: number; // 0-10
  causaPrincipalId?: CausaBloqueo['id'];
}

export interface TipoTraumaGeneral {
  id: string;
  tipo: string;
  preguntaConfirmacion: string;
  activo: boolean;
  nivelImpacto: number; // 0-10
  // Campos adicionales de Manual V4.0 (p.12-14)
  categoriaManual?: 'A: FÍSICO DIRECTO' | 'B: EMOCIONAL/PSICOLÓGICO' | 'C: SEXUAL/REPRODUCTIVO' | 'D: SISTÉMICO/AMBIENTAL';
  manifestacionesTipicas?: string[];
  instintosMasAfectados?: string[];
  cronificacion?: string;
  ejemplosAdicionales?: string[]; // Para tipos como Peleas de Animales, Crianza en Fábrica, etc.
  fuenteManual?: string; // e.g., "P.8, P.12-14"
}

export interface CronologiaTrauma {
  edadCuandoOcurrio: string;
  duracionDelTrauma: string;
  tiempoDesdeRescate: string;
  tratamientosPrevios: string;
}

// Para la documentación especializada de Casos de Trauma (Manual p.33-34)
export interface ExpedienteTraumaDetallado {
    numeroRadionico?: string;
    nombreAnimal?: string;
    especieRaza?: string;
    edad?: string;
    rescatistaRefugio?: string;
    familiaAdoptiva?: string;
    fechaInicioTrabajo?: string;
    historiaTraumatica?: {
        tipoTrauma?: string;
        severidad?: number; // 1-10
        edadOcurrio?: string;
        duracion?: string;
        tiempoRescate?: string;
        tratamientosPrevios?: string;
    };
    manifestacionesIniciales?: {
        sintomasFisicos?: string; // Temblores (Si/No, Frecuencia), Problemas alimentación, Alteraciones sueño, Autolesión (Si/No, Tipo)
        sintomasComportamentales?: string; // Agresividad (Nivel), Miedo humanos (Nivel), Aislamiento (Nivel), Hipervigilancia (Nivel)
    };
    instintosBloqueados?: { instinto: string, nivel: number }[]; // [Instinto 1]: Nivel [X/10]
    protocoloAplicado?: { fase: string, comando: string, duracion: string, fecha: string, observaciones: string }[];
    seguimientoSemanal?: { semana: number, cambiosObservados: string }[];
    emergenciasDuranteProceso?: { fecha: string, tipo: string, comandoUsado: string }[];
    resultadosFinales?: {
        instintosRestaurados?: string;
        nivelRecuperacion?: number; // 1-10
        adaptacionNuevaFamilia?: string;
        capacidadSocializacion?: string;
        confianzaEnHumanos?: string;
    };
    recomendacionesPostTratamiento?: {
        mantenimiento?: string;
        situacionesAEvitar?: string;
        senalesRegresion?: string;
        protocoloEmergencia?: string;
    };
    fechaFinalizacion?: string;
    seguimientoProgramado?: string;
    terapeuta?: string;
}


export interface DiagnosticoCompleto {
  animalInfo: AnimalInfo;
  instintosBloqueados: InstintoBloqueadoDiagnostico[];
  conflictosDueno: Conflicto[];
  conflictosAnimal: Conflicto[]; // e.g. con otros animales de casa
  memoriasLugar: MemoriaLugar[];
  zonasHogarAfectadas: ZonaHogar['id'][];
  necesidadesBiologicas: NecesidadBiologica[];
  sanacionSugerida?: SanacionSugerida;
  // Campos V4.0 Trauma
  traumaDetectadoConfirmado?: boolean; // Resultado del screening inicial
  traumaEvaluado: boolean; // Indica si el módulo de trauma fue abordado
  tiposTraumaGeneral: TipoTraumaGeneral[]; // Identificación específica del trauma
  cronologiaTrauma?: CronologiaTrauma;
  expedienteTrauma?: ExpedienteTraumaDetallado; // Para el formato de documentación especializada
}
