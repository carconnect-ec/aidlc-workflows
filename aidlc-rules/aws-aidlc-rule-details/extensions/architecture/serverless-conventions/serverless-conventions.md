# AWS Serverless Architecture Conventions — CarConnect

## Overview

Estas reglas garantizan que los diseños de arquitectura serverless en CarConnect sigan las convenciones establecidas para AWS Lambda, Step Functions, EventBridge, S3 y SQS. Son **hard constraints** que aplican durante NFR & Architecture Design y Code Generation.

### Cuándo aplican estas reglas

**CRÍTICO**: Esta extensión NO decide el stack de una Unit. La decisión de usar serverless (Lambda, AWS SAM) o cualquier otro stack (ECS, EC2, etc.) ocurre orgánicamente durante NFR & Architecture Design, basándose en los requisitos de esa Unit específica.

**Regla de activación por Unit**:
- Si el diseño de NFR de esta Unit incluye Lambda o AWS SAM como cómputo → aplicar todas las reglas SRVLS como bloqueantes
- Si el diseño de NFR de esta Unit usa ECS, EC2 u otro compute → marcar **todas** las reglas SRVLS como **N/A** para esta Unit. No es un hallazgo bloqueante.

El modelo evalúa esto en el momento en que se propone la arquitectura — no antes.

### Comportamiento ante incumplimiento

Un **incumplimiento de convención serverless** significa:
1. El hallazgo DEBE listarse en el mensaje de completación bajo una sección "Hallazgos de Arquitectura Serverless" con el ID de regla SRVLS y su descripción
2. La fase NO DEBE presentar la opción "Continuar a la siguiente fase" hasta que se resuelvan todos los hallazgos bloqueantes
3. El modelo DEBE presentar solo la opción "Solicitar cambios" con una explicación clara de qué debe corregirse
4. El hallazgo DEBE registrarse en `aidlc-docs/audit.md` con el ID de regla SRVLS, descripción y contexto de la fase

Si una regla SRVLS no aplica al artefacto actual (ej. la Unit no tiene flujos multi-paso), marcarla como **N/A** — esto no es un hallazgo bloqueante.

### Enforcement por defecto

Todas las reglas de este documento son **bloqueantes** por defecto, condicionado a que la Unit use serverless como stack (ver "Cuándo aplican estas reglas" arriba).

### Stages donde aplican

- **NFR & Architecture Design**: una vez decidida la arquitectura de la Unit, verificar que el diseño respeta las convenciones
- **Code Generation**: verificar que el código generado no viola las convenciones

---

## Rule SRVLS-01: Step Functions para orquestación multi-paso

**Regla**: Todo flujo que requiera coordinar múltiples pasos, decisiones o esperas DEBE usar AWS Step Functions. Está prohibido implementar orquestación encadenando Lambdas directamente.

**Aplica en**: NFR & Architecture Design, Code Generation

**Verificación**:
- El diseño NO incluye una Lambda que invoca a otra Lambda para continuar un flujo
- Si hay un flujo con 2+ pasos secuenciales o condicionales, el diseño incluye una State Machine
- El código generado no contiene llamadas `lambda.invoke()` para encadenar flujos
- Cada Lambda en un flujo multi-paso recibe su input de Step Functions, no de otra Lambda

**Ejemplos que requieren Step Functions**:
- Flujo de verificación de lote: recibir → escanear → validar → notificar → enviar webhooks
- Dispatch de webhooks a N endpoints con retry
- Pipeline de procesamiento de documento: upload → parsear → validar → persistir

**Excepciones válidas** (documentar en ADR):
- Una Lambda que llama a otra como utilidad pura y síncrona dentro del mismo dominio (no como flujo)

---

## Rule SRVLS-02: Lambda para transformar, no para transportar

**Regla**: Cada Lambda DEBE tener una responsabilidad de transformación o procesamiento de datos. Una Lambda NO coordina flujos, no decide qué Lambda llamar a continuación, no actúa como router de flujo.

**Aplica en**: NFR & Architecture Design, Code Generation

**Verificación**:
- Cada Lambda tiene una responsabilidad única y claramente definida
- El diseño no incluye una Lambda cuyo propósito sea "orquestar" o "coordinar" otras Lambdas
- No hay Lambdas que actúen como "dispatcher" decidiendo qué función llamar según una condición de flujo
- Si una Lambda necesita "esperar" un resultado externo o "loopear", ese comportamiento pertenece a Step Functions

**Ejemplos correctos**:
- `parse-sinocastel-document`: recibe S3 key, parsea el archivo, retorna lista de seriales/IMEIs
- `send-webhook`: recibe payload + endpoint, hace el POST, retorna resultado
- `user-handler`: CRUD de usuarios sobre DynamoDB

**Ejemplos incorrectos**:
- `batch-completion-orchestrator`: llama a parse-document, luego a scan-validation, luego a send-webhooks
- `dispatch-coordinator`: itera endpoints y llama a send-webhook para cada uno

---

## Rule SRVLS-03: EventBridge para comunicación entre dominios

**Regla**: La comunicación entre dominios distintos DEBE usar EventBridge (eventos). Está prohibida la invocación directa entre Lambdas de dominios distintos.

**Aplica en**: NFR & Architecture Design, Code Generation

**Verificación**:
- El diseño identifica los eventos de dominio que cruzan bounded contexts (ej. `BatchVerified`, `BatchAvailable`)
- Los eventos están definidos con nombre, schema y dominio publicador
- Los consumidores de otros dominios se suscriben vía EventBridge rules, no son invocados directamente
- El código no contiene `lambda.invoke()` entre servicios de dominios distintos

**Ejemplos de eventos cross-domain**:
- `BatchVerified` → publicado por Scanning, consumido por Webhooks y Notifications independientemente
- `BatchAvailable` → publicado por Batch, consumido por Commercial Notifications

---

## Rule SRVLS-04: S3 Events para procesamiento de archivos

**Regla**: El procesamiento de archivos subidos DEBE dispararse vía S3 event notifications (S3 → Lambda o S3 → SQS → Lambda). Está prohibido el polling o procesamiento síncrono inline en el upload handler.

**Aplica en**: NFR & Architecture Design, Code Generation

**Verificación**:
- El diseño de upload de documentos separa el handler de upload del handler de procesamiento
- El procesamiento del archivo (parseo, extracción de datos) se realiza en una Lambda separada disparada por S3 event
- No hay una Lambda de upload que parsea el archivo sincrónicamente antes de responder al cliente
- El SAM template incluye el event source `S3` o una SQS queue entre S3 y la Lambda de procesamiento

**Ejemplo correcto**:
```
POST /batches/{id}/document → upload-handler Lambda → presigned URL o put directo a S3
S3 PutObject event → parse-document Lambda → persistir en DynamoDB
```

---

## Rule SRVLS-05: SQS para buffering y retry

**Regla**: Cuando un productor necesita enviar mensajes a un consumidor que puede fallar o verse sobrepasado, DEBE usarse SQS como buffer. El retry no se implementa dentro de la Lambda con loops o sleeps.

**Aplica en**: NFR & Architecture Design, Code Generation

**Verificación**:
- El diseño de webhooks incluye una SQS queue por endpoint o una queue compartida con mensaje-por-endpoint
- El retry de webhooks fallidos se implementa con SQS visibility timeout + DLQ, no con retry dentro de Lambda
- No hay código con `for` loops de retry + `sleep` dentro de una Lambda
- Si hay un DLQ configurado, el diseño documenta qué pasa con los mensajes en DLQ

---

## Rule SRVLS-06: Single-purpose Lambdas

**Regla**: Cada Lambda DEBE tener una sola responsabilidad. Está prohibido crear "god handlers" que internamente routeen por path o tipo de acción a lógica completamente distinta, salvo la excepción documentada.

**Aplica en**: NFR & Architecture Design, Code Generation

**Verificación**:
- El nombre de cada Lambda describe su responsabilidad única (`parse-document`, `send-webhook`, `user-handler`)
- No hay una Lambda llamada `general-handler`, `api-router` o similar que maneje múltiples dominios
- Si una Lambda maneja múltiples endpoints del mismo recurso CRUD (GET/POST/PUT/DELETE sobre una entidad), eso es aceptable y no viola esta regla

**Excepción válida documentada**:
- CRUD simple sobre una sola entidad en un solo dominio puede agruparse en un handler (ej. `user-handler` maneja GET/POST/PUT/DELETE de usuarios). Documentar en el diseño.
