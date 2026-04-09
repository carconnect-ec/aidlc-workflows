# Confianza de Marketplace — CarConnect

## Overview

Estas reglas protegen la integridad del marketplace de CarConnect frente a fraude, abuso y contenido malicioso. Son **hard constraints** que aplican cuando el feature involucra listados de vehículos, perfiles de vendedores/compradores, búsqueda o transacciones.

### Comportamiento ante incumplimiento

Un **incumplimiento de confianza de marketplace** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Marketplace Trust" con el ID de regla TRUST y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla TRUST, descripción y contexto de la fase

Si una regla TRUST no aplica al artefacto actual, marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Rule TRUST-01: Límites de publicación por vendedor

**Regla**: El diseño de cualquier módulo de publicación de vehículos DEBE incluir límites configurables de listados activos por vendedor para prevenir spam y flooding del inventario.

**Verificación**:
- El diseño documenta el límite máximo de listados activos simultáneos por cuenta (con valor configurable, no hardcodeado)
- Existe un mecanismo documentado para que administradores ajusten el límite por tipo de vendedor (particular vs. agencia)
- El error al superar el límite tiene un mensaje claro al usuario (no un error genérico 500)
- El límite aplica por cuenta, no solo por sesión (no se puede evadir con múltiples tabs)

---

## Rule TRUST-02: Validación de VIN en listados

**Regla**: Todo listado de vehículo que incluya VIN DEBE validar su formato antes de almacenarlo.

**Verificación**:
- El diseño especifica validación de formato VIN (17 caracteres alfanuméricos, sin I, O, Q)
- Se documenta si se valida solo el formato o también se consulta una fuente externa (REPUVE, CARFAX u otro)
- Los VINs duplicados en listados activos tienen manejo documentado (alerta, bloqueo o revisión manual según política)
- El modelo de datos no permite almacenar un VIN en formato inválido

---

## Rule TRUST-03: Rate limiting en endpoints de listados y búsqueda

**Regla**: Los endpoints de creación de listados y búsqueda de inventario DEBEN tener rate limiting documentado para prevenir abuso y scraping.

**Verificación**:
- El diseño de infrastructure o NFR documenta el límite de requests por IP y por usuario autenticado en endpoints de listados
- Los endpoints de búsqueda tienen límite de requests por minuto documentado
- El comportamiento al superar el límite está definido (HTTP 429 con Retry-After header)
- Se documenta si se usa un servicio de rate limiting (API Gateway throttling, Redis, etc.)

---

## Rule TRUST-04: Sistema de reporte de contenido fraudulento

**Regla**: Cualquier feature que muestre listados o perfiles públicos DEBE incluir en el diseño un mecanismo de reporte de contenido fraudulento.

**Verificación**:
- El diseño incluye un endpoint o flujo de "reportar listado/perfil" con categorías de motivo
- Se documenta qué pasa después del reporte (revisión manual, umbral de reportes para ocultamiento automático, o ambos)
- El sistema de reportes es accesible sin autenticación para listados públicos, o con autenticación mínima
- Los reportes se almacenan con timestamp y ID del reportante para auditoría

---

## Rule TRUST-05: Audit trail de transacciones

**Regla**: Toda transacción o acción de alto valor entre usuarios (oferta, aceptación, pago, cancelación) DEBE tener un registro inmutable con timestamp.

**Verificación**:
- El modelo de datos incluye una tabla/colección de eventos de transacción con campos: actor, acción, timestamp, IP, estado anterior, estado nuevo
- Los registros de transacción no tienen endpoints de eliminación ni actualización (solo inserción)
- El diseño documenta por cuánto tiempo se retienen los logs de transacción
- Los cambios de precio en listados activos también quedan registrados

---

## Rule TRUST-06: Moderación de imágenes de listados

**Regla**: El diseño de upload de imágenes de vehículos DEBE documentar el mecanismo de validación de contenido.

**Verificación**:
- Se documenta si la validación es automática (moderación por IA/API externa), manual, o combinada
- El diseño especifica los tipos de archivo aceptados y el tamaño máximo por imagen
- Se documenta qué pasa con imágenes que no pasan validación (rechazo con mensaje, cola de revisión)
- Los listados sin imágenes válidas tienen visibilidad reducida o no se publican, según política documentada

---

## Enforcement Integration

Estas reglas aplican principalmente en las fases de Requirements Analysis, Application Design, Functional Design e Infrastructure Design. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas TRUST contra los artefactos producidos
- Incluir una sección "Cumplimiento de Marketplace Trust" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
