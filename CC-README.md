# CarConnect — Documentación interna del fork

Este archivo contiene toda la documentación específica de CarConnect sobre este fork de [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows).

> Para la documentación oficial de AI-DLC ver [README.md](./README.md).

---

## Tabla de contenidos

- [Sobre este fork](#sobre-este-fork)
- [Ciclo de vida de aidlc-docs/](#ciclo-de-vida-de-aidlc-docs)
- [Convenciones de git](#convenciones-de-git)
- [Sincronización con upstream](#sincronización-con-upstream)

---

## Sobre este fork

Fork interno de [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows) con extensiones y tooling propios de CarConnect.

El `README.md` de este repo se mantiene lo más cercano posible al upstream para facilitar los merges. Toda documentación específica de CarConnect vive en este archivo.

---

## Ciclo de vida de aidlc-docs/

**`aidlc-docs/` se commitea.** Es documentación del proyecto: los requirements acordados, las user stories aprobadas, el diseño de componentes y el audit de decisiones tienen valor permanente para el equipo.

### Qué commitear y cuándo

Commitea `aidlc-docs/` al **cerrar la feature**, junto con el código generado:

```bash
git add aidlc-docs/ src/ tests/
git commit -m "feat(nombre-feature): implementación completa con docs aidlc"
```

### Qué NO commitear

- Archivos de sesión temporales o borradores intermedios dentro de `aidlc-docs/`
- Outputs de ejecuciones de prueba que no pertenezcan a ninguna feature

---

## Convenciones de git (`company-standards/git-conventions/`)

**Reglas GIT-01, GIT-02, GIT-03**

Todo commit y branch propuesto por el agente sigue Conventional Commits y kebab-case.

### Formato de commits (GIT-01)

```
<tipo>(<scope>): <descripción en imperativo>
```

Tipos válidos: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`

### Nombres de branches (GIT-02)

```
<tipo>/<descripcion-en-kebab-case>
```

Ejemplos: `feat/nuevo-flujo-pago`, `fix/error-login-oauth`

### PRs (GIT-03)

- Título sigue el mismo formato que Conventional Commits
- Descripción incluye: contexto, cambios clave, plan de pruebas

---

## Sincronización con upstream

Para hacer merge del upstream sin conflictos:

```bash
git fetch upstream
git merge upstream/main
```

El `README.md` está estructurado para generar conflictos mínimos. Si hay conflicto en el bloque del header (primeras líneas), resolver manteniendo nuestro header de CarConnect y el contenido del upstream.

Nunca agregar documentación de CarConnect directamente en `README.md` — usar este archivo.
