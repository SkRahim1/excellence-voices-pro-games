# Wireframe Specs: Student Dashboard & Game Views

This document defines the interface designs for both the Kids and Teen dashboards, the gameplay interfaces, and the forced weekly WhatsApp lockout modal.

---

## 1. Gamified Dashboards (Age-Adaptive)

### Layout A: Primary School Theme (Kids: Age < 11)
* **Visual Style:** Soft sky-blue backgrounds, large rounded buttons, playful cartoon characters (e.g., "Voicey the Owl"), and path-based node progression.

```
┌────────────────────────────────────────────────────────────────────────┐
│  (👤 Avatar) Rahul   [🔥 4 Day Streak]    [⭐ 450 XP]   [🪙 80 Coins]   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Today's Goal:  ( 8 / 15 Mins )                                      │
│                  [██████████░░░░░] 53%                                 │
│                                                                        │
│   Adventure Map:                                                       │
│                                                                        │
│      [ Week 1 Node ] (✓ Completed)                                     │
│            │                                                           │
│            ▼                                                           │
│      [ Week 2 Node ] ◄── ( Current Location - Click to Play )          │
│            │                                                           │
│            ▼                                                           │
│      [ Week 3 Node ] (🔒 Locked - Complete Week 2 first)                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  Speech Game of the Day: [► Play Sound Matcher]                │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Layout B: Middle & High School Theme (Teens: Age >= 11)
* **Visual Style:** Cyberpunk dark mode, sleek neon borders, glassmorphic card overlays, grid-based layout, and comparative school leaderboard widget.

```
┌────────────────────────────────────────────────────────────────────────┐
│  👤 Karan [Teens]    ⚡ Streak: 12 days   ✨ XP: 3,450   🏆 Rank: #4    │
├────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐ ┌────────────────────────────────┐ │
│  │ Active Practice Tracker         │ │ School Leaderboard             │ │
│  │ Today: ( 12 / 15 mins )         │ │ 1. Sneha (10-A)   - 4,200 XP   │ │
│  │ [⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤░░░] 80%         │ │ 2. Amit (10-B)    - 3,900 XP   │ │
│  │                                 │ │ 3. Rohan (9-C)    - 3,650 XP   │ │
│  │ M   T   W   T   F               │ │ 4. Karan (10-A)   - 3,450 XP   │ │
│  │ [✓] [✓] [✓] [/] [ ]             │ │                                │ │
│  └─────────────────────────────────┘ └────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Weekly Speaking Challenge:                                       │  │
│  │ Unit 29: "Structure of a Presentation"                           │  │
│  │ [► Start Practice]   [🎮 Play Roleplay Arena]                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Forced Weekly WhatsApp Lockout Modal

This modal blocks access to any page when the week's lessons are complete, forcing B2C and B2B user accountability.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│          ┌──────────────────────────────────────────────────┐          │
│          │  🔒 WEEKLY PRACTICE COMPLETED!                   │          │
│          ├──────────────────────────────────────────────────┤          │
│          │  Great job! You spent 75 minutes speaking English│          │
│          │  this week.                                      │          │
│          │                                                  │          │
│          │  Share your progress to unlock next week's path:  │          │
│          │                                                  │          │
│          │    ┌────────────────────────────────────────┐    │          │
│          │    │  [📱 Share with Parent via WhatsApp]   │    │          │
│          │    └────────────────────────────────────────┘    │          │
│          │                                                  │          │
│          │    ┌────────────────────────────────────────┐    │          │
│          │    │  [📱 Share with Teacher via WhatsApp]  │    │          │
│          │    └────────────────────────────────────────┘    │          │
│          │                                                  │          │
│          │    [✓ Unlocked Next Week] (Disabled until shares)│          │
│          └──────────────────────────────────────────────────┘          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Play Screens (Adventure Path & Roleplay Arena)

### A. Adventure Path (Choice Story Mode)
```
┌────────────────────────────────────────────────────────────────────────┐
│  Chapter 4: The Mystery Box                                  [Quit X]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│              ( Illustration: Old map on a wooden table )               │
│                                                                        │
│  "You pick up the old map, but the ink has faded. What do you do?"     │
│                                                                        │
│  Options (Speak to select):                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ A: "I will shine my flashlight on the map."                       │  │
│  │ B: "I will look for a lamp in the dark room."                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│                       [🎙️ Tap & Speak Choice]                         │
└────────────────────────────────────────────────────────────────────────┘
```

### B. Roleplay Arena (Interactive Conversational UI)
```
┌────────────────────────────────────────────────────────────────────────┐
│  Scene: Ordering at a Cafe                                   [Exit X]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│    👤 AI Waiter: "Hello! What can I get for you today?"                │
│                                                                        │
│    ✏️ Target Prompt: Ask the waiter for a cup of hot chocolate.        │
│                                                                        │
│    💬 Your Spoken Response:                                            │
│    "Could I have a cup of hot chocolate please?"                       │
│                                                                        │
│    Match Score: 94% Accuracy ✓ (Grammar Perfect)                       │
│                                                                        │
│                       [🎙️ HOLD SPACE TO SPEAK]                         │
└────────────────────────────────────────────────────────────────────────┘
```
