# Testing de Flujos de Marketplace — CarConnect

## Overview

Estas reglas garantizan cobertura de testing en los flujos críticos del marketplace de CarConnect. Son **hard constraints** que aplican en las fases de Construction cuando el feature afecta flujos end-to-end entre usuarios.

### Comportamiento ante incumplimiento

Un **incumplimiento de testing** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Testing" con el ID de regla TEST y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla TEST, descripción y contexto de la fase

Si una regla TEST no aplica al artefacto actual, marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Applicability Question

```markdown
## Pregunta: Testing de Flujos de Marketplace CarConnect
¿Esta feature forma parte de un flujo crítico del marketplace (publicación de vehículo, búsqueda, contacto entre usuarios, oferta, o notificaciones)?

A) Sí — aplicar todas las reglas TEST como constraints bloqueantes
B) No — esta feature es interna o de soporte sin impacto en flujos de usuario
X) Otro (describir después del tag [Answer]: abajo)

[Answer]:
```

---

## Rule TEST-01: Tests de integración para flujos críticos

**Regla**: Los flujos end-to-end críticos del marketplace DEBEN tener tests de integración documentados en las instrucciones de Build and Test.

**Flujos críticos mínimos a cubrir**:
- Publicación: vendedor publica vehículo → listado aparece en resultados de búsqueda
- Contacto: comprador envía consulta → vendedor recibe notificación
- Oferta: comprador hace oferta → vendedor la recibe y puede aceptar/rechazar
- Visibilidad: listado expirado → deja de aparecer en búsqueda

**Verificación**:
- Las instrucciones de integration-test documentan al menos los flujos críticos listados arriba que apliquen al feature actual
- Cada test de integración especifica el estado inicial, los pasos y el resultado esperado
- Los tests de integración no dependen de datos de producción — usan fixtures o factories definidas
- Se documenta en qué entorno corren los tests de integración (staging, local con docker-compose, etc.)

---

## Rule TEST-02: Tests de carga antes de releases mayores

**Regla**: Cualquier feature que modifique el motor de búsqueda, la publicación de listados o el sistema de notificaciones DEBE incluir un plan de load testing en las instrucciones de Build and Test.

**Verificación**:
- Las instrucciones de build-and-test incluyen un escenario de carga documentado con: número de usuarios concurrentes simulados, duración de la prueba, y métricas de éxito (latencia P99, tasa de error)
- Se documenta la herramienta a usar para load testing (k6, Locust, Artillery u otra)
- Los criterios de fallo del load test están definidos (ej: "P99 > 1s o error rate > 1% = fallo")
- Se documenta en qué entorno corre el load test (no en producción)

---

## Rule TEST-03: Sin datos reales de producción en tests

**Regla**: Ningún test (unitario, integración o carga) DEBE usar datos reales de producción.

**Verificación**:
- Los tests usan datos sintéticos generados por factories o fixtures, nunca dumps de producción
- Los VINs usados en tests son VINs de prueba conocidos (no válidos para vehículos reales)
- Los emails y teléfonos en fixtures usan dominios de prueba (example.com, +52 000 000 0000)
- Si se necesitan datos representativos de producción, se usa anonimización documentada antes de importar al entorno de test
- Los scripts de seed/fixture están versionados en el repositorio

---

## Rule TEST-04: Contract testing entre servicios

**Regla**: Si el feature involucra comunicación entre dos o más servicios internos, DEBE haber contract tests documentados.

**Verificación**:
- Las instrucciones de integration-test identifican los contratos entre servicios involucrados (ej: servicio de listados → servicio de búsqueda, servicio de ofertas → servicio de notificaciones)
- Se documenta qué servicio es el consumer y cuál es el provider en cada contrato
- El contrato especifica el formato de request y response esperado
- Se documenta la herramienta de contract testing a usar (Pact, Spring Cloud Contract u otra) o se justifica por qué no aplica

---

## Enforcement Integration

Estas reglas aplican principalmente en las fases de Code Generation y Build and Test. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas TEST contra los artefactos producidos
- Incluir una sección "Cumplimiento de Testing" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
