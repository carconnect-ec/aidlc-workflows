# AWS Serverless Conventions — Opt-In

**Extensión**: AWS Serverless Architecture Conventions (CarConnect)

## Opt-In Prompt

La siguiente pregunta se incluye automáticamente en las preguntas de aclaración de Requirements Analysis cuando esta extensión se carga:

```markdown
## Pregunta: Arquitectura AWS Serverless
¿Este Intent utiliza AWS serverless como stack de infraestructura (Lambda, API Gateway, DynamoDB, AWS SAM)?

A) Sí — aplicar todas las reglas SRVLS como constraints bloqueantes en NFR & Architecture Design y Code Generation
B) No — esta extensión no aplica a este Intent
X) Otro (describir después del tag [Answer]: abajo)

[Answer]:
```
