# 📌 TakeItDoIt — Real-Time Low-Data Task Communication System & PWA

[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-blueviolet?style=for-the-badge&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla%20JS%20(ESM)-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An offline-first, low-bandwidth assignment communication platform designed to bridge the gap between academic instructors and students. **TakeItDoIt** replaces noisy, unstructured group chats with an immutable, card-based broadcast grid. By leveraging Progressive Web App (PWA) architecture and local data caching, TakeItDoIt ensures students can reliably access task guidelines, due dates, and resource links—regardless of cellular signal strength or data promo availability.

---

## 📋 Table of Contents
- [The Problem We're Solving](#-the-problem-were-solving)
- [Key Features \& Stakeholder Value](#-key-features--stakeholder-value)
- [Tech Stack \& Architecture](#-tech-stack--architecture)
- [Development Log \& System Updates](#-development-log--system-updates)
- [Getting Started](#-getting-started)
- [System Roadmap](#-system-roadmap)
- [License](#-license)

---

## 🎯 The Problem We're Solving

1. **Chat Noise & Buried Announcements**  
   In platforms like Messenger, Telegram, and Discord, vital assignment details, deadlines, and project guidelines quickly get buried beneath hundreds of student messages and casual chatter. Instructors are forced to repeatedly answer the same logistical queries.

2. **Connectivity Bottlenecks & High Data Demands**  
   Traditional Learning Management Systems (LMS) like Canvas, Google Classroom, and Moodle are heavily dependent on persistent, high-speed internet connections. Students relying on limited mobile data promos or experiencing local signal dropouts face loading errors when checking urgent deadlines.

3. **Student Task Paralysis & Cognitive Overload**  
   When assignment details are posted as long, unstructured walls of text across multiple chat groups, students experience executive dysfunction. Without an isolated way to track personal progress, managing multiple deadlines becomes overwhelming.

---

## 💡 Key Features & Stakeholder Value

| Stakeholder | Core Pain Point Solved | System Value |
| :--- | :--- | :--- |
| **Academic Instructors** | Repetitive Q&As and buried assignment announcements in group chats. | **Single-Point Broadcast:** Publish once; guaranteed that students have a clutter-free, permanent reference point. |
| **Students** | Spotty internet signals, high data promo costs, and fear of missing deadlines. | **Low-Data & Offline Resilience:** Task requirements are cached locally upon initial sync, remaining fully accessible offline. |
| **Academic Performance** | Task paralysis caused by unstructured assignment dumps. | **Micro-Task Actionability:** Clean, card-based layouts with isolated, device-stored completion checkboxes. |

---

## 🛠 Tech Stack & Architecture

- **Frontend:** HTML5, Modern CSS, Vanilla ES Modules (Zero framework dependencies for ultra-fast load times).
- **Database:** Firebase Firestore (Real-time NoSQL sync via `onSnapshot`).
- **Authentication:** Firebase Auth (In-memory single-session security for instructor dispatches).
- **Offline Storage:** IndexedDB (`enableIndexedDbPersistence`) & `localStorage` (Personal task checkboxes saved locally per device).
- **PWA Infrastructure:** Custom Service Worker (`sw.js`) for static asset caching and background push alerts.


## 📑 Complete Development & System Update Log
**Update 1: Core Engine Optimization & Runtime Stability**
**Issue**: Uncaught JavaScript scope errors halting app execution on low-end mobile web browsers.
**Implementations**:
- Cleaned scope variables to prevent duplicate runtime declarations.
- Applied strict null-safe checks (document.getElementById) across all DOM hooks to eliminate null-pointer crashes.
- Enforced in-memory session persistence (inMemoryPersistence) to secure instructor publishing rights.

**Update 2.0: Real-Time Sync**
**Issue**: Several tasks were not syncing across devices.
**Implementation**: Implemented an active Firestore subscriber on the tasks collection to push real-time card updates to student dashboards without manual page reloads.

**Update 2.1: Device-Isolated Task Progress**
**Issue**: Upon implementing the active Firestore subscriber, all progress made by individual users synced globally across different users.
**Implementation:** Isolated global task data from student completion tracking by storing checkbox states in local device storage (localStorage). This ensures students can track personal progress without altering database states for peers.

**Update 3.0: Design Unclutter**
**Issue**: Small font task guidelines cause viewing and reading difficulties.
**Implementation**: Built an expansion modal system allowing students to view full task guidelines in a maximized style.

**Update 3.1: Expansion Modal UX Refinement**
**Issue**: The built-in expansion modal system causes cluttering over the main grid view.
**Implementation**: Added a blurred background filter to the full task view to ensure it does not cause visual cluttering over the main grid view.

**Update 4.0: Task Dispatcher Feature**
**Issue**: Length of time required when establishing or publishing a task.
**Implementation**: Built a dedicated Instructor Dashboard.

**Update 4.1.1: Authenticated Task Dispatcher**
**Issue**: Tasks could be created or published by non-instructors.
**Implementation**: Built a secured Instructor Dashboard using password input.

**Update 4.1.2: Improved Authenticated Task Dispatcher**
**Issue**: Plain passwords could be viewed through browsers' built-in Developer Options.
**Implementations**:
Upgraded the secured Instructor Dashboard using Firebase Authentication.
Added email/password credentials handling.

**Update 4.2.1: Transition Feature Fix**
**Issue**: Workflow execution errors within the Task Dispatcher where it failed to transition from login credentials to assignment creation.
**Implementation**: Fixed the workflow transition logic in the modal state engine.

**Update 4.3: Standardized Schemas & Visual Tiles**
**Issue**: Unorganized main grid view layout.
**Implementation**:
Added standardized assignment schemas (title, subject, dueDate, body, createdAt).
Added color-coded tiles for individual subjects to improve visual scanning.

**Update 4.4: Automatic Sign-Out Option**
**Issue:** Once authenticated, the system did not automatically close the admin session.
**Implementation**: Added an automated sign-out routine upon task dispatch to maintain account security on shared devices.

**Update 5: Offline Resilience**
**Issue**: The PWA was only accessible through active internet access.
**Implementation**:
Configured Firestore offline persistence (enableIndexedDbPersistence), enabling the app to store fetched assignment data directly into the browser's IndexedDB.
Deployed a custom Service Worker (sw.js) to cache structural assets (HTML, CSS, JS) for instant offline launches.
Added active network status listeners (online/offline window events) driving a real-time connection status banner (⚡ Syncing Live / 📡 Offline Mode).

**Update 6: Dynamic Theme Engine**
**Issue**: Eye strain caused by high-contrast default design during extended study sessions.
**Implementation**:
Developed a CSS variables system supporting high-contrast Dark and Light modes to reduce screen fatigue.
Integrated automatic OS preference detection (prefers-color-scheme) paired with local preference overrides.

**Update 7: Cross-Platform Push Notification Pipeline**
**Issue**: Mobile operating systems blocking background assignment alerts due to browser thread restrictions.
**Implementation**:
Replaced single-threaded browser calls with a Service Worker notification pipeline (registration.showNotification).
Integrated an initial-load flag (isInitialLoad) into onSnapshot.docChanges() to ignore past task history on startup while instantly triggering system pop-ups for new assignment dispatches.
Built a user-gesture permission prompt (Notification.requestPermission) adhering to modern browser security guidelines.

### System Data Flow

```text
                                [ Academic Instructor ]
                                           │
                             (Publishes New Assignment)
                                           │
                                           ▼
                                [ Firebase Firestore ]
                                           │
                        ┌──────────────────┴──────────────────┐
                        │ (Real-Time Low-Data Payload Sync)   │
                        ▼                                     ▼
             [ Student Device A ]                   [ Student Device B ]
            (Active Internet Connection)            (Weak/Offline Signal)
                        │                                     │
         ┌──────────────┴──────────────┐             ┌────────┴────────┐
         ▼                             ▼             ▼                 ▼
[ Local Browser Alert ]       [ IndexedDB Cache ]   [ Service Worker ] [ Read Cached ]
  (Push Notification)         (Instant Render)      (Offline Engine)   (Task Data)

