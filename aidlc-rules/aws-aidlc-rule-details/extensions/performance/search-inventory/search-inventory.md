# Performance de Búsqueda e Inventario — CarConnect

## Overview

Estas reglas garantizan que los features de búsqueda e inventario de vehículos en CarConnect cumplan estándares de performance desde el diseño. Son **hard constraints** que aplican cuando el feature involucra búsqueda, listado o visualización de inventario.

### Comportamiento ante incumplimiento

Un **incumplimiento de performance** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Performance" con el ID de regla PERF y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla PERF, descripción y contexto de la fase

Si una regla PERF no aplica al artefacto actual, marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Rule PERF-01: Latencia de búsqueda documentada como NFR

**Regla**: Todo feature de búsqueda DEBE tener un NFR de latencia documentado explícitamente en el diseño, con valores de P95 y P99.

**Verificación**:
- El documento de NFR Requirements incluye latencia objetivo para el endpoint de búsqueda (valor de referencia: P95 < 300ms, P99 < 500ms en condiciones normales de carga)
- Se documenta bajo qué condiciones aplica el objetivo (número de registros en inventario, concurrencia esperada)
- Los NFRs de latencia se incluyen en los criterios de aceptación del feature
- Si se usa un motor de búsqueda externo (Elasticsearch, Algolia, etc.), se documenta el SLA del proveedor como dependencia

---

## Rule PERF-02: Índices documentados en el schema

**Regla**: Todo schema de base de datos que soporte búsqueda o filtrado de inventario DEBE incluir los índices necesarios documentados explícitamente.

**Verificación**:
- El Functional Design o Infrastructure Design lista los índices requeridos para los filtros de búsqueda (marca, modelo, año, precio, ubicación, etc.)
- Los índices compuestos están justificados con el patrón de consulta que los requiere
- No se diseñan búsquedas con filtros sobre campos sin índice sin documentar el impacto
- Se documenta si se usa índice de texto completo (full-text search) y con qué configuración

---

## Rule PERF-03: Imágenes de vehículos servidas via CDN

**Regla**: Las imágenes de vehículos NO deben servirse directamente desde el servidor de origen. El diseño DEBE especificar entrega via CDN.

**Verificación**:
- El Infrastructure Design documenta el uso de CDN para imágenes (CloudFront, Cloudflare, BunnyCDN u otro)
- Se especifica la política de caché para imágenes (TTL mínimo recomendado: 7 días para imágenes de listados activos)
- El diseño incluye lazy loading para imágenes en listados (no cargar todas las imágenes al renderizar la página)
- Los formatos de imagen están documentados (se recomienda WebP con fallback JPEG)

---

## Rule PERF-04: Paginación obligatoria en listados

**Regla**: Todo endpoint que retorne múltiples vehículos DEBE implementar paginación. Las consultas sin límite están prohibidas.

**Verificación**:
- El diseño de API especifica parámetros de paginación (page/limit o cursor-based) para todos los endpoints de listado
- El tamaño máximo de página está documentado y acotado (valor de referencia: máximo 50 resultados por página)
- No existen endpoints de listado sin parámetro de límite
- La respuesta incluye metadatos de paginación (total de resultados, página actual, total de páginas o next cursor)

---

## Rule PERF-05: Estrategia de caché para datos semi-estáticos

**Regla**: Los datos que cambian con poca frecuencia (catálogo de marcas, modelos, años, tipos de combustible, estados/ciudades) DEBEN tener estrategia de caché documentada.

**Verificación**:
- El diseño identifica qué datos son semi-estáticos y qué TTL de caché aplica a cada uno
- Se documenta dónde vive el caché (CDN, Redis, memoria del servidor, localStorage del cliente)
- La estrategia de invalidación de caché está documentada (¿cómo se actualiza cuando cambia el catálogo?)
- Los endpoints de búsqueda con filtros predecibles (búsqueda por marca popular) tienen caché documentado

---

## Rule PERF-06: Debounce en búsqueda en tiempo real

**Regla**: Los componentes de búsqueda con sugerencias o resultados en tiempo real DEBEN implementar debounce para evitar requests excesivos.

**Verificación**:
- El diseño de frontend/mobile especifica debounce mínimo de 300ms para inputs de búsqueda
- Los componentes de autocompletado tienen caché client-side para queries recientes
- Se documenta el comportamiento durante el debounce (spinner, resultados anteriores, campo vacío)
- El número máximo de sugerencias en autocompletado está acotado (valor de referencia: máximo 8 sugerencias)

---

## Enforcement Integration

Estas reglas aplican principalmente en las fases de NFR Requirements, NFR Design, Functional Design e Infrastructure Design. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas PERF contra los artefactos producidos
- Incluir una sección "Cumplimiento de Performance" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
