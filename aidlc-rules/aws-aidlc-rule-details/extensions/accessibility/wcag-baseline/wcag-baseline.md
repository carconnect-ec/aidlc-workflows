# Accesibilidad WCAG — CarConnect

## Overview

Estas reglas garantizan que las interfaces de CarConnect cumplan el estándar WCAG 2.1 nivel AA, requerimiento legal en múltiples jurisdicciones a partir de 2026. Son **hard constraints** que aplican en las fases de Construction cuando el feature incluye componentes de interfaz de usuario.

### Comportamiento ante incumplimiento

Un **incumplimiento de accesibilidad** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Accesibilidad" con el ID de regla A11Y y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla A11Y, descripción y contexto de la fase

Si una regla A11Y no aplica al artefacto actual (por ejemplo, en un feature de backend sin UI), marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Rule A11Y-01: Etiquetas ARIA en formularios

**Regla**: Todo formulario generado DEBE tener etiquetas accesibles en todos sus campos de entrada.

**Verificación**:
- Cada `<input>`, `<select>` y `<textarea>` tiene un `<label>` asociado via `for`/`id` o un `aria-label`
- Los campos de búsqueda de vehículos, filtros, y formularios de contacto cumplen este requisito
- Los mensajes de error de validación están asociados al campo correspondiente via `aria-describedby`
- Los grupos de campos relacionados usan `<fieldset>` y `<legend>` o `role="group"` con `aria-labelledby`
- Los campos requeridos tienen `aria-required="true"` o el atributo `required`

---

## Rule A11Y-02: Contraste de color mínimo

**Regla**: El texto en la interfaz DEBE cumplir el ratio de contraste mínimo WCAG 2.1 AA.

**Verificación**:
- Texto normal (menor a 18pt o 14pt bold): ratio mínimo de contraste 4.5:1 contra el fondo
- Texto grande (18pt o más, o 14pt bold): ratio mínimo de contraste 3:1 contra el fondo
- El diseño de fichas de vehículos, precios, etiquetas de estado (disponible, vendido) y botones de CTA cumplen el ratio
- No se usa solo color para transmitir información (ej: precio rebajado indicado solo con color rojo — debe además tener un indicador textual o icono)
- Los placeholders de inputs tienen contraste mínimo de 4.5:1 (los placeholders grises claros son un error común)

---

## Rule A11Y-03: Navegación por teclado

**Regla**: Todos los elementos interactivos de la interfaz DEBEN ser accesibles y operable con teclado.

**Verificación**:
- El orden de foco (tab order) sigue el orden visual lógico de la página
- No existen trampas de foco (el usuario puede navegar sin usar el mouse)
- Los modales y dropdowns atrapan el foco dentro de ellos mientras están abiertos y lo liberan al cerrarse
- Los elementos interactivos custom (carousels de fotos de vehículos, filtros de rango de precio) tienen soporte de teclado documentado
- El foco visible es claro — no se oculta el outline del navegador sin reemplazarlo

---

## Rule A11Y-04: Texto alternativo en imágenes

**Regla**: Todas las imágenes con contenido informativo DEBEN tener texto alternativo descriptivo.

**Verificación**:
- Las fotos de vehículos en listados tienen `alt` descriptivo (ej: `alt="Honda Civic 2022 rojo, vista frontal"`)
- Las imágenes decorativas tienen `alt=""` para que los lectores de pantalla las ignoren
- Los iconos que transmiten información tienen `aria-label` o texto visible asociado
- Los logos de marcas de vehículos tienen `alt` con el nombre de la marca
- Las imágenes generadas dinámicamente tienen `alt` generado dinámicamente con los datos del vehículo

---

## Rule A11Y-05: Gestión de foco en navegación dinámica

**Regla**: Cuando el contenido de la página cambia dinámicamente (carga de resultados, apertura de modales, navegación SPA), el foco DEBE gestionarse correctamente.

**Verificación**:
- Al cargar nuevos resultados de búsqueda, se anuncia el número de resultados via `aria-live` o movimiento de foco
- Al abrir un modal, el foco se mueve al primer elemento interactivo del modal
- Al cerrar un modal, el foco regresa al elemento que lo abrió
- Los mensajes de éxito o error tras enviar un formulario son anunciados a lectores de pantalla via `role="alert"` o `aria-live="polite"`
- Las rutas en aplicaciones SPA actualizan el título de la página y anuncian el cambio de vista

---

## Enforcement Integration

Estas reglas aplican principalmente en las fases de Functional Design y Code Generation cuando hay componentes de UI. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas A11Y contra los artefactos producidos
- Incluir una sección "Cumplimiento de Accesibilidad" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
