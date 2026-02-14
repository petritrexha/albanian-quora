# 📘 Albanian Quora

## 📌 Project Overview

**Albanian Quora** is a community-driven Q&A platform designed specifically for Albanian-speaking users.  
The platform allows users to ask questions, provide answers, search content, and discover trending discussions in an organized and searchable way.

This project is developed as part of the **LIFE Program – 2nd Period at Gjirafa**.

---

## 🎯 Problem Statement

Albanian-speaking users lack a dedicated platform to ask questions, share knowledge, and receive answers in their native language in a structured and searchable format.

---

## 👥 Target Users

- **Primary:** Albanian-speaking users seeking answers or sharing knowledge  
- **Secondary:** Power users actively answering questions  
- **Admin:** Moderators managing categories and homepage content  

---

## 💡 Value Proposition

A centralized Albanian Q&A platform where users can:

- Ask questions  
- Share knowledge  
- Discover trending topics  
- Search content easily  

---

## 🚀 MVP Scope

### ✅ Included (IN)

- View trending questions  
- View question details with answers  
- Search questions  
- Create / Edit / Delete questions  
- Create / Edit / Delete answers  
- View user’s own questions and answers  

### ❌ Excluded (OUT)

- Reputation system  
- Ads / Monetization  
- Advanced moderation tools  

---

## ⭐ Additional Features (Planned)

At least **3** of the following:

- JWT-based user authentication  
- Upvote / Downvote answers  
- Question categories and tags  
- Mark accepted answer  
- User profile page  
- Basic admin dashboard  

---

## 🏗️ Architecture

**Frontend:** React / NextJS (standalone app)  
**Backend:** ASP.NET Core 6 Web API  
**Database:** SQL Server with Entity Framework Core  
**Authentication:** JWT (planned)  
**Deployment:** Azure Kubernetes Service (AKS)  
**CI/CD:** Jenkins + Docker  

## 🌿 Git Branching Strategy

- `main` → Production-ready code (protected branch)  
- `develop` → Integration branch  
- `feature/*` → Feature-specific branches created from develop  

### Workflow

1. Create feature branch from `develop`  
2. Work on feature  
3. Open Pull Request → merge into `develop`  
4. When sprint is complete → merge `develop` into `main`  

🚫 No direct pushes to `main`.

## 📦 Definition of Done

A task is considered complete only if:

1. Code implemented and pushed  
2. Reviewed by at least one teammate  
3. Tests added or updated  
4. Deployed to development environment  
5. Acceptance criteria fulfilled  

