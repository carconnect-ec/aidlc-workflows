# AI-DLC — CarConnect

Fork interno de [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows) con extensiones y tooling propios de CarConnect.

AI-DLC (AI-Driven Development Life Cycle) es una metodología de desarrollo guiada por IA que estructura el trabajo en tres fases: **Inception** (qué construir y por qué), **Construction** (cómo construirlo) y **Operations** (pendiente en upstream).

---

## Tabla de contenidos

- [Instalación en un proyecto](#instalación-en-un-proyecto)
- [Cómo usar AI-DLC](#cómo-usar-ai-dlc)
- [Ciclo de vida de aidlc-docs/](#ciclo-de-vida-de-aidlc-docs)
- [Flujo multi-feature](#flujo-multi-feature)
- [Proyectos brownfield](#proyectos-brownfield)
- [Extensiones CarConnect](#extensiones-carconnect)
  - [Estándar de idioma](#estándar-de-idioma-company-standardslanguage)
  - [Convenciones de git](#convenciones-de-git-company-standardsgit-conventions)
  - [Seguridad baseline](#seguridad-baseline-securitybaseline)
  - [Privacidad de datos](#privacidad-de-datos-compliancedata-privacy)
  - [Confianza de marketplace](#confianza-de-marketplace-compliancemarketplace-trust)
  - [Performance de búsqueda](#performance-de-búsqueda-performancesearch-inventory)
  - [Testing de flujos críticos](#testing-de-flujos-críticos-testingmarketplace-flows)
  - [Calidad de datos de vehículos](#calidad-de-datos-de-vehículos-data-qualityvehicle-data)
  - [Accesibilidad WCAG](#accesibilidad-wcag-accessibilitywcag-baseline)
- [Recursos](#recursos)

---

## Instalación en un proyecto

Este repo expone el comando `setup-aidlc`. Córrelo desde la raíz del proyecto donde quieres usar AI-DLC.

### Opción recomendada — npx desde GitHub

```bash
cd mi-proyecto
npx github:carconnect-ec/aidlc-workflows
```

### Opción local — npm link

```bash
# Una vez, en este repo:
cd ~/carconnect/general/aidlc-workflows
npm link

# En cualquier proyecto:
cd mi-proyecto
setup-aidlc
```

### Qué hace el script

El script te pregunta qué herramienta vas a usar:

```
¿Qué herramienta vas a usar en este proyecto?

  A) Claude Code
  B) Kiro
  C) Ambas
  D) Desinstalar AI-DLC de este proyecto
```

Según la opción, copia las reglas en la ubicación que cada herramienta espera:

| Opción          | Archivos generados                                                 | Qué commitear |
| --------------- | ------------------------------------------------------------------ | ------------- |
| A — Claude Code | `CLAUDE.md`, `.aidlc-rules/`, `.aidlc-rule-details/`               | Todo          |
| B — Kiro        | `.kiro/steering/aws-aidlc-rules/`, `.kiro/aws-aidlc-rule-details/` | Todo          |
| C — Ambas       | Kiro + `CLAUDE.md` apuntando al steering de Kiro                   | Todo          |
| D — Desinstalar | Elimina todo lo anterior                                           | —             |

Si el proyecto ya tenía AI-DLC instalado, el script detecta el modo anterior y limpia lo que ya no aplica.

---

## Cómo usar AI-DLC

Una vez instalado, abre tu agente de IA en el proyecto y comienza cualquier tarea con la frase:

```
Using AI-DLC, [descripción de tu tarea]
```

### Ejemplos

```
Using AI-DLC, necesito construir un módulo de búsqueda de vehículos por filtros
```

```
Using AI-DLC, agregar autenticación con JWT al API de reservas
```

```
Using AI-DLC, refactorizar el módulo de pagos para soportar múltiples proveedores
```

AI-DLC evalúa la complejidad de tu pedido y decide qué fases ejecutar. No siempre corre todas — un bugfix simple puede ir directo a Construction sin Inception completo.

### Qué produce

Al final de cada sesión tendrás en `aidlc-docs/`:

```
aidlc-docs/
├── aidlc-state.md              ← estado actual del workflow
├── audit.md                    ← log completo de decisiones con timestamps
├── inception/
│   ├── requirements/           ← requisitos funcionales y no funcionales
│   ├── user-stories/           ← historias de usuario y personas
│   └── application-design/     ← componentes, servicios, dependencias (equivale al SDD)
└── construction/
    ├── {nombre-del-unit}/
    │   ├── functional-design/  ← lógica de negocio y modelos de dominio
    │   ├── nfr-design/         ← decisiones de performance, seguridad, escalabilidad
    │   └── infrastructure-design/
    └── build-and-test/         ← instrucciones de build, unit tests, integración
```

---

## Ciclo de vida de aidlc-docs/

**`aidlc-docs/` se commitea.** Es documentación del proyecto: los requirements acordados, las user stories aprobadas, el diseño de componentes y el audit de decisiones tienen valor permanente para el equipo.

### Qué commitear y cuándo

Commitea `aidlc-docs/` al **cerrar la feature**, junto con el código generado:

```bash
git add aidlc-docs/ src/ ...
git commit -m "feat(busqueda-vehiculos): implementar filtros por marca y modelo"
```

El `audit.md` y `aidlc-state.md` también se commitean — son el historial de por qué se tomaron las decisiones de diseño.

### Continuidad entre sesiones

Si una sesión queda interrumpida, AI-DLC detecta el `aidlc-state.md` existente al arrancar y ofrece retomar desde donde quedó:

```
Sesión anterior detectada.
  Feature: búsqueda de vehículos
  Última etapa completada: User Stories
  Siguiente etapa: Workflow Planning

¿Retomar desde aquí o iniciar desde el principio?
```

---

## Flujo multi-feature

El `aidlc-state.md` maneja **un estado por rama**. La convención en CarConnect es **una rama por feature**, lo que naturalmente aísla el `aidlc-docs/` de cada sesión.

### Ejemplo

```bash
# Feature 1
git checkout -b feat/busqueda-vehiculos
setup-aidlc   # si no estaba instalado aún
# → "Using AI-DLC, construir búsqueda de vehículos..."
# → AI-DLC genera aidlc-docs/ para esta feature
git add aidlc-docs/ src/
git commit -m "feat(busqueda-vehiculos): implementar búsqueda con filtros"
git push origin feat/busqueda-vehiculos
# → PR → merge a main

# Feature 2 (desde main actualizado)
git checkout main && git pull
git checkout -b feat/sistema-reservas
# → "Using AI-DLC, construir sistema de reservas..."
# → aidlc-docs/ empieza limpio para esta feature
```

Al mergear a `main`, los `aidlc-docs/` de cada feature se acumulan y quedan como documentación histórica del proyecto.

### ¿Qué pasa si dos devs trabajan en el mismo proyecto simultáneamente?

Cada uno en su rama — no hay conflicto. El `aidlc-docs/` vive en la rama de la feature hasta el merge.

---

## Proyectos brownfield

En proyectos con código existente, AI-DLC ejecuta primero una fase de **Reverse Engineering** antes de arrancar. Esta fase analiza el codebase y genera:

| Artefacto              | Descripción                             |
| ---------------------- | --------------------------------------- |
| `business-overview.md` | Transacciones de negocio del sistema    |
| `architecture.md`      | Diagrama de arquitectura actual         |
| `code-structure.md`    | Inventario de archivos y su propósito   |
| `api-documentation.md` | Endpoints y modelos de datos existentes |
| `technology-stack.md`  | Lenguajes, frameworks, dependencias     |
| `dependencies.md`      | Dependencias internas y externas        |

Estos artefactos se generan en `aidlc-docs/inception/reverse-engineering/` y se commitean. En sesiones posteriores, AI-DLC los carga automáticamente para no repetir el análisis.

### Primera vez en un proyecto brownfield

```bash
cd mi-proyecto-existente
setup-aidlc
# → "Using AI-DLC, agregar módulo de notificaciones push"
# → AI-DLC detecta código existente → ejecuta Reverse Engineering primero
# → Te pide aprobar el análisis antes de continuar con Requirements
```

### Segunda sesión en adelante

```bash
# AI-DLC detecta aidlc-docs/inception/reverse-engineering/ existente
# → Lo carga directamente, no repite el análisis
# → Arranca directo en Requirements Analysis
```

---

## Extensiones CarConnect

Las extensiones aplican como **constraints bloqueantes** en todos los proyectos de CarConnect. Al inicio de cada sesión AI-DLC, el agente pregunta si cada extensión aplica a la feature en curso — si la respuesta es No, se ignora completamente para esa sesión.

### Resumen de extensiones

| Extensión                           | Reglas         | Cuándo activa                                     |
| ----------------------------------- | -------------- | ------------------------------------------------- |
| `company-standards/language`        | LANG-01/02/03  | Siempre                                           |
| `company-standards/git-conventions` | GIT-01/02/03   | Siempre                                           |
| `security/baseline`                 | SECURITY-01…15 | Siempre                                           |
| `compliance/data-privacy`           | PRIVACY-01…06  | Features con PII de usuarios                      |
| `compliance/marketplace-trust`      | TRUST-01…06    | Features de listados, búsqueda o transacciones    |
| `performance/search-inventory`      | PERF-01…06     | Features de búsqueda o listado de inventario      |
| `testing/marketplace-flows`         | TEST-01…04     | Features en flujos críticos end-to-end            |
| `data-quality/vehicle-data`         | VDATA-01…05    | Features que crean o modifican datos de vehículos |
| `accessibility/wcag-baseline`       | A11Y-01…05     | Features con interfaz de usuario                  |

---

### Estándar de idioma (`company-standards/language/`)

**Reglas LANG-01, LANG-02, LANG-03**

- Toda comunicación del agente con el usuario: **español**
- Toda documentación generada en `aidlc-docs/`: **español**
- Código fuente (variables, funciones, clases, archivos): **inglés**
- Comentarios de regla de negocio compleja: pueden ir en español si aportan claridad

```typescript
// ✅ Correcto
/**
 * Validates that the vehicle listing is within the seller's active limit.
 * Regla de negocio: vendedores particulares tienen máximo 3 listados activos simultáneos.
 */
function validateListingLimit(sellerId: string, plan: SellerPlan): boolean { ... }

// ❌ Incorrecto — identificador en español
function validarLimiteDePropiedades(idVendedor: string): boolean { ... }
```

---

### Convenciones de git (`company-standards/git-conventions/`)

**Reglas GIT-01, GIT-02, GIT-03**

Todo commit y branch propuesto por el agente sigue Conventional Commits y kebab-case.

```bash
# ✅ Correcto
feat(listados): agregar validación de límite por vendedor
fix(busqueda): corregir índice de filtro por precio
chore(deps): actualizar dependencias de seguridad

# ❌ Incorrecto
git commit -m "cambios en listados"
git commit -m "fix"
git commit -m "wip"
```

```bash
# ✅ Branches correctos
feat/modulo-listados-vehiculos
fix/validacion-vin-duplicado
refactor/motor-de-busqueda

# ❌ Branches incorrectos
feature/ListadosVehiculos
dev/ronnie-cambios
fix_vin
```

---

### Seguridad baseline (`security/baseline/`)

**Reglas SECURITY-01…15** — provistas por AWS, cubre OWASP Top 10.

Ejemplos de lo que verifica el agente:

```typescript
// SECURITY-05: Input validation en todos los endpoints
// ✅ El agente exige esto en el diseño de cualquier endpoint
app.post('/listings', validateBody(listingSchema), async (req, res) => { ... })

// SECURITY-04: HTTP security headers
// ✅ El agente exige documentar estos headers en infrastructure design
helmet({
  contentSecurityPolicy: true,
  hsts: { maxAge: 31536000 },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
})
```

---

### Privacidad de datos (`compliance/data-privacy/`)

**Reglas PRIVACY-01…06** — activa cuando el feature toca PII de usuarios.

```
Ejemplo de pregunta al inicio de sesión:

  ¿Esta feature recopila, procesa o almacena datos personales de usuarios?

  A) Sí — módulo de registro de vendedores (nombre, RFC, teléfono)  ← activa PRIVACY
  B) No — módulo de caché de búsqueda                               ← ignora PRIVACY
```

Qué bloquea si está activa:

```markdown
❌ Hallazgo PRIVACY-01 — Catálogo de PII incompleto
El Functional Design del módulo de registro no lista qué campos de PII
se almacenan ni con qué propósito. Requerido antes de continuar.

❌ Hallazgo PRIVACY-05 — Logs con PII expuesta
El diseño del servicio de registro incluye logging del email completo
del usuario. Debe enmascararse (ej: ro\*\*\*@gmail.com).
```

---

### Confianza de marketplace (`compliance/marketplace-trust/`)

**Reglas TRUST-01…06** — activa cuando el feature involucra listados, perfiles o transacciones.

Qué verifica el agente en el diseño:

```markdown
✅ TRUST-01 — Límites de publicación documentados
Functional Design especifica: máximo 3 listados activos para cuentas
particulares, configurable por administradores sin cambio de código.

✅ TRUST-02 — Validación de VIN documentada
El endpoint POST /listings valida: 17 caracteres alfanuméricos,
sin I/O/Q, dígito verificador calculado. VINs duplicados en listados
activos generan alerta de moderación.

❌ TRUST-03 — Rate limiting no documentado
El diseño no especifica límites de requests en GET /search.
Requerido: documentar throttling por IP y por usuario autenticado.
```

---

### Performance de búsqueda (`performance/search-inventory/`)

**Reglas PERF-01…06** — activa cuando el feature involucra búsqueda o listado de inventario.

```markdown
✅ PERF-01 — NFR de latencia documentado
NFR Requirements especifica: P95 < 300ms, P99 < 500ms para
GET /search con hasta 50,000 vehículos en inventario.

✅ PERF-02 — Índices documentados
Schema incluye índice compuesto (make, model, year, price) para
el filtro de búsqueda principal, y índice geoespacial para
búsqueda por ubicación.

❌ PERF-04 — Paginación no implementada
GET /listings no tiene parámetros de limit/offset. Consulta
sin límite — hallazgo bloqueante.
```

---

### Testing de flujos críticos (`testing/marketplace-flows/`)

**Reglas TEST-01…04** — activa cuando el feature forma parte de un flujo end-to-end crítico.

```markdown
✅ TEST-01 — Flujos críticos cubiertos
build-and-test/integration-test-instructions.md documenta:

Flujo 1: Publicación → Visibilidad en búsqueda

- Estado inicial: vendedor autenticado, sin listados activos
- Pasos: POST /listings → esperar indexación → GET /search?make=Honda
- Resultado esperado: vehículo aparece en resultados en < 30s

Flujo 2: Oferta → Notificación al vendedor

- Estado inicial: comprador y vendedor con cuentas activas
- Pasos: POST /offers → verificar evento en cola → GET /notifications/{sellerId}
- Resultado esperado: notificación entregada en < 5s

✅ TEST-04 — Sin datos reales de producción
Fixtures usan VINs de prueba (1HGBH41JXMN109186 — VIN de ejemplo
del estándar ISO), emails @example.com, y teléfonos +52 55 0000 0000.
```

---

### Calidad de datos de vehículos (`data-quality/vehicle-data/`)

**Reglas VDATA-01…05** — activa cuando el feature crea o modifica datos de vehículos.

```typescript
// ✅ Lo que el agente exige en el código generado

// VDATA-01: Validación de VIN
function isValidVin(vin: string): boolean {
  if (vin.length !== 17) return false;
  if (/[IOQ]/i.test(vin)) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
}

// VDATA-03: Precio como entero en centavos, con sanity checks
const listingSchema = z.object({
  priceInCents: z.number().int().min(1_000_000).max(500_000_000), // MXN $10k–$5M
  currency: z.literal("MXN"),
});

// VDATA-02: Año en rango válido y configurable
const currentYear = new Date().getFullYear();
const yearSchema = z
  .number()
  .int()
  .min(1885)
  .max(currentYear + 2);
```

---

### Accesibilidad WCAG (`accessibility/wcag-baseline/`)

**Reglas A11Y-01…05** — activa cuando el feature incluye componentes de UI.

```tsx
// ✅ A11Y-01: Formulario de búsqueda accesible
<form role="search">
  <label htmlFor="search-input">Buscar vehículos</label>
  <input
    id="search-input"
    type="search"
    aria-label="Buscar por marca, modelo o año"
    aria-describedby="search-hint"
  />
  <span id="search-hint">Ejemplo: Honda Civic 2022</span>
</form>

// ❌ A11Y-01: Input sin label — hallazgo bloqueante
<input type="text" placeholder="Buscar vehículos..." />

// ✅ A11Y-05: Modal con gestión de foco correcta
function VehicleDetailModal({ onClose }) {
  const firstFocusRef = useRef(null)
  useEffect(() => { firstFocusRef.current?.focus() }, [])
  return (
    <dialog aria-modal="true" aria-label="Detalle del vehículo">
      <button ref={firstFocusRef} onClick={onClose}>Cerrar</button>
      {/* contenido */}
    </dialog>
  )
}
```

---

## Recursos

| Recurso                  | Link                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Repo upstream (AWS)      | [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows)                                                                |
| Blog de lanzamiento      | [AWS DevOps Blog](https://aws.amazon.com/blogs/devops/open-sourcing-adaptive-workflows-for-ai-driven-development-life-cycle-ai-dlc/) |
| Walkthrough con Amazon Q | [AWS DevOps Blog](https://aws.amazon.com/blogs/devops/building-with-ai-dlc-using-amazon-q-developer/)                                |
| Method Definition Paper  | [Paper](https://prod.d13rzhkk8cj2z0.amplifyapp.com/)                                                                                 |

---

## Licencia

MIT-0 — ver [LICENSE](LICENSE).
