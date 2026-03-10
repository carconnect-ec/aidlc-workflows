# Convenciones de Git — CarConnect

## Overview

Estas reglas definen las convenciones de control de versiones para todos los proyectos de CarConnect. Son **hard constraints** que aplican en las fases de Construction y en la documentación generada.

**Enforcement**: Cuando el modelo genera código, instrucciones de build/test, o documentación que incluya ejemplos de commits o branches, DEBE verificar el cumplimiento de estas reglas antes de presentar el mensaje de completación.

### Comportamiento ante incumplimiento

Un **incumplimiento de convenciones de git** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Git" con el ID de regla GIT y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla GIT, descripción y contexto de la fase

Si una regla GIT no aplica al artefacto actual (por ejemplo, GIT-02 cuando no se propone ningún branch nuevo), marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto.

---

## Applicability Question

La siguiente pregunta se incluye automáticamente en las preguntas de aclaración de Requirements Analysis cuando esta extensión se carga:

```markdown
## Pregunta: Convenciones de Git CarConnect
¿Deben aplicarse las convenciones de git de CarConnect en este proyecto?

A) Sí — aplicar todas las reglas GIT como constraints bloqueantes (recomendado para todos los proyectos de CarConnect)
B) No — omitir las reglas de git (adecuado para proyectos de terceros o migraciones en curso)
X) Otro (describir después del tag [Answer]: abajo)

[Answer]:
```

---

## Rule GIT-01: Formato de mensajes de commit

**Regla**: Todo mensaje de commit propuesto por el modelo DEBE seguir el formato Conventional Commits:

```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos válidos**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Breaking changes**: agregar `!` después del tipo (`feat!:`) o incluir `BREAKING CHANGE:` en el footer.

**Verificación**:
- El tipo es uno de los tipos válidos listados
- La descripción es clara y concisa (máximo 72 caracteres en la primera línea)
- No se usan mensajes genéricos como "cambios", "updates", "fix stuff"
- Los breaking changes están marcados explícitamente con `!` o `BREAKING CHANGE:`
- El scope (si se usa) refleja el módulo o área afectada

---

## Rule GIT-02: Nomenclatura de branches

**Regla**: Todo branch propuesto por el modelo DEBE seguir el formato `<tipo>/<descripcion-en-kebab-case>`.

**Tipos válidos**: `feat`, `fix`, `chore`, `refactor`, `docs`

**Ejemplos correctos**:
```
feat/busqueda-de-vehiculos
fix/validacion-token-expirado
chore/actualizar-dependencias
refactor/modulo-de-precios
```

**Verificación**:
- El nombre usa kebab-case (minúsculas con guiones)
- El tipo es uno de los tipos válidos
- La descripción es corta y descriptiva
- No contiene espacios, mayúsculas ni caracteres especiales

---

## Rule GIT-03: Ejemplos de git en instrucciones de Build and Test

**Regla**: El archivo `aidlc-docs/construction/build-and-test/build-and-test-summary.md` y cualquier archivo de instrucciones bajo `build-and-test/` que incluya comandos o ejemplos de git DEBE usar mensajes de commit y nombres de branch que cumplan GIT-01 y GIT-02.

**Verificación**:
- Cualquier `git commit -m "..."` de ejemplo usa formato Conventional Commits (GIT-01)
- Cualquier nombre de branch de ejemplo sigue el formato `<tipo>/<kebab-case>` (GIT-02)
- No aparecen ejemplos con mensajes genéricos como `"initial commit"`, `"changes"`, `"wip"`, `"update"` sin tipo ni scope
- No aparecen nombres de branch como `feature/myFeature`, `dev`, `develop`, `my-branch` que no cumplan GIT-02

Si el archivo de build and test no contiene ningún ejemplo de git, marcar esta regla como **N/A**.

---

## Enforcement Integration

Estas reglas son constraints transversales que aplican principalmente en las fases de Construction y en instrucciones de Build and Test. En cada fase relevante:
- Evaluar los criterios de verificación de todas las reglas GIT contra los artefactos producidos
- Incluir una sección "Cumplimiento de Convenciones de Git" en el resumen de completación de fase listando cada regla como cumplida, incumplida o N/A
- Si alguna regla está incumplida, es un hallazgo bloqueante — seguir el comportamiento definido en el Overview
