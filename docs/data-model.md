# Data Model

## Overview

The system uses a relational database hosted on Azure SQL.
The core entities represent users, questions, answers, and supporting features such as bookmarks and reports.

---

## Entity Relationship Diagram

```mermaid
erDiagram

  USER ||--o{ QUESTION : creates
  USER ||--o{ ANSWER : writes
  QUESTION ||--o{ ANSWER : contains

  USER ||--o{ BOOKMARK : saves
  QUESTION ||--o{ BOOKMARK : bookmarked

  USER ||--o{ NOTIFICATION : receives

  USER ||--o{ PASSWORD_RESET_TOKEN : requests
  USER ||--o{ LOGIN_OTP_TOKEN : logs_in_with

  CATEGORY ||--o{ QUESTION : groups
  CATEGORY ||--o{ TAG : owns

  QUESTION ||--o{ QUESTION_TAG : has
  TAG ||--o{ QUESTION_TAG : has

  USER ||--o{ QUESTION_VIEW : generates
  QUESTION ||--o{ QUESTION_VIEW : tracked_by

  USER ||--o{ REPORT : reports
  QUESTION ||--o{ REPORT : can_be_reported
  ANSWER ||--o{ REPORT : can_be_reported

  USER {
    int Id
    string Name
    string Username
    string Email
    byte[] PasswordHash
    byte[] PasswordSalt
    string Bio
    int Role
    datetime CreatedAtUtc
  }

  CATEGORY {
    int Id
    string Name
    datetime CreatedAt
    bool IsActive
  }

  TAG {
    int Id
    string Name
    int CategoryId
  }

  QUESTION {
    int Id
    string Title
    string Description
    int Votes
    int Views
    datetime CreatedAt
    int CategoryId
    int UserId
  }

  ANSWER {
    int Id
    string Content
    int Votes
    datetime CreatedAtUtc
    int QuestionId
    int UserId
  }

  QUESTION_TAG {
    int QuestionId
    int TagId
  }

  BOOKMARK {
    int Id
    int UserId
    int QuestionId
    datetime CreatedAt
  }

  NOTIFICATION {
    int Id
    int UserId
    string Message
    string Type
    bool IsRead
    datetime CreatedAt
  }

  PASSWORD_RESET_TOKEN {
    int Id
    int UserId
    string TokenHash
    datetime ExpiresAtUtc
    datetime UsedAtUtc
    datetime CreatedAtUtc
  }

  LOGIN_OTP_TOKEN {
    int Id
    int UserId
    byte[] CodeHash
    byte[] Salt
    datetime ExpiresAtUtc
    bool IsUsed
    datetime UsedAtUtc
    bool IsInvalidated
    datetime InvalidatedAtUtc
    datetime CreatedAtUtc
    datetime LastSentAtUtc
    int ResendCount
  }

  QUESTION_VIEW {
    int Id
    int QuestionId
    int UserId
    string IpAddress
    datetime ViewedAt
  }

  REPORT {
    int Id
    int ReporterId
    string TargetType
    int TargetId
    string Reason
    string Status
    datetime CreatedAt
  }
  ```