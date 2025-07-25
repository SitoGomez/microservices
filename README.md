# ✅ Completed

- [x] Implement datepicker
- [x] Create a command bus
- [x] Change event name to accomplish something useful
- [x] Dockerize Nest app
- [x] Add logger (WINSTON)
  - [x] Research how to handle rotative logs
- [x] Restructure project to modular monolith
- [x] Add mapper from domain to infrastructure
- [x] Sync Postman with project file
- [x] Add basic env service
- [x] Remove unnecessary Grafana container
- [x] Remove user data from user in auth module
- [x] Implement user factory with domain event manager
- [x] Add password hashing service
- [x] Implement Given...When...Then in tests
- [x] Extract MikroOrm config for CLI reuse
- [x] Add DB seeder for test data
- [x] Configure Jest with NODE_ENV and .env.test
- [x] Add some e2e tests
- [x] Add job to get last 100 registered users at intervals

---

# TODO 📝
## 🛠️ Core Infrastructure & Architecture

- [ ] AVOID RETURNING ACCESS_TOKEN in command ⚠️
- [ ] Move logs to a bucket or external file
- [ ] Add integration tests for repositories
  - [ ] Use Postgres TEST DB Docker container
- [ ] Add OpenTelemetry tracing for HTTP request flow
- [ ] Add cache for checking commands, events, and query responses
- [ ] Prevent loss of events/commands on app or RabbitMQ restart
- [ ] Implement multiservice coordination mechanism (e.g., SAGA)
- [ ] Normalize tables https://franiglesias.github.io/db-normalization/
- [ ] Free commands executed after 24hours to have those id's available

---

## 🔠 Typescript
- [x] Remove classes parameters with non erasable syntax

## 🧪 Testing & Validation
- [ ] Add K6 for performance testing
- [x] Add ESLint diff and pnpm test check before push

---

## 🧱 Domain & Application Layer

- [x] Add controller input/output validations
- [ ] Map internal errors to generic external error response

---

## 🚦 CQRS Enhancements

- [ ] Enhance command bus
  - [ ] Implement tracing
  - [x] Save commands to DB
- [ ] Create query bus
  - [ ] Implement tracing
  - [] Save queries to DB

---

## 🔒 Security

- [ ] Implement CORS
- [ ] Ensure OWASP Top 10 compliance

---

## 🔄 Idempotency & Consistency
- [ ] Idempotent Command/Event Execution
- [ ] Retry Logic for Failed Events
  - [ ] Store failed events
  - [ ] Retry them with exponential backoff
  - [ ] Mark as dead-letter if max retries are exceeded
- [ ] Dead Letter Queue (DLQ) Handling
- [ ] Conflict Resolution Strategy
- [ ] Transactional Outbox Pattern
- [ ] Eventual Consistency with Projections

## 🎛️ Concurrency & Locking
- [ ] Optimistic Concurrency Control (OCC) to prevent race conditions
- [ ] Pessimistic Locking
- [ ] Distributed Locking

## 🔁 Process Coordination & Bulk Operations
- [ ] Saga / Process Manager (basic & advanced)
- [ ] Bulk Updates with Consistency