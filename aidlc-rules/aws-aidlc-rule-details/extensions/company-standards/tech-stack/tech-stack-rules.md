# Reglas de Stack — CarConnect

## Overview

Estas reglas definen constraints universales de stack que aplican a todos los proyectos de CarConnect, independientemente del lenguaje o framework. Son **hard constraints** que aplican principalmente en las fases de Construction.

**Enforcement**: Cuando el modelo genera código, propone dependencias, o diseña soluciones, DEBE verificar el cumplimiento de estas reglas antes de presentar el mensaje de completación.

### Comportamiento ante incumplimiento

Un **incumplimiento de reglas de stack** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Stack" con el ID de regla STACK y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla STACK, descripción y contexto de la fase

Si una regla STACK no aplica al artefacto actual, marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Applicability Question

La siguiente pregunta se incluye automáticamente en las preguntas de aclaración de Requirements Analysis cuando esta extensión se carga:

```markdown
## Pregunta: Reglas de Stack CarConnect
¿Deben aplicarse las reglas universales de stack de CarConnect en este proyecto?

A) Sí — aplicar todas las reglas STACK como constraints bloqueantes (recomendado para todos los proyectos de CarConnect)
B) No — omitir las reglas de stack (adecuado para proyectos de terceros o experimentales)
X) Otro (describir después del tag [Answer]: abajo)

[Answer]:
```

---

## Rule STACK-01: No duplicar dependencias

**Regla**: Antes de proponer agregar una nueva dependencia, el modelo DEBE verificar si el proyecto ya tiene algo que resuelva la misma necesidad. No se puede agregar una dependencia si ya existe una equivalente en uso.

**Verificación**:
- Se revisó el archivo de dependencias del proyecto (package.json, requirements.txt, pyproject.toml u equivalente) antes de proponer cualquier nueva dependencia
- No se propone una librería de logging si ya hay una configurada
- No se propone una librería de validación si ya hay una en uso
- No se propone una librería HTTP si ya hay una disponible en el proyecto
- Cuando se propone una dependencia nueva, se documenta por qué no es equivalente a algo ya existente

---

## Rule STACK-02: No reorganizar código existente sin solicitud explícita

**Regla**: El modelo NO DEBE reorganizar, renombrar ni mover código o carpetas existentes a menos que esa reorganización sea parte explícita del pedido del usuario.

**Verificación**:
- No se proponen cambios de estructura de carpetas salvo que el usuario lo haya pedido
- No se renombran archivos existentes salvo que sea necesario para la funcionalidad solicitada
- Al agregar código nuevo a un archivo existente, se respeta el estilo y la estructura del archivo
- Las nuevas carpetas y archivos siguen las convenciones que ya existen en el proyecto

---

## Rule STACK-03: Cada repo es independiente

**Regla**: El modelo NO DEBE asumir ni proponer estructuras de monorepo. Cada repositorio de CarConnect es un proyecto independiente con su propio ciclo de vida.

**Verificación**:
- No se proponen workspaces de npm/yarn/pnpm que agrupen múltiples proyectos
- No se propone compartir dependencias entre proyectos vía symlinks o paths relativos fuera del repo
- No se asume la existencia de paquetes internos compartidos salvo que el usuario lo mencione explícitamente
- Las instrucciones de build y deploy son autocontenidas dentro del proyecto

---

## Enforcement Integration

Estas reglas son constraints transversales que aplican principalmente en las fases de Requirements Analysis, Construction y Build and Test. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas STACK contra los artefactos producidos
- Incluir una sección "Cumplimiento de Stack" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
