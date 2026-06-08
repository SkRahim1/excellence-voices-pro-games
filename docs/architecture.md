# Technical Architecture Spec: Excellence Voices Pro

This document outlines the frontend structure, state management, and API integrations for the **Excellence Voices Pro** platform.

---

## 1. Application Layout & UI Theme Architecture

To satisfy the **Adaptable Dynamic UI** requirement, the frontend uses an age-based routing check to toggle visual themes.

```
                  ┌────────────────────────┐
                  │   Student Registers    │
                  └───────────┬────────────┘
                              │ Input Age
                              ▼
                  ┌────────────────────────┐
                  │ Set Global UI State    │
                  └───────────┬────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼ Age < 11                        ▼ Age >= 11
   ┌───────────────────┐             ┌───────────────────┐
   │ Kids Theme (Bright)│             │ Teen Theme (Dark) │
   │ CSS: .theme-kids  │             │ CSS: .theme-teen  │
   └───────────────────┘             └───────────────────┘
```

* **CSS Variable Injection:** Global variables define colors, button border-radii, and animations.
* **Themes:**
  * `.theme-kids`: High border-radius (rounded corners), bright primary colors (Honeydew, Sky Blue, Soft Gold), playful fonts (e.g., *Fredoka* or *Quicksand*), cartoon avatars.
  * `.theme-teen`: Low border-radius, glassmorphic translucent layers, dark-mode styling, neon accent colors, professional typography (e.g., *Inter* or *Outfit*).

---

## 2. Voice & Speech Processing Engine (Web Speech API)

To guarantee zero API charges, the platform relies on the browser's native **Speech Recognition** and **Speech Synthesis** interfaces.

### A. Speech Recognition (Speech-to-Text)
The system listens to students reading phrases aloud.
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-IN'; // Default to Indian English dialect
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  const confidence = event.results[0][0].confidence;
  evaluateSpeech(spokenText, confidence);
};
```

### B. Speech Evaluation Logic
Since local speech recognition doesn't provide word-by-word phoneme scoring, we implement a client-side **Levenshtein Distance** string comparison to measure spoken precision against target text:
* **Match Percentage:** $\text{Accuracy} = \left(1 - \frac{\text{Distance}}{\max(\text{SpokenLength}, \text{TargetLength})}\right) \times 100$
* **Feedback:**
  * Accuracy $> 85\%$: "Excellent pronunciation!" (Green highlight)
  * Accuracy $60\% - 85\%$: "Good, try to speak a bit clearer." (Orange highlight)
  * Accuracy $< 60\%$: "Let's try that word again!" (Red highlight)

### C. Text-To-Speech (AI Voice synthesis)
Used by the AI Tutor to talk to the student.
* **Engine:** `window.speechSynthesis`
* **Voice Selection:** Chooses high-quality English speaking voices (e.g., `Google US English`, `Microsoft Zira`).

---

## 3. Real-Time Audio Visualizer (Web Audio API)

To show the student their voice amplitude/volume level, we plug the microphone stream into an HTML5 Canvas visualizer.

1. **User Media Access:** Capture mic with `navigator.mediaDevices.getUserMedia({ audio: true })`.
2. **Audio Analyzer Node:** Connect the source to an `AnalyserNode`.
3. **Canvas Animation:** Render a real-time wave/frequency animation using `requestAnimationFrame`.
4. **Pacing Indicator:** Estimate words-per-minute (WPM) by dividing the word count of the transcribed text by the recording duration.

---

## 4. School License Code Validator Flow

A student registering via a school receives an activation code (e.g., `EV-SCH-XXXX`).
1. **Student Registration:** Student signs up and inputs the activation code.
2. **Firestore Transactions:**
   * Read the license code document in `/license_keys/{code}`.
   * Verify if `current_activations < max_activations` and code is active.
   * If valid, increment `current_activations` by 1.
   * Associate the student's profile `/users/{uid}` with the school's ID (`school_id`).
   * Grant access to the class curriculum.

---

## 5. Active Time Tracking & Heartbeat Loop

To enforce the daily **15 minutes for 5 days** requirement and prevent inactive tabs from cheating, the app runs an active focus listener.

### A. Focus & Heartbeat Script
* **Active Status:** Track user activity via browser events (`mousemove`, `keydown`, `click`, `scroll`, and speech API microphone activity).
* **Idle State:** If no activity is registered for 2 minutes, the timer pauses and a modal appears asking: *"Are you still practicing?"*
* **Interval Tracker:** Every 10 seconds of active focus, the client accumulates active time.
* **Sync Interval:** Active time is debounced and synchronized to Firestore `/users/{uid}/daily_activity/{today_date}` every 60 seconds (or on page unload) to minimize database writes.

### B. Visual Feedback Indicators
* **Dashboard Timer Ring:** A circular progress ring that fills up as the student approaches their 900-second (15-minute) goal.
* **Weekly Grid:** A horizontal grid representing Monday through Friday. When a day's 15-minute goal is met, that day's slot lights up. Completion of all 5 days triggers a streak reward.

---

## 6. Forced Weekly Progress Sharing via WhatsApp

To hold students accountable, the platform locks the dashboard at the end of each week (e.g., Friday afternoon or upon completing the 5-day cycle) until the student shares their progress report with their parent and teacher.

### A. Share Lockout Modal
* **Trigger:** If `weekly_share_status.unlocked_next_week == false` and the current week's goal has concluded.
* **UI Behavior:** An un-dismissible modal overlay covers the dashboard: *"Weekly Summary Ready! Share your progress via WhatsApp to unlock next week's speech activities."*
* **Double Actions:** The student must click two primary buttons:
  1. **Share with Parent (WhatsApp)**
  2. **Share with Teacher (WhatsApp)**

### B. API Integration & Deep Link Mechanics
* **Constructing the API Links:**
  * Parent link: `https://api.whatsapp.com/send?phone=${parentPhone}&text=${encodedMessage}`
  * Teacher link: `https://api.whatsapp.com/send?phone=${teacherPhone}&text=${encodedMessage}`
* **Message Template:**
  > *"Hi [Name], I have completed my weekly English communication practice on Excellence Voices Pro! I completed all my 15-minute daily sessions this week (Total: 75 mins). Check my progress report here: https://pro.excellencevoices.in/report/${uid} - Sent via Excellence Voices Pro."*

### C. Validation & Lockout Release
1. When the student clicks a sharing button, the browser opens the WhatsApp URL in a new tab.
2. The client records the click and listens for a brief window blur/focus cycle (user returning to the site).
3. Upon returning, the button status updates to "Sent ✓".
4. Once both shares are clicked and registered, the client fires a Firestore transaction setting `shared_with_parent = true`, `shared_with_teacher = true`, and `unlocked_next_week = true`. The modal fades out and unlocks next week's modules.
