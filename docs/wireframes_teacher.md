# Wireframe Specs: Teacher & School Admin Hub

This document defines the layout and administrative wireframes for the English Teacher Dashboard, class analytics, and homework review panel.

---

## 1. Class Overview & Analytics Dashboard

* **Visual Style:** Clear, professional, table-driven layout. White/neutral backgrounds, high-contrast text, clear actions.

```
┌────────────────────────────────────────────────────────────────────────┐
│  🏫 Delhi Public School  [Teacher Portal]               [Class: 7-A ▾]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Invite Code: EV-DPS-7A ]  ( Seats: 42 / 50 Active )                 │
│                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Active Students  │  │ Avg Weekly Time  │  │ Completed Goals  │      │
│  │     42 / 45      │  │    62 Mins/Stu   │  │   32 / 42 (76%)  │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                        │
│  Student Progress Roster:                                              │
│  ┌──────────────────┬───────────┬──────────────┬──────────┬──────────┐ │
│  │ Name             │ Wk Streak │ Wk Time (Min)│ Cur Unit │ Actions  │ │
│  ├──────────────────┼───────────┼──────────────┼──────────┼──────────┤ │
│  │ Aditya Sharma    │  5 days   │   78 mins    │  Unit 14 │ [Review] │ │
│  │ Priya Patel      │  4 days   │   60 mins    │  Unit 14 │ [Review] │ │
│  │ Kabir Singh      │  2 days   │   28 mins    │  Unit 12 │ [Review] │ │
│  └──────────────────┴───────────┴──────────────┴──────────┴──────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Homework Assigner Module

This panel allows the teacher to assign speech tasks to the class, overriding the default path.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Create New Weekly Speaking Assignment                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Select Target Unit: [ Level 2 - Unit 20: Giving Directions   ▾ ]      │
│                                                                        │
│  Assignment Title:                                                     │
│  [ Guide a tourist from metro station to school door _______________ ] │
│                                                                        │
│  Evaluation Mode:                                                      │
│  (🔘) AI Automatic Grade (Fuzzy Match 65%)                              │
│  ( ) Teacher Manual Voice Grading (Requires audio submission review)   │
│                                                                        │
│  Target Due Date: [ 2026-06-10 ]                                       │
│                                                                        │
│                      ┌────────────────────────┐                        │
│                      │  [ Send Assignment ]   │                        │
│                      └────────────────────────┘                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Student Audio Review & Grading Panel

When a teacher clicks `[Review]` on a student, they can listen to their vocal submissions and override AI grading assessments.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Review Voice Logs: Aditya Sharma (Grade 7-A)                [Close X] │
├────────────────────────────────────────────────────────────────────────┤
│  Task: Unit 20 Direction Roleplay (AI Waiter Dialogue)                 │
│                                                                        │
│  Submitted Recording:                                                  │
│  [ ► Play Audio (0:14) ] ░░░░░░░░░░░░░░░░░░░░░                         │
│                                                                        │
│  Target Script:                                                        │
│  "Excuse me, could you tell me where the nearest metro station is?"    │
│                                                                        │
│  AI Transcribed:                                                       │
│  "Excuse me, could you tell me where the nearest [met-ro] station is?" │
│  * AI Score: 92% Match (Pronunciation check passed)                    │
│                                                                        │
│  Teacher Manual Grading:                                               │
│  Status: [ Approved ▾ ]   Adjust Score: [ 95% ] (Overriding 92% AI)    │
│                                                                        │
│  Teacher Feedback Comment:                                             │
│  [ Great pronunciation Aditya! Your pacing was very natural. ________ ]│
│                                                                        │
│                      ┌────────────────────────┐                        │
│                      │   [ Save Evaluation ]  │                        │
│                      └────────────────────────┘                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```
