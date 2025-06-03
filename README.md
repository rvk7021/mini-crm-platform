# 📊 Mini-CRM Platform

A responsive, full-stack CRM application built with **React**, **Node.js**, and **MongoDB**, integrating **Gemini AI** for intelligent query generation, description enrichment, and smart prompt-based data filtering. Campaigns are handled efficiently using **Bull Queue**, and the platform features secure **JWT authentication**, modular component-based frontend, and robust backend architecture.

---

## 🚀 Features

- 🔒 **JWT Authentication**: Secure login and route protection.
- 🧠 **AI Integration with Gemini**:
  - Generates **DB queries** and **descriptions** if not present.
  - Supports **prompt segmentation** to filter CRM data dynamically.
- 📋 **Campaign Queueing with Bull**:
  - Send responses in **bulk** using job queues.
  - Optimized delivery instead of one-by-one sending.
- 💻 **Responsive UI** built with React and TailwindCSS.
- 🧩 Modular frontend with reusable components.
- ⚙️ Robust backend with Express and MongoDB.

---

## 🧱 Tech Stack

| Frontend          | Backend       | AI Integration | Database | Queue        | Authentication       | Styling         |
|-------------------|---------------|----------------|----------|--------------|----------------------|-----------------|
| React.js          | Node.js       | Gemini API     | MongoDB  | Bull (Redis) | JWT (JSON Web Token)  | Tailwind CSS    |

## 🚀 Live Demo

You can check out the live hosted version of the Mini-CRM Platform here:  
👉 [https://smartreach.netlify.app/](https://smartreach.netlify.app/)

## 🎥 Demo Video

Watch the demo of the Mini-CRM Platform here:  
▶️ [Mini-CRM Platform Demo Video](https://youtu.be/vqSV_3GXouE)


## 🛠️ Tech Stack & Achievements

### Frontend

- **React.js**  
  We used React.js to build a highly interactive and dynamic user interface with reusable components. This helped us create a **modular and maintainable frontend** that efficiently renders UI updates, providing a smooth user experience.

- **Tailwind CSS**  
  Tailwind CSS was chosen for rapid UI development using utility classes. This enabled us to **build a fully responsive and visually consistent design** quickly without writing bulky CSS, improving development speed and reducing style conflicts.

### Backend

- **Node.js + Express.js**  
  Our backend uses Node.js with Express to build scalable RESTful APIs. This choice allowed us to handle **high concurrency with a non-blocking event-driven architecture**, ensuring fast and reliable server-side performance.

- **MongoDB**  
  MongoDB was implemented as our database to store CRM data in flexible, JSON-like documents. This schema-less approach enabled us to **adapt quickly to evolving data requirements** and support complex customer and campaign data efficiently.

### Authentication

- **JWT (JSON Web Tokens)**  
  JWT-based authentication was used to secure API endpoints. This approach helped us build a **stateless, scalable, and secure authentication system**, allowing users to safely log in and access protected resources without server-side session overhead.

- **Google OAuth2**  
  Integrating Google OAuth2 provided users with an easy and trusted way to sign in, eliminating password fatigue and enhancing security. This improved the **user onboarding experience** by supporting both social login and traditional authentication.

### AI Integration

- **Gemini AI**  
  Gemini AI was integrated into the backend to handle advanced tasks like generating database queries from natural language prompts, auto-creating missing descriptions, and performing prompt segmentation for smart filtering. This integration allowed us to **automate complex data filtering and enrich CRM data dynamically**, greatly improving efficiency and user productivity.

### Queuing & Background Jobs

- **Bull Queue (with Redis)**  
  We used Bull Queue backed by Redis to manage campaign message sending asynchronously. This enabled us to **queue and batch process campaign dispatches efficiently**, avoiding server overload and ensuring reliable delivery with retry capabilities.

---

By combining these technologies, the Mini-CRM Platform achieves a **robust, scalable, and user-friendly CRM solution** with powerful AI capabilities, seamless authentication, responsive UI, and efficient background processing.

---
### Project Structure
```
mini-crm-platform/
├── client/
│   ├── public/
│   └── src/
│       ├── Forms/
│       ├── auth/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       ├── index.js
│       └── index.css
├── server/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       ├── worker/
│       └── messageQueue.js
└── README.md
```

## 📐 Architecture Overview

### System Architecture

```plaintext
                                                  ┌────────────────────────────┐
                                                 │        USER (Browser)      │
                                                 └────────────┬───────────────┘
                                                              │
                                     ┌────────────────────────┼────────────────────────┐
                                     │                        ▼                        │
                             ┌─────────────────────────────────────────┐               │
                             │        FRONTEND (React + Tailwind)      │               │
                             │ - Login (Google OAuth2 / DB Login)      │               │
                             │ - Customers / Orders Page               │               │
                             │ - Segments Page                         │               │
                             │ - Campaigns & Logs Page                 │               │
                             └────────────────┬────────────────────────┘               │
                                              │  Authenticated API Requests (JWT)       │
                                              ▼                                         ▼
     ┌──────────────────────────────────────────────────────── Backend (Node.js + Express) ─────────────────────────────────────────────────┐
     │                                                                                                                                       │
     │  ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
     │  │ ⚙️  AUTH MODULE                                                                                                                 │ │
     │  │ - Google OAuth2 login (via Passport.js)                                                                                         │ │
     │  │ - DB login with hashed password (bcrypt)                                                                                        │ │
     │  │ - Generates and returns JWT → stored in localStorage/cookies                                                                    │ │
     │  └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
     │                                                                                                                                       │
     │  ┌────────────────────────────────────┐      ┌────────────────────────────────────────────────────────────────────────────────────┐ │
     │  │ 🔁 CUSTOMER API                    │      │ ✏️ ADD CUSTOMER / ADD ORDER API                                                   │ │
     │  │ - GET /customers                   │◄────►│ - POST /customers/add                                                             │ │
     │  │ - GET /orders?customerId=xyz       │      │ - POST /orders/add (link to customer)                                            │ │
     │  └────────────────────────────────────┘      └────────────────────────────────────────────────────────────────────────────────────┘ │
     │                          ▲                                                                                                            │
     │                          │                                                                                                            │
     │                          │                                                                                                            │
     │                    ┌─────┴───────┐                                                                                                   │
     │                    │ 📦 MONGODB  │ ← Stores customers, orders, segments, campaigns, logs                                             │
     │                    └─────────────┘                                                                                                   │
     │                                                                                                                                       │
     │  ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
     │  │ 🧠 SEGMENT SERVICE                                                                                                               │ │
     │  │ - GET /segments                         → Fetch all segments                                                                     │ │
     │  │ - POST /segments/create                 → Create segment via:                                                                    │ │
     │  │     ├── Manual filters (field + value)                                                                                           │ │
     │  │     └── Gemini AI (prompt-based filtering)                                                                                       │ │
     │  │         ┌─────────────► Gemini API → Prompt Segmentation                                                                         │ │
     │  │         │                                                                                                                        │ │
     │  │         └── Returns filtered customers list                                                                                      │ │
     │  │ - If description missing: calls Gemini to auto-generate a short description                                                      │ │
     │  └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
     │                                                                                                                                       │
     │  ┌────────────────────────────────────────────────────────────────────────────┐   ┌───────────────────────────────────────────────┐  │
     │  │ 📢 CAMPAIGN SERVICE                                                         │   │ 📥 BULL QUEUE (Redis)                        │  │
     │  │ - Select multiple segments                                                  │   │ - POST /campaigns/send                       │  │
     │  │ - Add to Bull queue                                                         ├──►│ - Add jobs (send email to filtered users)    │  │
     │  │ - Worker consumes and sends campaigns in bulk                               │   │ - Background worker handles execution       │  │
     │  └────────────────────────────────────────────────────────────────────────────┘   └───────────────────────────────────────────────┘  │
     │                                                                                                                                       │
     │  ┌─────────────────────────────────────────────────────┐   ┌─────────────────────────────────────────────────────┐                  │
     │  │ 🧾 COMMUNICATION LOGS                               │   │ 🗃️  CAMPAIGN LOGS                                   │                  │
     │  │ - Message sent log per campaign/customer            │   │ - Metadata: when, how many sent, success/failure   │                  │
     │  │ - Stored in MongoDB                                 │   │ - Accessed from frontend log page                 │                  │
     │  └─────────────────────────────────────────────────────┘   └─────────────────────────────────────────────────────┘                  │
     └───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
