# CodeViz Research Context

> **Note**: This file contains research context from CodeViz. Most recent contexts are at the bottom.

---

## Research Query

Give me a diagram of the project

*Session: e2ee2b7ec42e29d3ff207450e2272fd2 | Generated: 08/07/2025, 12:30:56*

### Analysis Summary

# Project Architecture Diagram

This document outlines the high-level architecture of the microservices project, detailing its main components, their responsibilities, and their interactions. The project is structured around a NestJS framework, utilizing a modular approach to separate concerns.

## High-Level Architecture

The application is composed of several distinct modules, primarily **Auth** and **Analytics**, which interact with external services like databases and message brokers. A **Shared** module provides common functionalities and infrastructure.

- **Auth Module**: Handles user authentication and authorization concerns.
- **Analytics Module**: Manages user activity tracking and reporting.
- **Shared Module**: Provides common utilities, infrastructure, and foundational patterns used across other modules.

The main application entry point is [main.ts](app/main.ts), which bootstraps the NestJS application using the [AppModule](app/app.module.ts).

## Core Modules

### Auth Module

The **Auth Module** ([auth.module.ts](src/auth/auth.module.ts)) is responsible for user management, including registration and login.

- **Purpose**: Manages user accounts, authentication, and authorization.
- **Internal Parts**:
    - **Application Layer**: Contains use cases for business logic, such as [LoginUser](src/auth/user/application/LoginUser/LoginUser.usecase.ts) and [RegisterUser](src/auth/user/application/RegisterUser/RegisterUser.usecase.ts).
    - **Domain Layer**: Defines core entities like [User](src/auth/user/domain/User.ts), repositories like [UserRepository](src/auth/user/domain/UserRepository.ts), and domain services such as [IAccessTokenManager](src/auth/user/domain/IAccessTokenManager.ts) and [IPasswordHasher](src/auth/user/domain/IPasswordHasher.ts). It also defines domain events like [UserRegistered.event.ts](src/auth/user/domain/events/UserRegistered.event.ts) and [UserLogged.event.ts](src/auth/user/domain/events/UserLogged.event.ts).
    - **Infrastructure Layer**: Provides concrete implementations for domain interfaces and handles external interactions.
        - **Controllers**: Exposes API endpoints for user operations, e.g., [LoginUser.controller.ts](src/auth/user/infrastructure/controllers/LoginUser/LoginUser.controller.ts) and [RegisterUser.controller.ts](src/auth/user/infrastructure/controllers/RegisterUser/RegisterUser.controller.ts).
        - **Databases**: Uses MikroORM for persistence, with [MikroOrmUserRepository](src/auth/user/infrastructure/databases/mikroOrm/MikroOrmUserRepository.ts) implementing the `UserRepository`.
        - **Hashers**: Implements password hashing using [BCryptPasswordHasher](src/auth/user/infrastructure/hashers/BCryptPasswordHasher.ts).
        - **AccessTokenManager**: Manages access tokens using [JWTAccessTokenManager](src/auth/user/infrastructure/accessTokenManager/JWTAccessTokenManager.ts).
- **External Relationships**: Interacts with a database (configured via [MikroOrmCommandsDDBB.base.config.ts](src/auth/user/infrastructure/databases/mikroOrm/MikroOrmCommandsDDBB.base.config.ts)) for user data persistence.

### Analytics Module

The **Analytics Module** ([analytics.module.ts](src/analytics/analytics.module.ts)) focuses on tracking and reporting user activities.

- **Purpose**: Collects and processes user activity data, and generates reports.
- **Internal Parts**:
    - **Application Layer**: Contains use cases like [RecordUserRegistration.usecase.ts](src/analytics/user-activity/application/RecordUserRegistration/RecordUserRegistration.usecase.ts) for recording events and [GenerateTopHundredActiveUsersReport.usecase.ts](src/analytics/user-activity/application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReport.usecase.ts) for report generation.
    - **Infrastructure Layer**:
        - **Databases**: Uses MikroORM for reading user activity data, configured by [MikroOrmQueriesDDBB.base.config.ts](src/analytics/user-activity/infrastructure/databases/mikroOrm/MikroOrmQueriesDDBB.base.config.ts). [MikroOrmUserActivityReadLayer](src/analytics/user-activity/infrastructure/databases/mikroOrm/MikroOrmUserActivityReadLayer.ts) provides data access.
        - **Message Brokers**: Consumers for RabbitMQ are located in [rabbitMQ/consumers](src/analytics/user-activity/infrastructure/messageBrokers/rabbitMQ/consumers).
        - **Schedulers**: Contains scheduled tasks, such as [GenerateTopHundredActiveUsersReportScheduler.ts](src/analytics/user-activity/infrastructure/schedulers/GenerateTopHundredActiveUsersReportScheduler.ts).
- **External Relationships**: Consumes messages from a message broker (RabbitMQ) and interacts with a database for analytics data.

### Shared Module

The **Shared Module** ([shared.module.ts](src/shared/shared.module.ts)) provides common functionalities and infrastructure components used across the application.

- **Purpose**: Offers reusable components and foundational services to maintain consistency and reduce duplication.
- **Internal Parts**:
    - **Aggregate Root**: Defines the base class for aggregate roots in the domain-driven design, [BaseAggregateRoot.ts](src/shared/aggregateRoot/domain/BaseAggregateRoot.ts).
    - **Command Bus**: Provides an in-memory command bus ([TransactionalCommandBus.ts](src/shared/commandBus/TransactionalCommandBus.ts)) for handling commands, with persistence for processed commands via [MikroOrmCommandProcessedService.ts](src/shared/commandBus/infrastructure/mikroOrm/MikroOrmCommandProcessedService.ts).
    - **Date Time Service**: Offers a consistent way to handle date and time, with implementations like [SystemDateTimeService.ts](src/shared/dateTimeService/infrastructure/SystemDateTimeService.ts).
    - **Events**: Manages domain events and their processing. Includes an [EventBus](src/shared/events/eventBus/infrastructure/IEventBus.ts) and a message relay mechanism ([messageRely](src/shared/events/messageRely)). RabbitMQ integration for event publishing/consuming is found in [rabbitMQ](src/shared/events/eventBus/infrastructure/rabbitMQ).
    - **Logger**: Provides a logging utility, [WinstonLogger.ts](src/shared/logger/WinstonLogger.ts).
    - **Middlewares**: Contains common NestJS middlewares, such as [RequiredIdempotentKeyMiddleware.ts](src/shared/middlewares/RequiredIdempotentKeyMiddleware/RequiredIdempotentKeyMiddleware.ts).
    - **Query Bus**: Provides an in-memory query bus ([InMemoryQueryBus.ts](src/shared/queryBus/InMemoryQueryBus.ts)) for handling queries.
- **External Relationships**: Interacts with RabbitMQ for event bus functionality and a database for processed commands and events.

