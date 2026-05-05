# Ejemplo: ca-backoffice en ClickUp (datos reales)

> Cómo se vería este proyecto si lo abres en ClickUp hoy.

---

## GOAL

```
📊 INT-001: Sistema de Flujo de Inventario
   Owner: Ronnie
   Repo: ca-backoffice
   Started: 2026-04-21
   Phase: Construction (Unit-02 next)
   
   Targets:
   ├── Units completados: 1/9 (11%) ████░░░░░░░░░░░░░░░░
   ├── Stories implementadas: 2/17 (12%) ██░░░░░░░░░░░░░░░░░░
   ├── Criterios de aceptación cubiertos: 10/87 (11%)
   └── Deploy producción: No
```

---

## FOLDER: Inception (cerrado ✅)

```
📁 INT-001 Inception — ALL APPROVED

Task                    Status    Validated    Output
─────────────────────   ────────  ──────────   ──────────────────────────
Requirements Analysis   ✅ Done   Apr 21       11 FR, 6 NFR
User Stories            ✅ Done   Apr 21       17 stories, 4 personas
Application Design      ✅ Done   Apr 23       14 components, 6 services
Units Generation        ✅ Done   Apr 23       9 units, 4 phases
```

---

## FOLDER: User Stories (la vista de producto)

### List: UNIT-01 — Auth & Users ✅

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-001 | Crear y gestionar usuarios | Must | Laura | ✅ Implemented | 6/6 ✅ | 4 files, 39 tests |
| US-002 | Login con control de acceso por rol | Must | Todos | ✅ Implemented | 4/4 ✅ | (incluido arriba) |

**Detalle US-001:**
```
Task: US-001 — Crear y gestionar usuarios del sistema
├── Status: ✅ Implemented
├── Persona: Laura (ADMIN)
├── Priority: Must
├── Unit: → UNIT-01 Auth & Users
├── Commit: 24af5fe
│
├── Criterios de Aceptación:
│   ✅ Laura puede crear usuario con nombre, email y rol
│   ✅ Gestión via Clerk
│   ✅ 4 roles: OPERACIONES, FINANZAS, COMERCIAL, ADMIN
│   ✅ Editar rol de usuario existente
│   ✅ Desactivar sin eliminar
│   ✅ Solo ADMIN accede a gestión
│
├── Tests que cubren esta story:
│   ✅ user-service.test.ts (CRUD)
│   ✅ rbac.test.ts (permisos por rol)
│   ✅ user-schemas.test.ts (validación input)
│   ✅ authorizer.test.ts (auth flow)
│
└── Métricas:
    ├── Tests passing: 39/39
    ├── Coverage: ~85%
    └── Tiempo implementación: 6 días (todo Unit-01)
```

---

### List: UNIT-02 — Batch & Document 📋 NEXT

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-003 | Crear lote de recepción | Must | Carlos | 📋 Not Started | 0/10 | — |
| US-005 | Cargar doc SINOCASTEL | Must | Carlos | 📋 Not Started | 0/7 | — |
| US-006 | Cargar doc TELTONIKA | Must | Carlos | 📋 Not Started | 0/6 | — |

**Detalle US-003:**
```
Task: US-003 — Crear lote de recepción de dispositivos
├── Status: 📋 Not Started
├── Persona: Carlos (OPERACIONES)
├── Priority: Must
├── Unit: → UNIT-02 Batch & Document
├── Depends on: UNIT-01 ✅ (auth disponible)
│
├── Criterios de Aceptación:
│   ☐ Ingresa fecha de recepción y referencia del envío
│   ☐ Selecciona marca UNA sola vez por lote (Teltonika o Sinocastel)
│   ☐ Modelos filtrados por marca seleccionada
│   ☐ Agrega líneas: modelo + cantidad
│   ☐ Sin límite min/max de cantidad
│   ☐ Agregar/eliminar líneas dinámicamente
│   ☐ Modal de confirmación con resumen y total
│   ☐ ID único generado para el lote
│   ☐ Auditoría: createdAt, updatedAt
│   ☐ Referencia no duplicada
│
├── Tests: (se llenan después de Code Generation)
│   ☐ pendiente
│
└── Métricas:
    └── (vacío hasta que se implemente)
```

---

### List: UNIT-03 — Scanning & Verification 📋

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-004 | Escanear y verificar dispositivos | Must | Carlos | 📋 Not Started | 0/9 | — |

---

### List: UNIT-04 — Novelty Management 📋

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-007 | Registrar novedad de dispositivo | Must | Carlos | 📋 Not Started | 0/5 | — |
| US-008 | Exportar reporte de novedades | Must | Carlos | 📋 Not Started | 0/6 | — |

---

### List: UNIT-05 — Webhooks & Integration 📋

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-009 | Enviar dispositivos via webhooks | Must | Carlos, Laura | 📋 Not Started | 0/8 | — |
| US-010 | Notificación de fallo en webhooks | Must | Laura | 📋 Not Started | 0/4 | — |

---

### List: UNIT-06 — Notifications 📋

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-011 | Notificar disponibilidad a comercial | Must | Andrés | 📋 Not Started | 0/7 | — |

---

### List: UNIT-07 — Finance / Kairos 📋

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-014 | Consultar pendientes de Kairos | Must | María | 📋 Not Started | 0/4 | — |
| US-015 | Exportar formato Kairos | Must | María | 📋 Not Started | 0/5 | — |

---

### List: UNIT-08 — Dashboard & Search 📋

| ID | Story | Prioridad | Persona | Status | AC | Tests |
|---|---|---|---|---|---|---|
| US-012 | Generar acta PDF | Must | Carlos | 📋 Not Started | 0/5 | — |
| US-013 | Subir acta firmada | Should | Carlos | 📋 Not Started | 0/3 | — |
| US-016 | Dashboard con filtros | Must | Todos | 📋 Not Started | 0/6 | — |
| US-017 | Buscar dispositivo | Should | Todos | 📋 Not Started | 0/4 | — |

---

### List: UNIT-09 — Frontend 📋

| ID | Story | Prioridad | Status | AC |
|---|---|---|---|---|
| US-001 → US-017 (UI) | All | 📋 Blocked | 0/87 |

**Blocked by:** Units 01-08 (backend APIs)

---

## SPRINT FOLDERS (ejecución técnica)

### UNIT-01 Auth & Users ✅ COMPLETE (6 días)

```
📁 UNIT-01 Auth & Users
├── Assigned: [Dev]
├── Started: Apr 21
├── Completed: Apr 27
├── Duration: 6 días
├── Stories: US-001, US-002
├── Dependencies: None
│
├── Bolt 1: Functional Design ✅ (1 día)
├── Bolt 2: NFR Req + Design ✅ (1 día)
├── Bolt 3: Infra Design ✅ (1 día)
└── Bolt 4: Code + Tests ✅ (3 días)
    ├── Output: 58 files, 8 test files
    ├── Tests: 39 passing
    └── Commit: 24af5fe on feature/inventarios
```

### UNIT-02 Batch & Document 🔨 NEXT

```
📁 UNIT-02 Batch & Document
├── Assigned: [Dev]
├── Started: —
├── Estimated: 5 días (basado en Unit-01)
├── Stories: US-003, US-005, US-006
├── Dependencies: UNIT-01 ✅
│
├── Bolt 1: Functional Design 📋
├── Bolt 2: NFR Req + Design 📋
├── Bolt 3: Infra Design 📋
└── Bolt 4: Code + Tests 📋
```

### UNIT-03 a UNIT-09: misma estructura, status 📋 PENDING

---

## DEPENDENCIAS (vista Gantt/Timeline)

```
Phase 1 — Sequential:
Apr 21 ████████████ UNIT-01 ✅
       May 5  ████████████ UNIT-02 🔨
                          ████████████ UNIT-03

Phase 2 — Parallel (después de UNIT-03):
              ████████ UNIT-04 ─┐
              ████████ UNIT-05 ─┤── en paralelo
              ████████ UNIT-07 ─┤
              ████████ UNIT-08 ─┘

Phase 3 — Sequential:
                       ████ UNIT-06 (depende de UNIT-05)

Phase 4 — Final:
                            ████████████████ UNIT-09 Frontend
```

**Critical path:** UNIT-01 → 02 → 03 → 05 → 06

---

## DASHBOARDS

### Vista PO: "¿Cómo va?"

| Métrica | Valor | Visual |
|---|---|---|
| Progreso Units | 1/9 | ██░░░░░░░░ 11% |
| Stories implementadas | 2/17 | ██░░░░░░░░ 12% |
| Criterios cubiertos | 10/87 | █░░░░░░░░░ 11% |
| Tests passing | 39/39 | ██████████ 100% |
| Tiempo transcurrido | 14 días | — |
| Estimación restante | ~35 días | — |
| Risks abiertos | 0 | ✅ |
| Stories bloqueadas | 15 (esperan backend) | ⚠️ |

### Vista PO: "¿Qué puedo validar?"

```
Pending validation: 0 tasks
Next up: UNIT-02 Functional Design (cuando dev arranque)
```

### Vista PO: "¿Qué bloquea?"

```
UNIT-09 Frontend: Blocked by UNIT-01 through UNIT-08
UNIT-06 Notifications: Blocked by UNIT-05
UNIT-04, 05, 07, 08: Blocked by UNIT-03
UNIT-03: Blocked by UNIT-02
UNIT-02: Ready to start ← NEXT ACTION
```

---

## RESUMEN: Qué te da ClickUp que el repo no

| Necesidad | Repo | ClickUp |
|---|---|---|
| ¿Qué stories están implementadas? | Leer aidlc-state.md + inferir | Vista directa con ✅/📋 |
| ¿Qué criterios de aceptación faltan? | Leer stories.md y contar | Checklist con conteo automático |
| ¿Qué tests cubren qué story? | Buscar en el código | Checklist "Tests" en cada story |
| ¿Quién trabaja en qué? | No existe | Assignee por Unit |
| ¿Qué bloquea al frontend? | Leer dependency matrix | Dependencies visuales + Gantt |
| ¿Cuánto va a tardar? | Calcular manualmente | Estimación basada en Unit-01 |
| ¿Hay riesgos? | No documentado | Tasks tipo Risk con alertas |
| ¿Status para stakeholders? | Mandar un mensaje | Dashboard compartible |
| ¿Cuándo puedo hacer QA? | Preguntar al dev | Status "Testing" visible |
| Vista cross-proyecto | Abrir N repos | Portfolio con todos los Goals |
