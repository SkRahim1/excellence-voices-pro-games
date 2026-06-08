# Product Analysis & Feasibility Report: Excellence Voices Pro

This document provides a comprehensive operational overview, pricing strategy, risk assessment, and financial cost estimation for **Excellence Voices Pro** (`pro.excellencevoices.in`).

---

## 1. Operational Flow (How it Works)

The system operates as a hybrid SaaS (Software as a Service) platform supporting school contracts (B2B) and individual parent purchases (B2C).

### A. The Setup & Onboarding Flow
* **B2B (Schools):** You contract with a school. They pay offline, and you generate an activation code (e.g., `EV-DPS-2026`) via your Admin Panel. The school distributes the code. Students register, enter the code, and are automatically grouped into their school class dashboard (e.g., *Delhi Public School, Grade 7-B*).
* **B2C (Parents):** A parent signs up their child, takes a free diagnostic test, sees a fluency scorecard, and pays online via Razorpay/UPI/Stripe to unlock the premium dashboard.

### B. The Daily Practice Loop (Enforcing 15 Mins / 5 Days)
1. **Focus Heartbeat:** When a student logs in, a JavaScript heartbeat script monitors active usage (keystrokes, mouse moves, microphone activity).
2. **Idle Safety:** If inactive for 2 minutes, a pop-up appears: *"Are you still practicing?"* The timer pauses until they click "Resume."
3. **Firestore Log:** Focus time is tracked in seconds. Every 60 seconds, the active duration is batched and synced to `/users/{uid}/daily_activity/{date}`.

### C. The Weekly Lockout & Sharing Loop
* On **Friday afternoon** (or upon finishing 5 active days), the app locks. A modal appears: *"Weekly goal completed! Share your report to unlock next week's modules."*
* The student clicks **Share with Parent** and **Share with Teacher**.
* The browser triggers a WhatsApp intent link (`https://api.whatsapp.com/send?phone=...&text=...`) which opens WhatsApp Web or the native WhatsApp mobile app with a formatted text containing their unique weekly progress page URL.
* Once the sharing buttons are clicked and the student returns to the tab, the screen unlocks.

---

## 2. Recommended Pricing Model

To capture the Indian market (using `.in` domain context), we recommend a dual B2B / B2C model.

### A. B2B School Licensing (Offline Invoiced Billing)
Schools pay per student on a yearly contract. This is your primary growth engine.
* **Price Range:** **₹150 to ₹250 per student per year** (Approx. ₹12 to ₹20 per month).
* **School Pitch:** *“For less than the price of a notebook, give every student a personal English speaking lab, and provide teachers with automated class reports.”*
* **Includes:** Student login, gamified curriculum, teacher analytics dashboard, and automated school-branded certificates.

### B. B2C Individual Subscriptions (Online UPI / Cards)
For parents registering directly outside of contracted schools.
* **Monthly Plan:** **₹249/month** (Allows flexible trial).
* **Annual Plan:** **₹1,499/year** (50% discount; secures immediate cash flow and commitment).
* **Payment Gateway:** Razorpay or Instamojo (best for instant UPI, GPay, and card processing in India).

---

## 3. Risk Assessment & Mitigation

| Identified Risk | Severity | Technical / Operational Mitigation |
| :--- | :--- | :--- |
| **1. Web Speech API Compatibility** <br> Native speech recognition works differently on Chrome, Safari, and Firefox. | **High** | * Mitigate by executing a browser-capability check at login.<br>* Notify users to use **Google Chrome** (PC/Android) or **Safari** (iOS) for the voice features.<br>* Implement a text-based fallback (e.g., keyboard typing or multiple-choice matching) if microphone access is blocked or unsupported. |
| **2. Cheating the WhatsApp Share Lock** <br> Browsers cannot verify if a message was actually *sent* inside WhatsApp. | **Medium** | * We track the *click intent* and tab focus switch. This acts as a strong "nudge" for 95% of school-age children.<br>* The generated share link is public. The teacher's dashboard checks if they received the link, and teachers can deduct class points if students cheat the share. |
| **3. Microphone Accent Inaccuracy** <br> Children's voices and regional dialects might trigger false-negative grading. | **Medium** | * We use **Fuzzy matching (Levenshtein distance)** rather than strict word-matching.<br>* The system ignores punctuation and case mismatches.<br>* Implement a "Trainer strictness setting" in settings (default to Low/Normal) so children do not get discouraged. |
| **4. Inactive Browser Tab Abuse** <br> Students leaving the dashboard tab open to rack up 15 minutes of "active" time. | **High** | * The focus listener pauses the timer immediately if the page is blurred (user changes tabs or goes to another application).<br>* Focus listener checks for active UI events (scrolling, clicking, speaking) every 10 seconds. |

---

## 4. Cost Estimation (How much will it cost to run?)

By leveraging serverless hosting, local speech engines, and free-tier databases, your operational costs for the **Minimum Viable Product (MVP)** are virtually **₹0**.

```
                           MVP HOSTING COST PROFILE
                      ┌─────────────────────────────────┐
                      │ Frontend (Vite on Vercel): ₹0   │
                      ├─────────────────────────────────┤
                      │ Speech Engine (Web Speech): ₹0   │
                      ├─────────────────────────────────┤
                      │ Database & Auth (Firebase): ₹0  │
                      ├─────────────────────────────────┤
                      │ Domain Name: ₹0 (Already Owned) │
                      └─────────────────────────────────┘
                      Total Monthly Infrastructure Cost: ₹0
```

### A. Hosting & Infrastructure Breakdown (Up to 10,000 active students)

| Service | Provider | Pricing Tier | Estimated Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Frontend Web Hosting** | Vercel or Netlify | Free Hobby Tier | **₹0 / month** (Up to 100GB bandwidth) |
| **Database & User Auth** | Firebase (Google) | Spark (Free Tier) <br> *Scale up via Blaze Pay-as-you-go* | **₹0 / month** <br> * Blaze pricing: ₹4.80 ($0.06) per 100k Firestore writes; ₹1.44 ($0.018) per 100k reads. For 1,000 active students, database bills will be under **₹100/month**. |
| **Speech recognition** | Browser Client-Side | Local Web Speech Engine | **₹0 / month** (Runs locally on student's device; no API bills) |
| **SMS / Transactional Alerts** | Fast2SMS / Twilio | Pay-per-SMS | **₹0.20 per SMS** (Use only for critical alerts; route weekly cards via WhatsApp for free). |
| **Payment Gateway** | Razorpay | Pay-per-Transaction | **2% per transaction** (No setup or fixed monthly costs) |

### B. Summary
* **Running Cost for MVP:** **₹0 / month**.
* **Scaled Running Cost (5,000 users):** **~₹500 to ₹1,000 / month** (mostly Firestore write/read queries and Razorpay processing fees). 
* **Profit Margin:** **95%+**.
