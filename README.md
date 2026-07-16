# Beland

Landing page de **Beland** — el sistema operativo de la economía circular.

Una experiencia web vibrante, multilingüe y emocional que combina storytelling humano (Airbnb), energía cultural/musical (Spotify) e infraestructura tecnológica pulida (Apple).

---

## Tecnologías

- **Framework:** [TanStack Start](https://tanstack.com/start/) v1 con React 19
- **Build tool:** Vite 8
- **Estilos:** Tailwind CSS v4 + CSS custom properties
- **Ruteo:** file-based routing de TanStack Router
- **Gestor de paquetes:** Bun

---

## Requisitos previos

- [Bun](https://bun.sh/) instalado (versión 1.0 o superior)
- Node.js 18+ (opcional, si prefieres usar `npm`/`pnpm` en lugar de Bun)

---

## Instalación

Clona el repositorio y instala las dependencias:

```bash
bun install
```

Si usas npm:

```bash
npm install
```

---

## Ejecutar en modo desarrollo

```bash
bun dev
```

El servidor de desarrollo se iniciará por defecto en `http://localhost:8080`. TanStack Start recargará la página automáticamente al detectar cambios.

---

## Construir para producción

```bash
bun run build
```

El output se genera en la carpeta `dist/` (configurada por Vite / TanStack Start).

Para previsualizar la build local:

```bash
bun run preview
```

---

## Comandos útiles

| Comando | Descripción |
| --- | --- |
| `bun dev` | Inicia el servidor de desarrollo |
| `bun run build` | Genera la build de producción |
| `bun run build:dev` | Build en modo desarrollo |
| `bun run preview` | Sirve la build localmente |
| `bun run lint` | Ejecuta ESLint |
| `bun run format` | Formatea el código con Prettier |

---

## Estructura del proyecto

```text
src/
  assets/               # Assets e imágenes
  hooks/                # Hooks personalizados
  lib/                  # Utilidades, i18n y helpers
  routes/               # Rutas de TanStack Start
    __root.tsx          # Layout raíz (head, fonts, providers)
    index.tsx           # Landing page principal
  server.ts             # Configuración del servidor
  start.ts              # Punto de inicio de TanStack Start
  styles.css            # Tokens de diseño, animaciones y Tailwind
  router.tsx            # Configuración del router
```

---

## Internacionalización (i18n)

La aplicación soporta 5 idiomas de forma nativa:

- Español (`es`)
- English (`en`)
- Deutsch (`de`)
- Português (`pt`)
- Italiano (`it`)

El selector de idioma está en la barra de navegación y alterna el contenido sin recargar la página.

---

## Notas de desarrollo

- No uses `src/pages/` ni `src/routes/_app/index.tsx` — el routing es file-based y el layout raíz es `src/routes/__root.tsx`.
- `src/routeTree.gen.ts` se regenera automáticamente; no lo edites manualmente.
- El proyecto utiliza TypeScript en modo estricto. Asegúrate de que cada import resuelva a un archivo o paquete existente.
