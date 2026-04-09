# Calidad de Datos de Vehículos — CarConnect

## Overview

Estas reglas garantizan la integridad y consistencia de los datos de vehículos en el catálogo de CarConnect. Son **hard constraints** que aplican en las fases de Functional Design y Code Generation cuando el feature involucra creación o modificación de datos de vehículos.

### Comportamiento ante incumplimiento

Un **incumplimiento de calidad de datos** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Calidad de Datos" con el ID de regla VDATA y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla VDATA, descripción y contexto de la fase

Si una regla VDATA no aplica al artefacto actual, marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Rule VDATA-01: Validación de formato VIN

**Regla**: Todo campo VIN DEBE ser validado antes de almacenarse, con las reglas formales del estándar ISO 3779.

**Verificación**:
- El diseño especifica que el VIN tiene exactamente 17 caracteres alfanuméricos
- La validación excluye los caracteres I, O y Q (prohibidos por el estándar)
- Se documenta si se valida solo el formato o también el dígito verificador (posición 9 en VINs norteamericanos)
- El modelo de datos no permite almacenar un VIN que no pase la validación de formato
- Los mensajes de error al usuario son descriptivos (no "VIN inválido" sino "El VIN debe tener 17 caracteres sin las letras I, O o Q")

---

## Rule VDATA-02: Año de modelo en rango válido

**Regla**: El campo de año de modelo de un vehículo DEBE estar restringido a un rango válido.

**Verificación**:
- El diseño especifica el rango permitido para año de modelo (valor de referencia: 1885 como mínimo histórico, año actual + 2 como máximo para modelos próximos)
- El rango máximo es configurable, no hardcodeado, para soportar modelos de años futuros sin cambios de código
- El modelo de datos no permite almacenar un año fuera del rango válido
- El error al usuario especifica el rango aceptado

---

## Rule VDATA-03: Precio con sanity checks

**Regla**: El campo de precio de un vehículo DEBE tener validaciones mínimas y máximas para prevenir errores de entrada y listados fraudulentos.

**Verificación**:
- El diseño especifica un precio mínimo configurable (valor de referencia: MXN $10,000 o equivalente)
- El diseño especifica un precio máximo configurable (valor de referencia: MXN $5,000,000 o equivalente)
- Los límites son configurables por administradores sin cambios de código
- El precio se almacena como entero (centavos) o decimal con precisión documentada — no como string
- La moneda está explícitamente documentada en el modelo (no se asume una sola moneda)

---

## Rule VDATA-04: Marca y modelo desde catálogo canónico

**Regla**: Los campos de marca (make) y modelo (model) de vehículos DEBEN provenir de un catálogo controlado, no de texto libre.

**Verificación**:
- El diseño documenta la fuente del catálogo de marcas y modelos (tabla propia, API externa, archivo seed)
- Los endpoints de creación y edición de listados validan que la marca y modelo pertenezcan al catálogo
- El catálogo tiene un mecanismo de actualización documentado (¿quién puede agregar nuevas marcas/modelos?)
- Si se acepta texto libre por compatibilidad, se documenta el proceso de normalización posterior
- Las búsquedas por marca/modelo usan el catálogo canónico para garantizar consistencia de resultados

---

## Rule VDATA-05: Kilometraje con validación de rango y coherencia

**Regla**: El campo de kilometraje (odómetro) DEBE tener validaciones de rango y coherencia con el año del vehículo.

**Verificación**:
- El diseño especifica un rango válido de kilometraje (valor de referencia: 0 km mínimo, 999,999 km máximo)
- Se documenta si se valida coherencia con el año (ej: un vehículo del año actual no puede tener 900,000 km)
- El historial de cambios de kilometraje queda registrado si el vendedor actualiza el campo
- Los vehículos nuevos (0 km) tienen manejo especial documentado si aplica

---

## Enforcement Integration

Estas reglas aplican principalmente en las fases de Functional Design, NFR Requirements y Code Generation. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas VDATA contra los artefactos producidos
- Incluir una sección "Cumplimiento de Calidad de Datos" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
