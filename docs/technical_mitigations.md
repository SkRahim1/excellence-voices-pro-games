# Technical Mitigations & Solutions Spec

This document details the exact technical implementation strategies to solve the primary user experience (UX) and architectural risks of the **Excellence Voices Pro** platform.

---

## 1. Solution for Web Speech API Browser Compatibility

The Web Speech API relies on browser-level service workers (Google's servers on Chrome, Apple's servers on Safari). This introduces inconsistent behavior in browsers like Firefox or on restricted school networks.

### A. Browser Capability Check & User Warning
Upon mounting the dashboard or diagnostic tools, we run a check for the Web Speech API presence and microphone permissions.

```javascript
export function checkSpeechCapabilities() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    return {
      supported: false,
      reason: 'BROWSER_UNSUPPORTED',
      message: 'Your browser does not support Speech Recognition. Please switch to Google Chrome or Safari.'
    };
  }
  return { supported: true };
}
```

### B. Graceful UI Fallbacks (No-Mic Mode)
If a student's microphone is broken, unsupported, or blocked by school computer settings, the learning roadmap dynamically replaces speech cards with **alternative typing and listening exercises**:
1. **Interactive Listening Transcription:** The app reads a phrase using Text-to-Speech (TTS), and the student must type what they hear.
2. **Sentence Rearrangement (Syntax Drill):** The student drags and drops word blocks to form the target sentence instead of speaking it.
3. **Phoneme Selection:** Multiple choice questions asking the student to select the word that matches a particular phonetic sound.

---

## 2. Solution for Cheating the WhatsApp Share Lock

Because sandboxed web browsers cannot inspect native WhatsApp messages to confirm if a user hit "Send," students can bypass a simple intent redirect by clicking "Share" and immediately returning to the platform.

### A. Solution 1: Parent/Teacher Approval Link (Recommended)
Instead of relying solely on the redirect click, we integrate an asynchronous lock release mechanism:
1. When the student shares the report card, the link points to `https://pro.excellencevoices.in/approve/${shareId}`.
2. In the shared WhatsApp message, we add: *"Please tap this link to view my progress and unlock next week's speech dashboard: [Link]"*.
3. When the parent/teacher opens the link, a Firestore listener updates `unlocked_next_week = true` for that student.
4. The student's dashboard updates in real-time (using Firestore `onSnapshot` listener) and unlocks instantly with a success animation.

### B. Solution 2: Validation of Tab Focus Return (Nudge Validation)
If parent verification is too friction-heavy for younger users, we implement window validation:
1. Track the timestamp when the user clicks the WhatsApp button.
2. Track the timestamp when the window receives `focus` again.
3. If the duration between the click and focus return is **less than 3 seconds**, the app warns the student: *"It looks like you returned too quickly! Please send the message to complete your weekly progress checklist."*

---

## 3. Solution for Children Accent & Dialect Grading

Adult speech recognition models often fail to transcribe kids' high-pitched voices and regional dialects (such as Indian English variations), generating discouraging false negatives.

### A. Dialect Tuning
We explicitly configure the recognition instance language code:
* Set `recognition.lang = 'en-IN'` to instruct the speech engine to evaluate against Indian English phonetic models (which accepts Indian pronunciations of words like "schedule," "data," or "record").

### B. Fuzzy String Matching (Levenshtein Distance)
Instead of matching character-for-character, we sanitize the strings and run a fuzzy evaluation:
1. **Sanitization:** Convert to lowercase, remove punctuation (commas, periods, question marks), and strip filler words (*"uh"*, *"um"*, *"ah"*, *"like"*).
2. **Levenshtein Distance Calculation:** Measure the edit distance between target and spoken sentences.
3. **Threshold Calibration:**
   * **Beginner Mode (Age < 9):** Match threshold of **50%** accuracy is graded as "Excellent".
   * **Intermediate Mode (Age 9-13):** Match threshold of **65%** required.
   * **Advanced Mode (Age > 13):** Match threshold of **80%** required.

---

## 4. Solution for Inactive Tab Time-Abuse

Students might leave the dashboard open in a background tab to artificially accumulate their mandatory 15-minute daily practice goal.

### A. Page Visibility API
The tracker stops counting the instant the page goes into the background.
```javascript
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseDailyTimer();
  } else {
    resumeDailyTimer();
  }
});
```

### B. Event-Based Active Heartbeat
The tracking script monitors user activity events within the page:
1. We listen for `mousemove`, `keydown`, `scroll`, `click`, and Web Audio API microphone input.
2. We keep a `lastActiveTime` variable.
3. A `setInterval` timer checks if `Date.now() - lastActiveTime > 120000` (2 minutes).
4. If true, the app stops accumulating seconds, darkens the screen, and pops up a modal: *"Are you still practicing? Click below to resume your session."*
