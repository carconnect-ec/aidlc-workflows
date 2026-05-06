# AI-DLC en ClickUp — Framework Empresa CarConnect

> ClickUp como command center para gestionar desarrollo AI-DLC: visibilidad de producto, ejecución técnica, QA y coordinación cross-producto en todas las líneas de CarConnect.

**Fecha:** 2026-05-05
**Estado:** v2.0

---

## 1. Filosofía

**Repo (`aidlc-docs/`) = source of truth** de artefactos técnicos.
**ClickUp = gestión de producto** — estado, asignaciones, dependencias, QA, métricas.

ClickUp responde las preguntas del PO:
- ¿Qué stories están implementadas y cuáles no?
- ¿En qué Unit estamos y cuántos Bolts lleva?
- ¿Quién trabaja en qué y qué está bloqueado?
- ¿Cuánto falta y cuándo podemos hacer QA?
- ¿Cómo están avanzando todas las líneas de producto?

**Reglas:**
1. **Link, no duplicar** — Tasks apuntan al repo, no copian contenido
2. **Stories son la unidad de valor** — Lo que el PO gestiona y valida
3. **Bolts son la unidad de ejecución** — Lo que el dev ejecuta dentro de un Unit
4. **Mínimo overhead** — Actualizar ClickUp no debe tomar más de 2 min por sesión
5. **Escalar** — Funciona con 1 producto o con 10 en paralelo

---

## 2. Los 3 artefactos del framework

| Artefacto | Qué es | Quién lo maneja | En ClickUp |
|-----------|--------|-----------------|------------|
| **Intent** | Objetivo de negocio de alto nivel | PO | Goal |
| **Unit** | Bloque cohesivo de trabajo derivado del Intent. Análogo a un Epic o Subdominio. Contiene las User Stories que lo implementan. | PO + Dev | List dentro del folder INT-NNN |
| **Bolt** | Mini-sprint (horas a 1-3 días) que implementa un subconjunto de stories de un Unit, pasando por el ciclo completo: diseño → código → QA. Un Unit tiene 1 o más Bolts. | Dev | Task dentro del Unit list |

**Importante:** Los Bolts no son fases (Diseño, Infra, Build). Son ciclos de ejecución que cada uno implementa stories de principio a fin. Dentro de cada Bolt hay un ciclo de hasta 6 Stage Tasks (algunos son condicionales según la complejidad del Unit).

---

## 3. Estructura del Workspace

```
Workspace: CarConnect
│
├── 🎯 Goals              ← Portfolio view: todos los Intents de todas las líneas
│
├── Space: GatherLeads
├── Space: Conectividad Automotriz
├── Space: Software Factory
└── Space: [Nueva Línea]

Dentro de cada Space:
├── 📋 Product Backlog    ← bugs, features sin Intent, mejoras técnicas
│
└── 📁 INT-001 [Nombre del outcome de negocio]
    ├── 📋 Inception       ← 3 Stage Tasks de la fase Inception (se cierran al terminar)
    ├── 📋 Stories         ← TODAS las stories del Intent, vista del PO
    ├── 📋 UNIT-01 [nombre] ← Ejecución: Bolts + stories via multi-list
    ├── 📋 UNIT-02 [nombre]
    └── 📋 UNIT-0N [nombre]
```

---

## 4. Goals (Intents)

Cada Intent = un Goal con targets medibles. Es el portfolio view del CTO/CEO.

| Campo | Ejemplo — Conectividad Automotriz |
|-------|----------------------------------|
| Nombre | INT-001: Sistema de Flujo de Inventario de Dispositivos |
| Owner | PO responsable |
| Due date | Fecha target de entrega |
| Repo link | `ca-backoffice` |
| Target 1 | Units completados (X/9) |
| Target 2 | Stories implementadas (X/17) |
| Target 3 | Deploy producción (Sí/No) |

---

## 5. Custom Task Types (5 tipos — nivel workspace)

> Se crean una sola vez en Workspace Settings → Task Types. Solo requieren nombre e ícono.
> Los **Custom Fields** son una configuración separada — se crean en el Space/Folder y se agregan a los tasks que los necesitan.

### 5.1 User Story 📖

La unidad de valor. Lo que el PO gestiona, valida y reporta.

**Custom Field obligatorio:**
- `Commit/PR` — URL al PR o commit que implementa la story

Todo lo demás va en el task mismo: el nombre incluye el ID (`US-001 — Descripción`), el Unit se infiere de la lista donde está, la prioridad usa el campo nativo de ClickUp.

**Criterios de Aceptación:** Checklist nativo de ClickUp dentro del task (cada ítem = un criterio verificable).

**Statuses** (template: `ai-dlc-stories`):
```
NOT STARTED → READY FOR DEV → IN DEVELOPMENT → PENDING REVIEW → QA REVIEW → IMPLEMENTED → HAS ISSUES
```

- **NOT STARTED:** El Unit que implementa esta story aún no puede arrancar
- **READY FOR DEV:** Las dependencias del Unit están resueltas, el dev puede arrancar
- **IN DEVELOPMENT:** El Bolt activo está implementando esta story
- **PENDING REVIEW:** Código generado, dev revisando AC técnicos antes de pasar a QA formal
- **QA REVIEW:** Build & Test pasando, QA valida desde perspectiva de usuario
- **IMPLEMENTED:** QA aprobó, AC verificados, story done
- **HAS ISSUES:** QA encontró algo que no funciona

**Definition of Done:**
1. Todos los Stage Tasks del Bolt en DONE ✅
2. Todos los AC del checklist marcados ✅
3. QA validó el comportamiento desde perspectiva de usuario ✅

---

### 5.2 Stage Task 📋

Los pasos internos de cada Bolt. Viven como subtasks dentro del Bolt task.

**Custom Field obligatorio:**
- `Repo Link` — URL a la carpeta del artefacto generado en `aidlc-docs/`

**Stage Tasks por Bolt (Construction):**
```
1. Functional Design        → AI modela dominio, entidades y flujos funcionales     [CONDITIONAL]
2. NFR Requirements         → AI determina NFRs y selecciona tech stack             [CONDITIONAL]
3. NFR Design               → AI incorpora patrones NFR y componentes lógicos       [CONDITIONAL]
4. Infrastructure Design    → AI mapea a servicios AWS reales (SAM, DynamoDB, etc.) [CONDITIONAL]
5. Code Generation          → AI genera el código, dev revisa                       [ALWAYS]
6. Build and Test           → AI genera tests, dev ejecuta y valida                 [ALWAYS]
```

**Stage Tasks de Inception** (en la lista Inception, no dentro de un Bolt):
```
1. Build Context & Elaborate Intent   → aidlc-docs/inception/requirements/
2. Define User Stories               → aidlc-docs/inception/user-stories/
3. Plan Units & Application Design   → aidlc-docs/inception/application-design/
```

**Statuses** (template: `ai-dlc-task-flow`):
```
PENDING → IN PROGRESS → PENDING REVIEW → DONE → NEEDS REWORK
```

- **PENDING:** Aún no es su turno (espera al Stage Task anterior)
- **IN PROGRESS:** Dev y Claude trabajando en este stage
- **PENDING REVIEW:** Artefacto listo, esperando revisión/aprobación
- **DONE:** Aprobado, stage cerrado
- **NEEDS REWORK:** Revisión rechazó el output, hay que iterar con Claude

**Quality gates — secuencia obligatoria:**

| Stage Task | Requiere Done anterior |
|------------|------------------------|
| NFR Requirements | Functional Design |
| NFR Design | NFR Requirements |
| Infrastructure Design | NFR Design |
| Code Generation | Infrastructure Design ⛔ GATE — requiere aprobación Tech Lead |
| Build and Test | Code Generation |

---

### 5.3 Risk ⚠️

**Custom Fields:**
- `Severity` — Dropdown: Critical / High / Medium / Low
- `Blocking` — Checkbox

El detalle (descripción del riesgo, mitigación) va en el cuerpo del task.

**Statuses:** `Identified → Mitigating → Resolved / Accepted`

---

### 5.4 Decision 🏗️

Registra ADRs generados durante Construction.

**Custom Field obligatorio:**
- `Repo Link` — URL al archivo ADR en `aidlc-docs/`

El contenido del ADR vive en el repo, no en ClickUp. El task es solo el puntero y el estado de aprobación.

**Statuses:** `Proposed → Accepted → Deprecated`

---

### 5.5 Bug 🐛

**Custom Fields:**
- `Severity` — Dropdown: Critical / High / Medium / Low
- `Environment` — Dropdown: Dev / Staging / Prod

El nombre del task incluye la story afectada: `[Bug] US-003 — descripción del problema`.

**Statuses:** `Reported → Fixing → Verifying → Resolved / Won't Fix`

---

## 6. Lista: Inception

Una lista `Inception` por Intent. Contiene los 3 Stage Tasks de la fase Inception.
Se marca como completa una sola vez — al terminar Inception no se toca más.

```
📋 Inception
├── [Stage Task] Build Context & Elaborate Intent  → aidlc-docs/inception/requirements/
├── [Stage Task] Define User Stories              → aidlc-docs/inception/user-stories/
└── [Stage Task] Plan Units & Application Design  → aidlc-docs/inception/application-design/
```

Cada Stage Task tiene un checklist de outputs que el PO valida antes de marcar como Done.

---

## 7. Lista: Stories (vista del PO)

Una sola lista `Stories` dentro del folder INT-NNN. Contiene TODAS las stories del Intent.

- Agrupadas visualmente por Unit (usando secciones o un campo "Unit")
- El PO gestiona aquí: ve el status de cada story, los AC, quién la tiene asignada
- Cuando un Unit arranca, las stories de ese Unit se agregan también al Unit list via **"Add to multiple lists"** — la misma task aparece en dos lugares sin duplicación

```
📋 Stories — INT-001

[UNIT-01 — Auth & Users]
  US-001 Crear y gestionar usuarios    ✅ Implemented
  US-002 Login con control de acceso   ✅ Implemented

[UNIT-02 — Batch & Document]
  US-003 Crear lote de recepción       🟢 Ready for Dev
  US-005 Cargar doc SINOCASTEL         🟢 Ready for Dev
  US-006 Cargar doc TELTONIKA          🟢 Ready for Dev

[UNIT-03 → 09]
  US-004, 007–017                      📋 Not Started
```

**Flujo de validación de AC:**
1. Dev implementa story dentro del Bolt → marca AC técnicos
2. Dev mueve story a `🧪 QA Review`
3. QA valida AC desde perspectiva de usuario
4. Si aprueba → `✅ Implemented`
5. Si encuentra issue → crea task tipo Bug, story vuelve a `🔨 In Development`

---

## 8. Listas de Ejecución (una por Unit)

Una lista por Unit dentro del folder INT-NNN. Aquí vive la ejecución técnica.

**Qué contiene cada Unit list:**
- **Bolt tasks** — cada Bolt cubre un subconjunto de stories del Unit
- **Stage Tasks** — hasta 6 subtasks dentro de cada Bolt (el ciclo interno de Construction)
- **Stories** — las mismas stories del Unit aparecen aquí via "Add to multiple lists"
- **Risks y Decisions** — si surgen durante el trabajo del Unit

**Los Bolts los define el dev al arrancar el Unit.** No se crean de antemano. El dev + AI planean cuántos Bolts necesita el Unit y qué stories cubre cada uno.

```
📋 UNIT-02 — Batch & Document

  Bolt 1 — US-003, US-005, US-006  🔨 In Development
    ↳ [Stage Task] Functional Design        ✅ Done → aidlc-docs/.../functional-design/
    ↳ [Stage Task] NFR Requirements         🔨 In Progress
    ↳ [Stage Task] NFR Design               📋 Pending
    ↳ [Stage Task] Infrastructure Design    📋 Pending
    ↳ [Stage Task] Code Generation          📋 Pending
    ↳ [Stage Task] Build and Test           📋 Pending

  US-003 Crear lote de recepción   🔨 In Development  ← misma task de Stories list
  US-005 Cargar doc SINOCASTEL     🟢 Ready for Dev   ← via "Add to multiple lists"
  US-006 Cargar doc TELTONIKA      🟢 Ready for Dev
```

**Convención de nombre de Bolt:** `Bolt N — [stories que cubre]`
Ejemplos: `Bolt 1 — US-003, US-005, US-006` / `Bolt 2 — US-009, US-010`

---

## 9. Dependencias

Se configuran como **Dependencies** entre Unit lists.

**Ejemplo — Conectividad Automotriz (9 Units):**
```
UNIT-01 Auth & Users ✅
    └── UNIT-02 Batch & Document
            └── UNIT-03 Scanning & Verification
                    ├── UNIT-04 Novelty Management ──┐
                    ├── UNIT-05 Webhooks & Integration│
                    ├── UNIT-07 Finance / Kairos      ├── UNIT-09 Frontend
                    └── UNIT-08 Dashboard & Search ───┘
                            └── UNIT-06 Notifications (depende de UNIT-05)
```

**Critical path:** UNIT-01 → 02 → 03 → 05 → 06

Cuando un Unit se completa (todas sus stories en ✅ Implemented), las stories del siguiente Unit pasan automáticamente a `🟢 Ready for Dev`.

---

## 10. Automaciones

| Trigger | Acción |
|---------|--------|
| Unit list completada (todas stories ✅) | Stories del Unit dependiente → `🟢 Ready for Dev` |
| Story movida a `✅ Implemented` | Actualizar Goal target (stories counter +1) |
| Stage Task `Build and Test` → Done | Story del Bolt → `QA REVIEW` |
| Risk con `Blocking = true` creado | Notificar PO + Tech Lead |

---

## 11. Dashboards

### Dashboard PO: "Estado del Producto"

| Widget | Qué muestra |
|--------|-------------|
| Goal progress | % del Intent actual (stories implementadas / total) |
| Stories by status | Implemented / QA / In Dev / Ready / Not Started |
| Blocked stories | Stories esperando que dependencias terminen |
| Next actions | Stories en Ready for Dev |
| Risks abiertos | Tasks tipo Risk activos |

### Dashboard Dev: "Ejecución"

| Widget | Qué muestra |
|--------|-------------|
| Active Bolt | Bolt en curso con Stage Tasks y statuses |
| Pending reviews | Stage Tasks en Pending Review |
| Velocity | Días por Unit (histórico) |

### Dashboard Portfolio: "Todas las Líneas"

Activar cuando haya ≥2 líneas con al menos 1 Unit completado.

---

## 12. Convenciones

```
Goals:       INT-[NNN]: [Outcome de negocio]
Folders:     INT-[NNN] [Nombre del outcome]
Lists:       Inception / Stories / UNIT-[NN] [nombre del bounded context]
Bolts:       Bolt [N] — [US-NNN, US-NNN] (stories que cubre)
Stories:     US-[NNN] — [Descripción corta]
Stage Tasks: [Nombre del stage]  (Functional Design, NFR Requirements, Code Generation, etc.)
Risks:       [Risk] [Descripción]
Decisions:   [ADR] [Título]
Bugs:        [Bug] [Descripción concisa]
```

**Convención de branches Git:**

```
main
 └── release/int-[NNN]-[nombre]         ← Intent (vive hasta que se hace deploy)
      ├── feature/unit-[NN]-[nombre]    ← Unit / Bolt (se mergea al terminar el Unit)
      └── feature/unit-[NN]-[nombre]
```

- `feature/unit-XX` → `release/int-NNN` cuando el Unit está completo (todas sus stories IMPLEMENTED)
- `release/int-NNN` → `main` cuando el Intent está completo (deploy a producción)
- Si un Unit tiene varios Bolts: `feature/unit-XX-bolt-N` → `feature/unit-XX` → `release/int-NNN`

**Campo `Commit/PR` en User Story:**
Apunta al PR del Bolt que implementó esa story. Varias stories pueden apuntar al mismo PR si las cubrió un solo Bolt — es lo esperado.

---

## 13. Flujo completo (lifecycle de un Intent)

```
1.  PO escribe Vision Document → entrega al dev
2.  Dev ejecuta AI-DLC Inception → genera artefactos en aidlc-docs/
3.  PO crea Goal en ClickUp + folder INT-NNN
4.  PO crea lista Inception con 3 Stage Tasks → valida y marca Done
5.  PO crea lista Stories con todas las HUs y sus AC
6.  PO crea listas UNIT-01 → UNIT-NN (vacías inicialmente)
7.  PO configura dependencies entre Unit lists
8.  Dev arranca UNIT-01: planea Bolts con AI, crea Bolt tasks en UNIT-01 list
9.  Dev agrega stories del Unit a UNIT-01 list via "Add to multiple lists"
10. Dev ejecuta cada Bolt: hasta 6 Stage Tasks en secuencia (diseño → código → tests)
11. Al terminar Code Generation → dev marca AC técnicos en stories
12. QA valida → stories a ✅ Implemented
13. Al completar todas las stories de un Unit → siguiente Unit pasa a Ready for Dev
14. Repetir para todos los Units
15. Cuando todas las stories → Goal target met → Deploy
```

---

## 14. Plan de Rollout

### Fase 0 — Setup empresa (una sola vez)

| # | Acción | Responsable |
|---|--------|-------------|
| 1 | Crear 5 Custom Task Types en el workspace | Tech Lead |
| 2 | Espacio DEMO "AI-DLC \| Cómo Trabajamos" con estructura de referencia | Tech Lead + PO |
| 3 | Demo de 30 min al equipo | Todos |

### Fase 1 — Piloto en Conectividad Automotriz (INT-001, en curso)

- Crear Goal `INT-001: Sistema de Flujo de Inventario de Dispositivos`
- Crear folder + lista Inception (3 Stage Tasks → Approved, ya en repo)
- Crear lista Stories con las 17 HUs y sus AC
- Crear listas UNIT-01 (done) → UNIT-09 con las dependencias configuradas
- Dev crea Bolts en UNIT-02 al arrancar

**Punto de revisión:** Al terminar UNIT-03 → ¿qué ajustar?

### Fase 2 — Extensión a nuevas líneas

Cada Intent nuevo arranca con la estructura completa desde el día uno.

### Fase 3 — Portfolio view

Cuando haya ≥2 líneas activas: activar Dashboard Portfolio.

---

## 15. Lo que NO hacemos

- ❌ No duplicamos contenido de `aidlc-docs/`
- ❌ No usamos ClickUp Docs para diseño técnico (eso vive en el repo)
- ❌ No creamos un task por cada archivo del repo
- ❌ No forzamos al dev a escribir en ClickUp lo que ya está en aidlc-state.md
- ❌ No creamos Bolts de antemano — los define el dev al arrancar el Unit
- ❌ No nombramos Bolts por fase (B001-Design, B002-Infra) — los Bolts cubren stories, no fases
- ❌ No retrofitteamos Intents ya terminados
