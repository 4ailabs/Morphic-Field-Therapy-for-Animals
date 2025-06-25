# Manual de Diagnóstico Radiónico para Animales

Una aplicación web interactiva para guiar a través del proceso de diagnóstico radiónico para animales, identificar conflictos, influencias del lugar, necesidades biológicas, un módulo completo para la evaluación y tratamiento de trauma animal, y sugerir recursos de sanación.

**Versión 4.0 - Edición Trauma Integrada** - Desarrollado por: Dr. Miguel Ojeda Rios

## Funcionalidades

*   Guía paso a paso para el diagnóstico radiónico.
*   Identificación de información del animal (Pasos 1 y 2 del manual).
*   **Módulo de Evaluación de Trauma (Nuevo en V4.0 - Manual p.7-8):**
    *   Screening inicial de trauma (Paso 3 del manual v4.0).
    *   Identificación de tipos de trauma general, su nivel de impacto y cronología (Paso 3.1 y 3.2 del manual v4.0).
*   Diagnóstico de instintos primarios bloqueados y sus causas.
*   Evaluación de conflictos con el dueño.
*   Análisis de influencias y memorias del lugar.
*   Evaluación de necesidades biológicas específicas por especie.
*   Selección de recursos terapéuticos:
    *   Flores de Bach
    *   Comandos Radiónicos Específicos
*   Definición de protocolo final y duración del tratamiento.
*   Generación y exportación de una "Carta Radiónica" completa, incluyendo información de trauma.

## Tecnologías Utilizadas

*   React 19
*   TypeScript
*   Tailwind CSS (CDN)
*   Vite (para desarrollo y build)
*   `@google/genai` (para futuras funcionalidades de IA)

## Prerrequisitos

*   Node.js (v18 o superior recomendado)
*   npm (o yarn/pnpm)

## Configuración del Proyecto Local

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO_EN_GITHUB>
    cd nombre-del-directorio-del-proyecto
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
    o
    ```bash
    yarn install
    ```

3.  **Configurar Variables de Entorno (Opcional - para Gemini API):**
    Si planeas utilizar la API de Google Gemini en el futuro, necesitarás una API Key.
    La aplicación está configurada para buscar `process.env.API_KEY`. Para desarrollo local:
    *   Crea un archivo llamado `.env` en la raíz del proyecto.
    *   Añade tu API key al archivo `.env`:
        ```
        API_KEY=TU_API_KEY_DE_GEMINI_AQUI
        ```
    *   Este archivo `.env` está incluido en `.gitignore`, por lo que no se subirá a tu repositorio.
    *   `vite.config.ts` está configurado para hacer esta variable accesible en el código del cliente.

## Ejecutar en Desarrollo

Para iniciar el servidor de desarrollo local (generalmente en `http://localhost:3000` o el puerto que Vite elija):
```bash
npm run dev
```

## Build para Producción

Para generar los archivos estáticos para producción (en el directorio `dist/` por defecto):
```bash
npm run build
```
Puedes previsualizar el build de producción localmente con:
```bash
npm run preview
```

## Linting (Type Checking)

Para verificar errores de TypeScript sin generar un build:
```bash
npm run lint
```
Esto ejecuta `tsc --noEmit`.

## Despliegue en Vercel

1.  **Subir a GitHub:**
    Asegúrate de que tu proyecto esté en un repositorio de GitHub.

2.  **Importar Proyecto en Vercel:**
    *   Inicia sesión en tu cuenta de [Vercel](https://vercel.com).
    *   Haz clic en "Add New..." -> "Project".
    *   Importa tu repositorio de GitHub.

3.  **Configurar el Proyecto en Vercel:**
    *   **Framework Preset:** Vercel debería detectar automáticamente que es un proyecto Vite. Si no, selecciónalo.
    *   **Build Command:** `npm run build` (o `yarn build`). Vercel usualmente lo detecta desde `package.json`.
    *   **Output Directory:** `dist`. Vercel usualmente lo detecta.
    *   **Install Command:** `npm install` (o `yarn install`). Vercel usualmente lo detecta.

4.  **Variables de Entorno (API Key para Gemini API):**
    Si necesitas la API Key para futuras funcionalidades de Gemini API:
    *   En la configuración de tu proyecto en Vercel, ve a "Settings" -> "Environment Variables".
    *   Añade una variable de entorno:
        *   **Key:** `API_KEY`
        *   **Value:** `TU_API_KEY_DE_GEMINI_AQUI`
    *   Asegúrate de que esta variable esté disponible para los entornos de "Production", "Preview", y "Development" según necesites. `vite.config.ts` está preparado para usar esta variable durante el build.

5.  **Desplegar:**
    Haz clic en el botón "Deploy". Vercel construirá y desplegará tu aplicación.

---

Este README proporciona una base para tu proyecto. Puedes expandirlo según las necesidades específicas y funcionalidades futuras.