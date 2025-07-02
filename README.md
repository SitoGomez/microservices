# ✅ Completed

- [x] Implement datepicker
- [x] Create a command bus
- [x] Change event name to accomplish something useful
- [x] Dockerize Nest app
- [x] Add logger (WINSTON)
  - [x] Research how to handle rotative logs
- [x] Reestructure project to be a modular monolith
- [x] Add mapper from domain to infrastructure
- [x] Make Postman in sync with file in project
- [x] Add basic env service
- [x] Remove unnecessary Grafana container
- [x] Remove user data from user in auth module
- [x] Implement factory to create the user with the domain event manager
- [x] Add password hashing service
- [x] Implement Given...When...Then in tests
- [x] Extract MikroOrm config to be reused with CLI
- [x] Add database seeder to have proper test data
- [x] Configure jest config to use NODE_ENV variable as testing
  -> [x] Create .env for testing
- [x] Add some testing e2e
- [x] Add job process to get last 100 users registered in the platform at interval using a job
---

# 🛠️ Core Infrastructure & Architecture

- [ ] Move logs to a bucket or external file
- [ ] Add some integration tests over repositories
  -> [ ] Create a Postgres TEST DB Docker container to isolated data
- [ ] Add traces for tracking full flow HTTP request - OpenTelemetry
- [ ] Add cache for checking commands events and query responses
- [ ] Prevent events and commands for being discarded when restarting either application or rabbitMQ
- [ ] Check and develop an usecase to implement some multiservices coordination mechanism (Ex: SAGA pattern)

---

# 🧪 Testing & Validation

- [ ] Create nest js server for testing
- [ ] Add K6 to test performance
- [ ] Add ESLint diff and pnpm test before pushing and failing if KO

---

# 🧱 Domain & Application Layer

- [ ] Add controller input and output validations
- [ ] Map internal errors to generic external error response
- [ ] Implement Retry Logic for Failed Events
	- [ ]	Store failed events.
	- [ ]	Retry them with exponential backoff.
	- [ ] Mark as dead-letter if max retries are exceeded.

---

# 🚦 CQRS Enhancements

- [ ] Enhance command bus
  - [ ] With implementing traces
  - [x] Saving commands in a database

- [ ] Create a query bus
  - [ ] With implementing traces
  - [x] Saving queries in a database

---

# 🔒 Security

- [ ] Implement CORS
- [ ] OWASP Top 10 compliance

---

# 🧹 Cleanup & Optimization

- [ ] Add pessimistic and optimistic locking to avoid concurrency issues