# User Journeys & UX Workflows: Excellence Voices Pro

This document maps out the detailed walkthroughs and interaction flows for students, teachers, and school admins.

---

## Journey 1: The Direct Student (Individual Purchase)

```
[Visit Landing Page] ──► [Take Diagnostic Test] ──► [See Fluency Report Card]
                                                            │
[Unlock Premium Roadmap] ◄── [Complete Online Payment] ◄────┘
           │
           ▼
[Select UI Theme (Kids/Teen)] ──► [Play Games & Learn] ──► [Download Certificate]
```

### Steps:
1. **Landing:** Student visits `pro.excellencevoices.in` and is greeted with a sleek, interactive hero section.
2. **Interactive Diagnostic:** Plays a 2-minute speaking diagnostic game (repeating phrases, vocabulary flashcards).
3. **Fluency Report:** Learns their fluency baseline (e.g., "Confidence: 8/10, Pronunciation: 70%").
4. **Subscription Portal:** Prompted to purchase full access using an online payment widget (Stripe/Razorpay checkout overlay).
5. **Theme Selection:** Upon payment, the student inputs their age. If age is $< 11$, a vibrant cartoon dashboard unlocks; if $\ge 11$, a modern glassmorphic dark-mode dashboard is active.
6. **Core Loop & Weekly Sharing Lock:** Student plays games, studies modules, and interacts with the AI tutor. At the end of the week, the dashboard locks. The student must share their progress report link via WhatsApp to their parents and class teacher to unlock next week's adventure nodes.
7. **Graduation:** Earns the "Graduation Certificate" upon finishing the assessments.

---

## Journey 2: The School-Sponsored Student

```
[School Admin Buys Licenses] ──► [Distributes Invite Code] ──► [Student Registers]
                                                                        │
[View Class Leaderboard] ◄── [Complete School Homework] ◄── [Enter Code in App]
```

### Steps:
1. **Distribution:** School buys 500 licenses offline. Excellence Voices admin issues key `EV-SCHOOLNAME-2026`.
2. **Onboarding:** School gives the code to students during classes.
3. **Registration:** Student goes to `pro.excellencevoices.in/register` and inputs the school key.
4. **Validation:** System checks availability, reduces available seats by 1, and maps the student profile to the school ID.
5. **Classroom Sync:** Student is automatically grouped into their specific class level (e.g., "Standard 6-B").
6. **Task Execution:** Student completes speaking assignments assigned by their English teacher, climbing their class leaderboard.
7. **Weekly WhatsApp Nudges:** The platform locks access on Friday afternoons, prompting the student to share their weekly report cards to parent and teacher WhatsApp chats before they can continue.

---

## Journey 3: The Classroom English Teacher

```
[Login to Teacher Hub] ──► [Select Class & Review Progress] ──► [Review Voice Homework]
                                                                        │
[Print Class Certificates] ◄── [Assign Weekly Speaking Task] ◄──────────┘
```

### Steps:
1. **Login:** Teacher signs in via `pro.excellencevoices.in/teacher-login`.
2. **Dashboard Overview:** Views analytics overview of active students, average daily speaking minutes, and overall vocabulary scores.
3. **Homework Assignment:** Chooses "Roleplay Scenario: Asking for Directions" and clicks "Assign to Class 7-A".
4. **Assessment Review:** Teacher clicks on the homework folder, sees a list of submitted student recordings, plays student audio, views the AI-matched transcription accuracy, and leaves manual encouraging audio/text feedback.
5. **Certificates & Rewards:** Selects high-performing students who have finished the course and exports high-quality, print-ready PDF certificates for school assembly recognition.
