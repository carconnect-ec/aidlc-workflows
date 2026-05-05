# AI-DLC en ClickUp — Guía de Implementación CarConnect

> ClickUp como command center para coordinar y dar visibilidad al desarrollo AI-DLC across múltiples repos, Intents y Units.

**Fecha:** 2026-05-05
**Estado:** Draft v2

---

## 1. Filosofía

**El repo (`aidlc-docs/`) es el source of truth.** Ahí viven los artefactos: requirements, designs, code summaries.

**ClickUp es el panel de control** para:
- Ver en qué fase va cada Intent/Unit/Bolt sin abrir repos
- Saber quién valida qué y cuándo
- Links directos a los artefactos en GitHub
- Coordinar cuando hay múltiples Intents en paralelo
- Vista ejecutiva para stakeholders
- Detectar bloqueos y dependencias

**Reglas:**
1. **Link, no duplicar** — Cada task tiene URL al archivo en el repo
2. **Track estado, no contenido** — ClickUp dice "en qué fase está", el repo dice "qué se hizo"
3. **Mínimo overhead** — Si crear el task toma más que hacer el trabajo, algo está mal
4. **Escalar** — Funciona igual con 1 Intent que con 50

---

## 2. Jerarquía en ClickUp

```
Workspace: CarConnect
└── Space: Conectividad Automotriz
    │
    ├── 📊 Goal: "INT-001: Flujo de Inventario (ca-backoffice)"
    │   ├── Target: 9 Units completados
    │   ├── Target: Deploy en producción
    │   └── Link: github.com/carconnect-ec/ca-backoffice
    │
    ├── 📁 Folder: INT-001 Inception
    │   └── List: Inception Stages
    │       ├── Task: "Requirements Analysis" ✅ — link → inception/requirements/
    │       ├── Task: "User Stories (17)" ✅ — link → inception/user-stories/
    │       ├── Task: "Application Design" ✅ — link → inception/application-design/
    │       └── Task: "Units Generation (9 units)" ✅ — link → inception/plans/
    │
    ├── 📁 Sprint Folder: UNIT-01 Auth & Users ✅ COMPLETE
    │   ├── Sprint: "Functional Design" ✅ Done — link → construction/unit-01/functional-design/
    │   ├── Sprint: "NFR Req + Design" ✅ Done — link → construction/unit-01/nfr-*/
    │   ├── Sprint: "Infra Design" ✅ Done — link → construction/unit-01/infrastructure-design/
    │   └── Sprint: "Code Generation" ✅ Done — link → commit 24af5fe
    │
    ├── 📁 Sprint Folder: UNIT-02 Batch & Document 🔨 ACTIVE
    │   ├── Sprint: "Functional Design" 🤖 AI Generating
    │   ├── Sprint: "NFR Requirements" 📋 Backlog
    │   ├── Sprint: "NFR Design" 📋 Backlog
    │   ├── Sprint: "Infra Design" 📋 Backlog
    │   └── Sprint: "Code Generation" 📋 Backlog
    │
    ├── 📁 Sprint Folder: UNIT-03 Scanning & Verification 📋 PENDING
    ├── 📁 Sprint Folder: UNIT-04 Novelty Management 📋 PENDING
    ├── 📁 Sprint Folder: UNIT-05 Webhooks & Integration 📋 PENDING
    ├── 📁 Sprint Folder: UNIT-06 Notifications 📋 PENDING
    ├── 📁 Sprint Folder: UNIT-07 Finance / Kairos 📋 PENDING
    ├── 📁 Sprint Folder: UNIT-08 Dashboard & Search 📋 PENDING
    └── 📁 Sprint Folder: UNIT-09 Frontend Backoffice 📋 PENDING
```

---

## 3. Tipos de Tasks (Custom Task Types)

Solo 4 tipos. Simples.

### 3.1 Stage Task 📋

**Propósito:** Representa un stage del workflow AI-DLC (Functional Design, NFR, Code Gen, etc.)

| Campo | Tipo | Para qué |
|-------|------|----------|
| Phase | Dropdown: Inception / Construction / Operations | Filtrar por fase |
| Repo Link | URL | Link directo al folder/archivo en GitHub |
| PR Link | URL | Link al PR si generó código |
| AI Model | Dropdown: Claude / Q / GPT | Qué modelo generó el artefacto |
| Validated By | People | Quién aprobó |
| Validation Date | Date | Cuándo se aprobó |

**Statuses:**
```
📋 Pending → 🤖 AI Generating → 👁️ Pending Review → ✅ Approved → 🚫 Needs Rework
```

### 3.2 Risk ⚠️

| Campo | Tipo |
|-------|------|
| Impact | Dropdown: 1-5 |
| Probability | Dropdown: 1-5 |
| Mitigation | Text |
| Blocking | Checkbox |

**Statuses:** `Identified → Mitigating → Resolved / Accepted`

### 3.3 Decision 🏗️

| Campo | Tipo |
|-------|------|
| Context | Text |
| Decision | Text |
| Alternatives | Text |
| Repo Link | URL (al ADR en el repo si existe) |

**Statuses:** `Proposed → Accepted → Deprecated`

### 3.4 Bug 🐛

| Campo | Tipo |
|-------|------|
| Severity | Dropdown: Critical/High/Medium/Low |
| Unit | Relationship → Sprint Folder |
| Environment | Dropdown |

**Statuses:** `Reported → Fixing → Resolved`

---

## 4. Cómo se usa día a día

### Cuando arranca un nuevo Intent:

1. Crear **Goal** con nombre, deadline, link al repo
2. Crear **Folder "Inception"** con tasks por cada stage
3. AI-DLC corre en el IDE → genera artefactos en `aidlc-docs/`
4. Dev actualiza el **status del task** en ClickUp y pega el **link al archivo**
5. PO revisa, aprueba → status cambia a ✅

### Cuando se definen los Units:

1. Crear un **Sprint Folder** por cada Unit
2. Dentro, crear **tasks** por cada stage de Construction (Functional Design, NFR, etc.)
3. Cada task es un "Bolt" — se ejecuta en 1-3 días

### Cuando se ejecuta un Bolt:

1. Dev abre el task, ve el link al plan en el repo
2. Ejecuta AI-DLC en el IDE
3. AI genera artefactos → dev valida
4. Dev actualiza: status ✅, pega link al output, pega link al PR/commit
5. Siguiente task

### Cuando algo se bloquea:

1. Crear task tipo **Risk** en el Sprint Folder del Unit
2. Marcar como "Blocking"
3. Asignar al responsable de resolver
4. Cuando se resuelve → status "Resolved" + link a la solución

---

## 5. Automaciones

| Trigger | Acción |
|---------|--------|
| Todos los tasks de un Sprint Folder en ✅ | Marcar Goal target como completado |
| Task en "Pending Review" > 24h | Reminder al reviewer |
| Task tipo Risk con "Blocking" = true | Notificar al Tech Lead |
| Nuevo Sprint Folder creado | Crear tasks template (Functional Design, NFR Req, NFR Design, Infra, Code Gen) |

---

## 6. Dashboards

### Command Center (equipo)

| Widget | Datos |
|--------|-------|
| Goals progress | % de cada Intent |
| Active Units | Sprint Folders con tasks en progreso |
| Pending Reviews | Tasks en status "Pending Review" |
| Blocked | Tasks tipo Risk con Blocking=true |
| Recent completions | Tasks movidos a ✅ últimas 48h |

### Stakeholder View

| Widget | Datos |
|--------|-------|
| Intent progress bars | Goals con % |
| Units timeline | Gantt de Sprint Folders |
| Risks abiertos | Count de risks no resueltos |

---

## 7. Convenciones de nombres

```
Goals:          INT-[NNN]: [Descripción] ([repo])
Folders:        INT-[NNN] Inception
Sprint Folders: UNIT-[NN] [Nombre del bounded context]
Tasks:          [Stage name] — ej. "Functional Design", "Code Generation"
Risks:          [Risk] [Descripción corta]
Decisions:      [ADR] [Decisión en una línea]
```

---

## 8. Ejemplo real: ca-backoffice mapeado

Basado en el `aidlc-state.md` actual del proyecto:

### Goal
```
INT-001: Flujo de Inventario (ca-backoffice)
├── Owner: [PO]
├── Repo: github.com/carconnect-ec/ca-backoffice
├── Target: 9/9 Units completados → actualmente 1/9
├── Status: Construction Phase — Unit 02 next
```

### Inception Folder (todo ✅)
```
INT-001 Inception
├── ✅ Requirements Analysis (11 FR, 6 NFR) → link: inception/requirements/
├── ✅ User Stories (17 stories, 4 personas) → link: inception/user-stories/
├── ✅ Workflow Planning → link: inception/plans/execution-plan.md
├── ✅ Application Design (14 components, 6 services) → link: inception/application-design/
└── ✅ Units Generation (9 units, 4 phases) → link: inception/plans/unit-of-work-plan.md
```

### Sprint Folders (Units)
```
UNIT-01 Auth & Users ✅ COMPLETE
├── ✅ Functional Design → link: construction/unit-01/functional-design/
├── ✅ NFR Requirements → link: construction/unit-01/nfr-requirements/
├── ✅ NFR Design → link: construction/unit-01/nfr-design/
├── ✅ Infrastructure Design → link: construction/unit-01/infrastructure-design/
└── ✅ Code Generation (58 files) → link: commit 24af5fe, branch feature/inventarios

UNIT-02 Batch & Document 🔨 NEXT
├── 📋 Functional Design
├── 📋 NFR Requirements
├── 📋 NFR Design
├── 📋 Infrastructure Design
└── 📋 Code Generation

UNIT-03 through UNIT-09: 📋 PENDING (same structure)
```

### Extensions habilitadas (como tags o custom field)
- Git Conventions ✅
- Security Baseline ✅
- Data Privacy (user mgmt only) ✅
- Property-Based Testing (partial) ✅
- Search/Inventory Performance ✅

---

## 9. Plan de implementación

| Día | Qué hacer |
|-----|-----------|
| 1 | Crear Space, habilitar Sprint ClickApp, crear Custom Task Types (4) |
| 2 | Crear Goal INT-001, Folder Inception, Sprint Folders para los 9 Units |
| 3 | Poblar tasks del Unit-01 (ya completado) con links reales al repo |
| 4 | Configurar automaciones (template al crear Sprint Folder, reminders) |
| 5 | Dashboard Command Center + Stakeholder View |
| 6 | Probar con Unit-02 en vivo — ajustar lo que no funcione |

---

## 10. Pricing mínimo

**Business Plan ($12/user/mes)** — necesario para:
- Custom Task Types
- Sprint ClickApp
- Goals con rollups
- Automaciones avanzadas

Para equipo de 5: **$60/mes**

---

## 11. Lo que NO hacemos

- ❌ No duplicamos contenido de `aidlc-docs/` en ClickUp
- ❌ No usamos ClickUp Docs para diseño (eso vive en el repo)
- ❌ No trackeamos story points (usamos tiempo real si acaso)
- ❌ No creamos subtasks infinitos (máximo Task → Checklist)
- ❌ No forzamos a que cada archivo del repo tenga un task (solo stages principales)
