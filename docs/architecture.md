# System Architecture

## Overview

The Albanian Quora system follows a classic three-tier architecture:

- **Frontend (Presentation Layer)**
- **Backend API (Application Layer)**
- **Database (Data Layer)**

---

## Architecture Diagram

```mermaid
flowchart LR
  User[User Browser] -->|HTTPS| FE[Frontend React / Vite]
  FE -->|REST API JSON| BE[Backend API ASP.NET Core .NET 8]
  BE -->|Entity Framework Core| DB[(Azure SQL Database)]
```