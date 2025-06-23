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

---

# 🛠️ Core Infrastructure & Architecture

- [ ] Extract MikroOrm config to be reused with CLI
- [ ] Add more databases
- [ ] Create a Postgres TEST DB Docker container
- [ ] Add traces for tracking full flow HTTP request - OpenTelemetry

---

# 🧪 Testing & Validation

- [ ] Create nest js server for testing
- [ ] Configure jest config to use NODE_ENV variable as testing
  -> Create .env for testing
- [ ] Add testing e2e
- [ ] Add integration tests over repositories
- [ ] Add database seeder to have proper test data
- [x] Implement Given...When...Then in tests
- [ ] Add K6 to test performance
- [ ] Add ESLint diff and pnpm test before pushing and failing if KO

---

# 🧱 Domain & Application Layer

- [x] Implement factory to create the user with the domain event manager
- [x] Add password hashing service
- [ ] Add controller input and output validations
- [ ] Map internal errors to generic external error response
- [ ] Add job process to get last 100 users registered in the platform at interval using a job

---

# 🚦 CQRS Enhancements

- [ ] Enhance command bus
  - [ ] Add metrics
  - [ ] Using an external system
  - [ ] With implementing traces
  - [ ] Saving commands in a database

- [ ] Create a query bus
  - [ ] Add metrics
  - [ ] Using an external system
  - [ ] With implementing traces
  - [ ] Saving queries in a database

---

# 🔒 Security

- [ ] Implement CORS
- [ ] OWASP Top 10 compliance

---

# 🧹 Cleanup & Optimization

- [ ] Add pessimistic and optimistic locking with Redis JSON