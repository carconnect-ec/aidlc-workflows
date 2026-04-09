# Privacidad de Datos — CarConnect

## Overview

Estas reglas garantizan el manejo responsable de datos personales (PII) en todos los proyectos de CarConnect. Son **hard constraints** que aplican en las fases de Inception y Construction cuando el feature involucra datos de usuarios.

### Comportamiento ante incumplimiento

Un **incumplimiento de privacidad** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Privacidad" con el ID de regla PRIVACY y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla PRIVACY, descripción y contexto de la fase

Si una regla PRIVACY no aplica al artefacto actual (por ejemplo, PRIVACY-03 en un feature sin datos de usuarios), marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Rule PRIVACY-01: Catálogo de PII

**Regla**: Todo diseño que involucre datos personales DEBE incluir un inventario explícito de qué datos se recopilan, con qué propósito, y con qué base legal.

**Verificación**:
- El Application Design o Functional Design lista cada campo de PII almacenado (nombre, email, teléfono, CURP, RFC, dirección, etc.)
- Cada campo tiene un propósito documentado (ej: "email — para notificaciones de oferta")
- Se documenta la base legal del procesamiento (consentimiento, contrato, interés legítimo)
- No se diseñan campos de PII sin propósito claro

---

## Rule PRIVACY-02: Consentimiento explícito

**Regla**: El diseño DEBE incluir un mecanismo de consentimiento para datos no esenciales al servicio contratado.

**Verificación**:
- Los flujos de registro y onboarding tienen un paso de consentimiento documentado en el diseño
- Los datos de marketing o analytics están separados de los datos operacionales en el modelo
- El usuario puede revocar el consentimiento de datos no esenciales sin perder acceso al servicio
- Las notificaciones promocionales tienen mecanismo de opt-out documentado

---

## Rule PRIVACY-03: Derecho al olvido (Right to Erasure)

**Regla**: Todo servicio que almacene PII DEBE tener documentado el mecanismo de eliminación de datos de un usuario.

**Verificación**:
- El diseño documenta qué tablas/colecciones contienen PII del usuario y cómo se eliminan en cascada
- Los backups tienen política de retención documentada (no guardar PII indefinidamente en backups)
- Se distingue entre eliminación lógica (soft delete) y eliminación real — la segunda es la requerida para derecho al olvido
- Los datos anonimizados que no pueden re-identificarse no requieren eliminación y se documenta así

---

## Rule PRIVACY-04: Minimización de datos

**Regla**: No se deben almacenar más datos personales de los estrictamente necesarios para la operación.

**Verificación**:
- No se diseñan campos "por si acaso" sin caso de uso documentado
- Los campos de PII tienen tiempo de retención definido (ej: "teléfono de vendedor — se conserva mientras la cuenta esté activa")
- Los datos temporales (tokens, sesiones) tienen TTL documentado
- No se almacena historial de navegación o comportamiento sin propósito de negocio explícito

---

## Rule PRIVACY-05: Protección de PII en logs

**Regla**: Los logs del sistema NO DEBEN contener datos personales en texto plano.

**Verificación**:
- El diseño especifica que emails se enmascaran en logs (ej: `ro***@gmail.com`)
- Teléfonos, documentos de identidad y datos financieros no aparecen en logs
- Los IDs de usuario internos (UUIDs) son aceptables en logs — no los datos personales asociados
- Si se usa un servicio de logging externo (Datadog, CloudWatch), se documenta qué campos se excluyen

---

## Rule PRIVACY-06: Retención de datos documentada

**Regla**: El diseño DEBE documentar por cuánto tiempo se retienen los datos personales y qué pasa al vencer ese período.

**Verificación**:
- Cada entidad que contiene PII tiene una política de retención documentada en el diseño
- Se documenta si la retención es por requisito legal (ej: datos fiscales — 5 años SAT) o por decisión de negocio
- Los datos de usuarios inactivos tienen política definida (ej: "cuenta inactiva >2 años → notificación → eliminación")
- Las transacciones completadas retienen solo los datos mínimos requeridos por ley

---

## Enforcement Integration

Estas reglas aplican principalmente en las fases de Requirements Analysis, Application Design y Functional Design. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas PRIVACY contra los artefactos producidos
- Incluir una sección "Cumplimiento de Privacidad" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
