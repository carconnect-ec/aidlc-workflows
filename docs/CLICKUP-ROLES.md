# AI-DLC en ClickUp — Guía por Rol

> Qué hace cada persona en ClickUp, cuándo y cómo. Sin teoría — solo pasos concretos.

---

## Cómo está organizado en ClickUp

```mermaid
graph TD
    GOAL["🎯 Goal: INT-001 — outcome de negocio"]
    FOLDER["📁 Folder: INT-001"]
    INC["📋 Inception\n3 Stage Tasks — solo al inicio"]
    STR["📋 Stories\nTodas las HUs del proyecto\nVista del PO"]
    U1["📋 UNIT-01\nBolt + Stage Tasks + Stories"]
    U2["📋 UNIT-02\nBolt + Stage Tasks + Stories"]
    UN["📋 UNIT-03...NN\nVacías hasta que les toque"]
    BOLT["Bolt N — US-001, US-002\nUn mini-sprint que cubre stories"]
    D1["📌 Functional Design"]
    D2["📌 NFR Requirements"]
    D3["📌 NFR Design"]
    D4["📌 Infrastructure Design"]
    D5["📌 Code Generation"]
    D6["📌 Build and Test"]
    US["📖 US-001 aparece aquí también\nvía multi-list — sin duplicar"]

    GOAL --- FOLDER
    FOLDER --> INC
    FOLDER --> STR
    FOLDER --> U1
    FOLDER --> U2
    FOLDER --> UN
    U1 --> BOLT
    BOLT --> D1 --> D2 --> D3 --> D4 --> D5 --> D6
    U1 --> US
```

---

## Cómo fluye el trabajo entre roles

```mermaid
flowchart TD
    P1["🧑‍💼 PO\nCrea Stories → NOT STARTED"]
    P2["🧑‍💼 PO\nStories → READY FOR DEV\ncuando el Unit puede arrancar"]
    D1["👨‍💻 Dev\nPlanea Bolts con Claude\nCrea Bolt + 5 Stage Tasks\nAgrega stories al Unit list"]
    D2["👨‍💻 Dev + Claude\nFunctional Design\n→ PENDING REVIEW"]
    TL1["👷 Tech Lead\nRevisa dominio y flujos\n→ DONE"]
    D3["👨‍💻 Dev + Claude\nNFR Requirements → NFR Design\n→ Infrastructure Design\n→ PENDING REVIEW"]
    TL2{"👷 Tech Lead\n¿Arquitectura aprobada?\n⛔ GATE DURO"}
    RW["👨‍💻 Dev\nRevisar diseño\ncon Claude → NEEDS REWORK"]
    D4["👨‍💻 Dev + Claude\nCode Generation\n→ Build and Test → DONE"]
    D5["👨‍💻 Dev\nStories → QA REVIEW"]
    Q1{"🧪 QA\n¿Todos los AC\nde la story pasan?"}
    Q2["🧪 QA\nStory → IMPLEMENTED"]
    Q3["🧪 QA\nCrea Bug task\nStory → HAS ISSUES"]
    P3["🧑‍💼 PO\nSiguiente Unit →\nREADY FOR DEV"]

    P1 --> P2
    P2 --> D1
    D1 --> D2
    D2 --> TL1
    TL1 --> D3
    D3 --> TL2
    TL2 -->|Aprobado → DONE| D4
    TL2 -->|Rechazado → NEEDS REWORK| RW
    RW --> D3
    D4 --> D5
    D5 --> Q1
    Q1 -->|Sí| Q2
    Q1 -->|No| Q3
    Q3 -->|Dev corrige| D4
    Q2 --> P3
    P3 --> P2
```

---

## PO (Product Owner)

### Setup — una vez por Intent

1. Crear **Goal** en ClickUp → nombre: `INT-NNN: [Outcome de negocio]`
2. Crear **folder** `INT-NNN` dentro del Space correspondiente
3. Crear lista **Inception** → agregar 3 Stage Tasks → aplicar template `ai-dlc-task-flow`
4. Crear lista **Stories** → agregar todas las HUs con AC como checklists → aplicar template `ai-dlc-stories`
5. Crear listas **UNIT-01 → UNIT-NN** (vacías) → aplicar template `ai-dlc-task-flow` a cada una
6. Configurar **Dependencies** entre Unit lists según el dependency matrix del repo

### Rutina — cuando hay un Unit activo

| Cuándo | Qué hacer |
|--------|-----------|
| El dev arranca un Unit | Verificar que las stories de ese Unit están en `READY FOR DEV` |
| Aparece una story en `QA REVIEW` | Abrir la story → revisar AC checklist → mover a `IMPLEMENTED` o `HAS ISSUES` |
| Todas las stories de un Unit → `IMPLEMENTED` | Mover las stories del siguiente Unit a `READY FOR DEV` |
| Cualquier momento | Revisar el **Goal** para ver el progreso general (stories X/N) |

### Lo que el PO NO hace

- No crea Bolts ni Stage Tasks — eso es el dev
- No toca `aidlc-docs/` — el repo es del dev
- No valida código — valida comportamiento desde perspectiva de usuario (AC)

---

## Dev

### Al arrancar un Unit

1. Con Claude, planear cuántos Bolts necesita el Unit y qué stories cubre cada uno
2. En el Unit list: crear **Bolt task** → nombre: `Bolt N — US-NNN, US-NNN`
3. Dentro del Bolt: crear los **6 Stage Tasks** como subtasks:
   - Functional Design
   - NFR Requirements
   - NFR Design
   - Infrastructure Design
   - Code Generation
   - Build and Test
4. Agregar las stories del Bolt al Unit list via **Add to multiple lists**
5. Mover esas stories a `IN DEVELOPMENT`

### Durante el Bolt — secuencia de Stage Tasks

Cada Stage Task sigue el mismo ciclo:

```
PENDING → IN PROGRESS → PENDING REVIEW → DONE
```

| Stage Task | Cuándo mover a IN PROGRESS | Cuándo mover a PENDING REVIEW | Cuándo mover a DONE |
|------------|---------------------------|-------------------------------|---------------------|
| Functional Design | Al arrancar el diseño con Claude | Claude generó el artefacto, hay que revisarlo | Tech Lead revisó y aprobó dominio y flujos |
| NFR Requirements | Al analizar NFRs con Claude | NFRs y tech stack documentados | Tech Lead revisó |
| NFR Design | Al diseñar patrones NFR | Diseño lógico incorporado | Tech Lead revisó |
| Infrastructure Design | Al mapear servicios AWS | SAM template / IaC listo | **Tech Lead aprobó la arquitectura** ⛔ GATE — Code Generation no arranca sin esto |
| Code Generation | Al empezar a generar código | Código generado, dev revisando | Dev aprobó el código |
| Build and Test | Al ejecutar tests | Tests corriendo, pendiente resultado | Tests pasando ✅ |

### Handoff a QA

Cuando **Build & Test → DONE**:
1. Mover cada story del Bolt a `QA REVIEW` en la lista Stories
2. Avisar a QA que las stories están listas para validar

### Si QA devuelve una story con `HAS ISSUES`

1. Revisar el Bug task que creó QA
2. Corregir
3. Volver a ejecutar Build & Test
4. Mover la story de vuelta a `QA REVIEW`

### Lo que el dev NO hace

- No mueve stories a `IMPLEMENTED` — eso es QA
- No crea Goals ni folders — eso es el PO
- No escribe en ClickUp lo que ya está en `aidlc-state.md`

---

## Tech Lead

### Cuándo entra el Tech Lead

En dos momentos por Bolt, ambos cuando un Stage Task aparece en `PENDING REVIEW`:

### Qué revisar en cada gate

**Gate 1 — Functional Design:**
- ¿El modelo de dominio tiene sentido? (entidades, relaciones, reglas de negocio)
- ¿Los flujos funcionales cubren los AC de las stories?
- Revisión rápida — 15 min máximo

**Gate 2 — Infrastructure Design** ⛔ Gate duro (cubre NFR Requirements + NFR Design + Infrastructure Design):
- ¿La arquitectura propuesta es correcta para este caso? (ej. Lambda + DynamoDB single-table vs RDS)
- ¿Los NFRs son realistas y alineados con el resto del sistema?
- ¿Hay ADRs que documenten decisiones no obvias?
- **Code Generation no puede arrancar hasta que este gate esté en DONE**
- Si hay algo mal: mover a `NEEDS REWORK`, comentar qué cambiar, dev itera con Claude

### Lo que el Tech Lead NO hace

- No ejecuta los Stage Tasks — los revisa
- No escribe el código — aprueba la arquitectura antes de que se escriba
- No reemplaza al dev — le da el contexto arquitectónico para que ejecute bien

---

## QA

### Cuándo entra QA

Cuando una story aparece en `QA REVIEW` en la lista **Stories**.

### Qué hacer por cada story

1. Abrir la story task
2. Ir AC por AC en el checklist
3. Validar el comportamiento desde perspectiva de usuario (no revisar código)

| Resultado | Acción |
|-----------|--------|
| Todos los AC pasan ✅ | Mover story a `IMPLEMENTED` |
| Algún AC falla ❌ | Crear task tipo **Bug** en el Unit list → mover story a `HAS ISSUES` |

### Cómo crear un Bug task

- Crear en el Unit list activo
- Nombre: `[Bug] [Descripción concisa del problema]`
- Incluir: qué AC falló, cómo reproducirlo, qué se esperaba vs qué pasó
- Severity: Critical / High / Medium / Low

### Lo que QA NO hace

- No revisa código — Build & Test ya validó eso
- No actualiza Stage Tasks — eso es el dev
- No toca `aidlc-docs/`

---

## Resumen de handoffs

```
PO crea Stories (NOT STARTED)
    ↓
PO mueve a READY FOR DEV cuando el Unit puede arrancar
    ↓
Dev arranca Unit → crea Bolt → mueve stories a IN DEVELOPMENT
    ↓
Dev termina Build & Test → mueve stories a QA REVIEW
    ↓
QA valida AC
    ↓
    ├── Todo bien → IMPLEMENTED → PO ve el progreso en el Goal
    └── Algo falla → HAS ISSUES → Dev corrige → vuelve a QA REVIEW
```

---

## Dónde mira cada uno

| Pregunta | Quién | Dónde en ClickUp |
|----------|-------|-----------------|
| ¿Qué stories están listas para validar? | QA | Lista `Stories` → filtrar por `QA REVIEW` |
| ¿Cuánto falta del proyecto? | PO | Goal → progress targets |
| ¿En qué Bolt estamos? | Dev / PO | Lista `UNIT-XX` activo → Bolt en `IN PROGRESS` |
| ¿Qué AC faltan de una story? | QA / PO | Story task → checklist |
| ¿Qué está bloqueando el avance? | PO | Lista Stories → filtrar por `HAS ISSUES` |
| ¿Qué Stage Task sigue? | Dev | Unit list → Bolt activo → próximo subtask en `PENDING` |
