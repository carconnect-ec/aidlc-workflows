# Estándar de Idioma — CarConnect

## Overview

Estas reglas definen el idioma de comunicación en todos los proyectos de CarConnect. Son **hard constraints** que aplican en todas las fases del workflow AI-DLC.

**Enforcement**: En cada fase, el modelo DEBE verificar el cumplimiento de estas reglas antes de presentar el mensaje de completación al usuario.

### Comportamiento ante incumplimiento

Un **incumplimiento de idioma** significa:
1. El hallazgo DEBE listarse en el mensaje de completación de la fase bajo una sección "Hallazgos de Idioma" con el ID de regla LANG y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla LANG, descripción y contexto de la fase

Si una regla LANG no aplica al proyecto actual, marcarla como **N/A** en el resumen de cumplimiento — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Applicability Question

La siguiente pregunta se incluye automáticamente en las preguntas de aclaración de Requirements Analysis cuando esta extensión se carga:

```markdown
## Pregunta: Estándar de Idioma CarConnect
¿Deben aplicarse las reglas de idioma de CarConnect en este proyecto?

A) Sí — aplicar todas las reglas LANG como constraints bloqueantes (recomendado para todos los proyectos de CarConnect)
B) No — omitir las reglas de idioma (adecuado para proyectos externos o de terceros)
X) Otro (describir después del tag [Answer]: abajo)

[Answer]:
```

---

## Rule LANG-01: Idioma de comunicación con el usuario

**Regla**: Toda comunicación del modelo con el usuario DEBE estar en español. Esto incluye sin excepción:
- Mensajes de bienvenida y cierre de fase
- Preguntas de aclaración y opciones de respuesta
- Mensajes de aprobación y confirmación entre fases
- Descripciones de hallazgos y recomendaciones
- Mensajes de error o advertencia

**Verificación**:
- El mensaje de bienvenida está en español
- Las preguntas al usuario están en español
- Las opciones A/B/C/D/X de las preguntas están descritas en español
- Los mensajes de completación de fase están en español
- No hay párrafos o secciones en inglés dirigidas al usuario

---

## Rule LANG-02: Idioma de la documentación generada

**Regla**: Toda documentación generada en `aidlc-docs/` DEBE estar en español. Esto incluye:
- `aidlc-docs/audit.md`
- `aidlc-docs/aidlc-state.md`
- Artefactos de inception (requirements, user stories, application design, workflow planning)
- Artefactos de construction (functional design, NFR, infrastructure design, build and test)

**Verificación**:
- Los títulos y secciones de los artefactos están en español
- Las descripciones de requisitos están en español
- Las user stories están redactadas en español
- Los comentarios de auditoría están en español
- Los planes de construcción están en español

---

## Rule LANG-03: Idioma del código generado

**Regla**: El código fuente generado DEBE usar inglés para todos los identificadores técnicos. El español se reserva para comentarios de negocio cuando aporten claridad.

**Verificación**:
- Nombres de variables, funciones, clases, métodos e interfaces están en inglés
- Nombres de archivos y carpetas están en inglés
- Comentarios técnicos (cómo funciona algo) están en inglés
- Los comentarios de regla de negocio compleja pueden estar en español si aportan claridad
- Los mensajes de error que verá el usuario final siguen el idioma definido por el proyecto

---

## Enforcement Integration

Estas reglas son constraints transversales que aplican en cada fase de AI-DLC. En cada fase:
- Evaluar los criterios de verificación de todas las reglas LANG contra los artefactos producidos
- Incluir una sección "Cumplimiento de Idioma" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
