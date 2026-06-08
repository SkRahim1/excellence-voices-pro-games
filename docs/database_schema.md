# Database Schema Specification: Excellence Voices Pro

This document defines the Firestore collection structures and field mappings for the Excellence Voices Pro database.

---

## 1. `/users` (Collection)
Stores profile information for all registration types (Students, Teachers, Admins).

```json
{
  "uid": "string (Firebase Auth UID)",
  "name": "string",
  "email": "string",
  "role": "string ('student' | 'teacher' | 'admin')",
  "age": "number",
  "theme_preference": "string ('kids' | 'teen')",
  "school_id": "string (optional, references /schools/{id})",
  "parent_phone": "string (WhatsApp formatted)",
  "teacher_phone": "string (WhatsApp formatted, optional)",
  "weekly_share_status": {
    "week_start_date": "string (YYYY-MM-DD)",
    "shared_with_parent": "boolean (default: false)",
    "shared_with_teacher": "boolean (default: false)",
    "unlocked_next_week": "boolean (default: false)"
  },
  "stats": {
    "xp": "number (default: 0)",
    "coins": "number (default: 0)",
    "streak_days": "number (default: 0)",
    "last_active_date": "string (YYYY-MM-DD)"
  },
  "created_at": "timestamp"
}
```

---

## 2. `/schools` (Collection)
Stores details of contracted school clients.

```json
{
  "school_id": "string (auto-generated ID)",
  "school_name": "string",
  "address": "string",
  "admin_contact": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "created_at": "timestamp",
  "status": "string ('active' | 'suspended')"
}
```

---

## 3. `/license_keys` (Collection)
Manages the validation logic for bulk B2B purchases.

```json
{
  "code": "string (e.g., 'EV-DPS-2026')",
  "school_id": "string (references /schools/{id})",
  "max_activations": "number",
  "current_activations": "number (starts at 0)",
  "is_active": "boolean",
  "expiry_date": "timestamp",
  "created_at": "timestamp"
}
```

---

## 4. `/student_progress` (Collection)
Tracks learning journey milestones, completed nodes, and scores.

```json
{
  "progress_id": "string (userId_moduleId)",
  "user_id": "string (references /users/{id})",
  "module_id": "string (e.g., 'foundation_1')",
  "completed_nodes": "array of strings (node IDs)",
  "current_node_index": "number",
  "scores": {
    "vocabulary_quiz": "number",
    "speaking_assessment": "number"
  },
  "last_updated": "timestamp"
}
```

---

## 5. `/games_highscores` (Collection)
Aggregates performance scores to build the school and national leaderboard.

```json
{
  "highscore_id": "string (auto-generated)",
  "game_id": "string ('word_rush' | 'grammar_galaxy')",
  "user_id": "string (references /users/{id})",
  "student_name": "string",
  "school_id": "string (references /schools/{id}, optional)",
  "score": "number",
  "timestamp": "timestamp"
}
```

---

## 6. `/certificates` (Collection)
Holds metadata for verified course graduation documents.

```json
{
  "certificate_id": "string (UUID, used for public verification URL)",
  "user_id": "string (references /users/{id})",
  "student_name": "string",
  "course_name": "string ('Foundational Communication' | 'Conversational Mastery' | 'Advanced Public Speaking')",
  "issue_date": "timestamp",
  "grade_achieved": "string ('A+' | 'A' | 'B')",
  "verification_status": "string ('valid' | 'revoked')"
}
```

---

## 7. `/users/{uid}/daily_activity` (Subcollection)
Tracks the daily time-on-platform goal (15 minutes/day, 5 days/week) to calculate streaks and milestones.

```json
{
  "date": "string (YYYY-MM-DD, e.g., '2026-06-03')",
  "seconds_active": "number (accumulates active focus duration)",
  "goal_achieved": "boolean (true if seconds_active >= 900)"
}
```
