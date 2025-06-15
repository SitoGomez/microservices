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

---

# 🛠️ Core Infrastructure & Architecture

- [ ] Extract MikroOrm config to be reused with CLI
- [ ] Add basic env service
- [ ] Add more databases
- [ ] Create a Postgres TEST DB Docker container
- [ ] Replace Prometheus with OpenTelemetry
- [ ] Add traces for tracking full flow HTTP request - OpenTelemetry

---

# 🧪 Testing & Validation

- [ ] Improve testing E2E
- [ ] Add integration tests over repositories
- [ ] Add database seeder to have proper test data
- [ ] Implement Given...When...Then in tests
- [ ] Add K6 to test performance
- [ ] Add ESLint diff and pnpm test before pushing and failing if KO

---

# 🧱 Domain & Application Layer

- [ ] Implement factory to create the user with the domain event manager
- [ ] Add password hashing service
- [ ] Add controller input and output validations
- [ ] Map internal errors to generic external error response

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
- [x] Remove unnecessary Grafana container
- [ ] Remove user data from user in auth module