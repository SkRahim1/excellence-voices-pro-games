# Wireframe Specs: Landing Page & Voice Diagnostic Tool

This document outlines the UI layout, components, and user interaction design for the public-facing landing page at `pro.excellencevoices.in` and the integrated diagnostic speaking assessment.

---

## 1. Landing Page Wireframe (Desktop & Mobile)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo: EV Pro]       About Services Schools Testimonials  [Book Demo]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│        Build Fluency & Stage Confidence in Every Student               │
│        Providing school-based English communication training.         │
│                                                                        │
│                ┌──────────────────────────────────────┐                │
│                │  [► Try 2-Min Speech Diagnostic]    │                │
│                └──────────────────────────────────────┘                │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Our 3-Step Program ]                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │ 1. Learn (Games) │  │ 2. Speak (AI)    │  │ 3. Certify (EV)  │      │
│  │ Interactive phonic│  │ Situational role-│  │ Get school-wide  │      │
│  │ vocabulary path  │  │ plays in class   │  │ certification    │      │
│  │                  │  │                  │  │                  │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Pitch Your School / Book a Free Demo ]                              │
│  ┌────────────────────────────────────────────────────────┐            │
│  │ Name:   [_____________________]   School:  [___________]            │
│  │ Phone:  [_____________________]   Email:   [___________]            │
│  │                         [ Submit ]                              │
│  └────────────────────────────────────────────────────────┘            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Interactive Diagnostic Tool Modal (The Core Engagement)

When the user clicks the **Try 2-Min Speech Diagnostic** button, a dynamic pop-up overlay modal triggers.

```
┌────────────────────────────────────────────────────────────────────────┐
│  English Fluency Diagnostic Assessment                     [ Close X ] │
├────────────────────────────────────────────────────────────────────────┤
│  Step 2 of 3: Read the following sentence out loud:                    │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  "The quick brown fox jumps over the lazy dog."                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│                           ┌──────────────┐                             │
│                           │   ( Microphone icon )   │                  │
│                           │   [ TAP TO SPEAK ]   │                     │
│                           └──────────────┘                             │
│                                                                        │
│                  🔊 Voice Level: ░░░░▒▒▒▒▓▓▓▓ (Live Visualizer)        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  [<< Back]                                                  [Next >>]  │
└────────────────────────────────────────────────────────────────────────┘
```

### User Interaction States:
1. **Idle State:** Microphone button is neutral (Blue/Orange). Text reads: *"Tap to speak."*
2. **Recording State:** Microphone button glows red and pulses. A canvas-based wave visualizer animates active decibels. Text reads: *"Listening... Speak now."*
3. **Processing State:** A loading indicator rotates: *"AI evaluating your speech..."*
4. **Completion State:** Instantly displays the Report Card screen (see below).

---

## 3. Immediate Diagnostic Report Card

After completing 3 quick prompts (1 Word Sound, 1 Sentence, 1 Contextual Question), the student receives their report:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Your English Fluency Scorecard                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│    Fluency Score:   [ 72% / B+ ]     Pronunciation:   [ Good ]         │
│    Speech Pace:     [ 124 WPM ]      Confidence Index:[ High ]         │
│                                                                        │
│  Detailed Analysis:                                                    │
│  • Pronunciation Match: 82% (Excellent vowel vowels, minor sibilant drop)│
│  • Tempo: Ideal conversational speed.                                  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Unlock your complete personalized 36-week learning roadmap.      │  │
│  │  Get access to 3D roleplays and earn certifications!             │  │
│  │                                                                  │  │
│  │  [ Unlock Pro Access - ₹249 ]      [ School invite code? Sign Up ]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```
