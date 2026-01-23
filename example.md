# 📸 Photography Studio System – Master Plan & Requirements

## 1️⃣ System Overview
**Goal:** A high-performance studio management system to streamline workflow, reduce manual filtering via AI, and speed up album creation.

**Key Capabilities:**
- 📂 **Management:** Users, Clients, Shoots, Photos.
- 🎨 **Album Builder:** Drag & Drop, Animated, Web-based.
- 🤝 **Collaboration:** Real-time editing (Editors & Photographers).
- 🤖 **AI Automation:** Auto-culling (Blur/Eyes), Face Grouping.
- 📊 **Business:** Revenue tracking & Analytics.
- ☁️ **Cloud Native:** Handles 1-2 TB of data safely.

---

## 2️⃣ User Roles & Permissions

| Role | Permissions |
| :--- | :--- |
| **Owner** | Full system access (Users, Revenue, Analytics, Settings). |
| **Editor** | Manage Clients/Shoots, Create Albums, Use AI, Share Galleries. |
| **Photographer** | Upload RAWs, View assigned shoots, Collaborate on albums. |
| **Client** | View shared links, Select favorites, Comment/Approve pages. |

---

## 3️⃣ Functional Requirements (FR)

### ✅ 3.1 User & Authentication
- [ ] **FR-1:** Owner-only user registration.
- [ ] **FR-2:** Login via Email + Password (JWT).
- [ ] **FR-3:** Enforce RBAC (Owner, Editor, Photographer, Client).
- [ ] **FR-4:** Owner can deactivate/update users.
- [ ] **FR-5:** Profile management (Password reset, Avatar).

### ✅ 3.2 Client Management
- [ ] **FR-6:** CRUD operations for Clients.
- [ ] **FR-7:** Assign multiple Shoots to a Client.
- [ ] **FR-8:** Store private notes and contact details.

### ✅ 3.3 Shoot Management
- [ ] **FR-9:** Create Shoot (Date, Location, Client, Type).
- [ ] **FR-10:** Assign Photographer to Shoot.
- [ ] **FR-11:** Calendar View for scheduling.
- [ ] **FR-12:** Track Shoot Status (Scheduled, Editing, Completed, Delivered).

### ✅ 3.4 Photo Upload & Storage
- [ ] **FR-14:** Support RAW (`.CR2`, `.ARW`, etc.) and JPG uploads.
- [ ] **FR-15:** Direct-to-Cloud Upload (S3/B2 Presigned URLs).
- [ ] **FR-16:** Extract EXIF Metadata (Camera, Lens, Date).
- [ ] **FR-17:** Generate WebP Proxies (thumbnails) for fast viewing.
- [ ] **FR-18:** Link photos to Shoots in DB.

### ✅ 3.5 AI Auto-Culling & Analysis
- [ ] **FR-19:** Detect Blurry images (OpenCV).
- [ ] **FR-20:** Detect Closed Eyes.
- [ ] **FR-21:** Detect Duplicates.
- [ ] **FR-22:** Assign "Quality Score" (0–100).
- [ ] **FR-23:** Filter Gallery by Score/Blur/Eyes.
- [ ] **FR-24:** Asynchronous processing (Python Worker).

### ✅ 3.6 AI Face Grouping
- [ ] **FR-25:** Detect Faces in all uploads.
- [ ] **FR-26:** Generate Face Embeddings (Vectors).
- [ ] **FR-27:** Cluster faces into Person IDs (Bride, Groom, etc.).
- [ ] **FR-28:** Filter Gallery by "Person".

### ✅ 3.7 Photo Gallery & Selection
- [ ] **FR-29:** Masonry Grid Gallery (Lazy Loaded).
- [ ] **FR-30:** Drag photos to "Album Bin".
- [ ] **FR-31:** Favorites/Heart system.
- [ ] **FR-32:** Advanced Sorting (Date, Score, Person).

### ✅ 3.8 Album Builder (Core Feature)
- [ ] **FR-33:** Drag & Drop Frames/Grid System (React-Konva).
- [ ] **FR-34:** Text Overlays with Google Fonts.
- [ ] **FR-35:** Image Transforms (Crop, Rotate, Scale).
- [ ] **FR-36:** Multi-page management.
- [ ] **FR-37:** Global Undo/Redo.
- [ ] **FR-38:** Save Layout as JSON (Non-destructive).
- [ ] **FR-39:** Web Preview Mode.
- [ ] **FR-40:** High-Res PDF Export for Print.

### ✅ 3.9 Real-Time Collaboration
- [ ] **FR-41:** Multi-user editing (Google Docs style).
- [ ] **FR-42:** WebSocket broadcast for layout changes.
- [ ] **FR-43:** Live Cursor tracking (Optional).
- [ ] **FR-44:** Internal Comments on photos.
- [ ] **FR-45:** Live view of Client selections.

### ✅ 3.10 Client Sharing
- [ ] **FR-46:** Generate Secure, Expirable Links.
- [ ] **FR-47:** No-Login access for Clients.
- [ ] **FR-48:** Selection Mode (Select Favorites).
- [ ] **FR-49:** Page Approval Workflow.

### ✅ 3.11 Business Logic
- [ ] **FR-51:** Record Revenue & Expenses per Shoot.
- [ ] **FR-52:** Monthly Income Reports.
- [ ] **FR-54:** Analytics: Track Client engagement/views.

---

## 4️⃣ Non-Functional Requirements (NFR)

### 🔒 Security
- **NFR-1:** HTTPS for all connections.
- **NFR-2:** Secure + HttpOnly Cookies for Auth.
- **NFR-3:** Passwords hashed via Argon2.
- **NFR-4:** S3 Buckets Private by default (Signed URLs only).

### ⚡ Performance
- **NFR-7:** Handle 5,000+ photos per shoot without UI lag.
- **NFR-8:** AI Processing < 3s per photo (Parallelized).
- **NFR-9:** WebSocket Latency < 300ms.
- **NFR-10:** Album Editor 60fps rendering.

### 💾 Reliability & Scale
- **NFR-12:** Horizontal Scaling for Backend API.
- **NFR-13:** Worker Scalability (Celery/BullMQ).
- **NFR-15:** Storage scalable to TBs (S3/B2).
- **NFR-16:** Automated Daily DB Backups.

---

## 5️⃣ Technical Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, Tailwind, React-Konva | UI, Editor, Upload Manager. |
| **Backend** | NestJS (Node.js) | API Gateway, Auth, WebSocket Server. |
| **AI Worker** | Python, FastAPI, OpenCV | Heavy Processing (Blur/Face). |
| **Database** | PostgreSQL + Prisma | Relational Data + JSONB Layouts. |
| **Queue** | Redis + BullMQ | Job Management between Node & Python. |
| **Storage** | S3 Compatible (B2/R2) | RAWs (Cold), WebP Proxies (Hot). |
| **Deploy** | Docker Compose | Containerization. |

---

## 6️⃣ Database Schema (Key Entities)

| Table | Purpose |
| :--- | :--- |
| `users` | Auth & Profile (Owner, Editor, Photo). |
| `clients` | CRM Data. |
| `shoots` | Main Project entity. |
| `photos` | Metadata, S3 Keys, AI Scores. |
| `photo_faces` | Vector embeddings & Person mapping. |
| `albums` | Album Settings & Share Tokens. |
| `album_pages` | JSONB Layout Data. |
| `selections` | Client favorites. |

---

## 7️⃣ Development Roadmap

- **Phase 1 (MVP):** Auth, Shoot CRUD, Uploads (S3), Basic Gallery, AI Blur Detection.
- **Phase 2 (Editor):** Album Builder (Konva), PDF Export, Share Links.
- **Phase 3 (AI Pro):** Face Grouping, Real-time Collaboration.
- **Phase 4 (Biz):** Revenue, Analytics, Advanced Animations.