# ClickUp AI-DLC — Pendientes

> Qué falta hacer antes de usar la estructura en producción.

---

## Bloqueantes (antes de usar en Conectividad Automotriz)

| # | Qué | Quién | Dónde | Estado |
|---|-----|-------|-------|--------|
| 1 | Configurar statuses custom en las listas | Tech Lead | Cada lista → Edit statuses → Use custom statuses | ✅ Hecho (templates creados) |
| 2 | Crear Goal `INT-001: Sistema de Flujo de Inventario` | PO | Space: Conectividad Automotriz → Goals | ⏳ Pendiente |
| 3 | Crear folder INT-001 con listas: Inception, Stories, UNIT-01 → UNIT-09 | PO + Tech Lead | Space: Conectividad Automotriz | ⏳ Pendiente |
| 4 | Poblar lista Inception con 3 Stage Tasks (✅ Done, links al repo) | PO | Folder INT-001 | ⏳ Pendiente |
| 5 | Poblar lista Stories con las 17 HUs, AC como checklists | PO | Folder INT-001 | ⏳ Pendiente |
| 6 | Configurar dependencies entre los 9 Unit lists | Tech Lead | Folder INT-001 | ⏳ Pendiente |
| 7 | Archivar el folder "AI DLC" vacío de GatherLeads | Tech Lead | Space: GatherLeads | ⏳ Pendiente |

**Templates de statuses creados (reusar en Conectividad Automotriz):**

Lista `Stories` → usar template `ai-dlc-stories`:
```
NOT STARTED → READY FOR DEV → IN DEVELOPMENT → PENDING REVIEW → QA REVIEW → IMPLEMENTED → HAS ISSUES
```

Listas `Inception` y `UNIT-XX` → usar template `ai-dlc-task-flow`:
```
PENDING → IN PROGRESS → PENDING REVIEW → DONE → NEEDS REWORK
```

---

## Space DEMO "AI-DLC | Cómo Trabajamos"

✅ **Reconstruido con datos reales de ca-backoffice (2026-05-06)**

Estructura actual en ClickUp:
- Folder `[DEMO] INT-001 — Sistema de Flujo de Inventario`
- `Inception`: 3 Stage Tasks → DONE (links a aidlc-docs/)
- `Stories`: 17 HUs con AC completos, statuses reales
- `UNIT-01`: Bolt 1 (US-001, US-002) → DONE + 5 Stage Tasks + stories via multi-list
- `UNIT-02`: Bolt 1 (US-003, US-005, US-006) → PENDING + 5 Stage Tasks + stories via multi-list
- `UNIT-03 → 09`: listas vacías con descripción

---

## Durante UNIT-02 (cuando el dev arranque)

El dev define cuántos Bolts necesita UNIT-02 y qué stories cubre cada uno.
Opciones:
- **1 Bolt** para las 3 stories juntas (US-003, US-005, US-006) — si son cohesivas
- **2 Bolts** separando creación de lotes (US-003) de documentos (US-005, US-006)

La IA ayuda a planear. El dev decide y crea los Bolt tasks en la lista UNIT-02.

---

## Después del piloto (al terminar UNIT-03)

| # | Qué revisar |
|---|-------------|
| 1 | ¿Los 5 Stage Tasks por Bolt son suficientes o sobran? |
| 2 | ¿El "Add to multiple lists" funcionó bien en la práctica? |
| 3 | ¿QA Review como Stage Task funciona o prefieren otro mecanismo? |
| 4 | ¿Qué hacer con GatherLeads? — retroactivo o solo intents nuevos |

---

## Más adelante (sin urgencia)

| # | Qué |
|---|-----|
| 1 | Activar Dashboard Portfolio cuando haya ≥2 líneas con al menos 1 Unit completado |
| 2 | Escribir checklist de onboarding para devs nuevos — después del piloto |
| 3 | Evaluar automaciones en ClickUp para el flujo de statuses |
