# GENERADOR DE CODIGOS QR GRATUITO

Una aplicación web moderna, rápida y elegante para generar códigos QR personalizados en alta resolución con título y descarga en múltiples formatos (PNG y SVG), lista para producción y para publicar en GitHub.

> **Autoría y Desarrollo:**  
> **Mg. Lic. Prof. Leandro Guerschberg**  
> *Profesor de Informática — DCSyD — PUEF — BIO — UNPAZ*

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38b2ac.svg?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg?logo=vite)

---

## ✨ Características

- 🚀 **Generación Instantánea**: Generá códigos QR legibles al instante desde cualquier teléfono celular o lector QR.
- 🏷️ **Título o Descripción Integrada**: Añadí un encabezado personalizado (ej: *"Menú del Restaurante"*, *"Red Wi-Fi Clientes"*), que se estampa automáticamente sobre el archivo PNG descargado.
- 📐 **Tamaños Configurables**:
  - **Chico (200px)**: Ideal para tarjetas de visita y folletos pequeños.
  - **Mediano (300px)**: Tamaño estándar y equilibrado para pantallas y documentos.
  - **Grande (400px)**: Máxima nitidez para carteles y posters impresos.
- 🎨 **Personalización Visual**: Paleta de colores seleccionables (Negro clásico, Índigo, Pizarra, Esmeralda) y ajuste del nivel de corrección de errores (L, M, Q, H).
- ⚡ **Plantillas Rápidas**: Accesos directos con un solo clic para generar QR de:
  - Enlaces / Sitios Web (`https://`)
  - Enlaces directos a WhatsApp (`wa.me`)
  - Redes Wi-Fi (`WIFI:S:...`)
  - Correo electrónico (`mailto:...`)
  - Texto libre y notas
- 📥 **Exportación Profesional**:
  - **Descargar PNG**: Con margen blanco protector y título integrado renderizado en canvas.
  - **Descargar SVG**: Formato vectorial sin pérdida de calidad para diseñadores y tipografías.
  - **Copiar Imagen**: Copiado directo al portapapeles con un clic para pegar en WhatsApp, Word, Slack o Figma.
- 🕒 **Historial Local**: Acceso rápido a tus códigos QR generados recientemente guardados en `localStorage` (sin base de datos requerida).
- 🔒 **100% Privado y Seguro**: Todo el procesamiento se realiza en el navegador del usuario; ningún texto ni URL viaja a servidores externos.
- ⌨️ **Atajo de Teclado**: Presioná `Ctrl + Enter` (o `Cmd + Enter`) para generar rápidamente.

---

## 🛠️ Tecnologías Utilizadas

- **[React 19](https://react.dev/)**: Biblioteca frontend reactiva y de alto rendimiento.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático robusto y seguro.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Diseño de interfaz moderno y responsivo.
- **[Vite](https://vitejs.dev/)**: Entorno de desarrollo ultrarrápido y empaquetado optimizado.
- **[qrcode](https://www.npmjs.com/package/qrcode)**: Motor estándar de renderizado de códigos QR.
- **[Lucide React](https://lucide.dev/)**: Iconografía limpia y consistente.

---

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/generador-codigos-qr.git
cd generador-codigos-qr
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abrí tu navegador en `http://localhost:3000` (o el puerto que indique la terminal).

### 4. Compilar para producción
```bash
npm run build
```
Los archivos estáticos listos para producción se generarán en la carpeta `dist/`.

---

## 📦 Instrucciones para subir a GitHub

Si aún no tenés el repositorio en tu cuenta de GitHub, seguí estos pasos:

```bash
# 1. Inicializar repositorio git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "feat: Generador de códigos QR inicial listo para producción"

# 4. Cambiar a la rama main
git branch -M main

# 5. Vincular a tu repositorio remoto de GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 6. Subir los cambios
git push -u origin main
```

---

## 🌐 Despliegue Rápido (Opciones recomendadas)

- **Vercel**: Conectá tu repositorio de GitHub en [vercel.com](https://vercel.com) y se desplegará automáticamente con cero configuración.
- **Netlify**: Arrastrá la carpeta `dist/` o vinculá tu repositorio en [netlify.com](https://netlify.com).
- **GitHub Pages**: Podés configurar GitHub Actions para publicar automáticamente la carpeta `dist/`.
- **Cloud Run / Docker**: El proyecto está configurado para ejecutarse en entornos de contenedores estándar.

---

## 👨‍🏫 Autoría y Créditos

Este software fue diseñado y desarrollado por:

- **Mg. Lic. Prof. Leandro Guerschberg**
- *Profesor de Informática*
- **DCSyD — PUEF — BIO — UNPAZ** (Universidad Nacional de José C. Paz)

---

## 📄 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
Copyright (c) 2026 Mg. Lic. Prof. Leandro Guerschberg - UNPAZ.
