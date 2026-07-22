# Brainly Backend API

Brainly is a personal knowledge management ("second brain") backend service. It allows users to securely save, tag, and organize various forms of content such as links, images, videos, documents, tweets, and text notes.

---

## 🚀 Technologies Used
* **Runtime:** Node.js (ES Modules)
* **Language:** TypeScript (`nodenext` configuration)
* **Framework:** Express
* **Database & ORM:** MongoDB & Mongoose
* **Cryptography / Hashing:** bcrypt (10 rounds for passwords)
* **Validation:** Zod
* **Authentication:** JSON Web Tokens (JWT)
* **Configuration:** dotenv

---

## 📁 Directory Structure

Below is the directory layout of the project. Files are linked directly to their locations in the workspace for quick navigation:

```text
brainly/
├── dist/                          # Compiled JavaScript files (output of tsc)
├── src/
│   ├── index.ts                   # Express server entry point & router mounting
│   ├── db.ts                      # MongoDB connection helper (using Mongoose)
│   ├── middleware/
│   │   └── middleware.ts          # JWT authentication middleware
│   ├── controller/
│   │   ├── login.ts               # Login / Signin controller
│   │   ├── signup.ts              # User registration / Signup controller
│   │   ├── content.ts             # Content creation, retrieval, and deletion
│   │   ├── enableSharableLink.ts  # Enable shareable hash link controller
│   │   ├── disableShareableLink.ts # Disable shareable hash link controller
│   │   └── getSharedBrain.ts      # Public shared brain retrieval controller
│   ├── routes/
│   │   ├── signup.ts              # Router for signup
│   │   ├── signin.ts              # Router for signin
│   │   ├── content.ts             # Router for /content (POST, GET, DELETE)
│   │   ├── sharableLink.ts        # Router for /shareable-link (POST, DELETE)
│   │   └── brain.ts               # Router for public shared link GET /brain/:shareLink
│   ├── model/
│   │   ├── user.ts                # Mongoose Schema & Model for Users
│   │   ├── content.ts             # Mongoose Schema & Model for User Content
│   │   ├── tag.ts                 # Mongoose Schema & Model for Content Tags
│   │   └── link.ts                # Mongoose Schema & Model for Sharing / Hashes
│   ├── types/
│   │   └── express/
│   │       └── index.d.ts         # Type declarations extending Express Request with 'user'
│   ├── validation/
│   │   ├── validate.ts            # Zod validation schema for user login/signup
│   │   └── content.ts             # Zod validation schema for content payload
│   └── workdone                   # Simple log tracking completed milestones
├── .env                           # Environment variables configuration (gitignored)
├── tsconfig.json                  # TypeScript compilation configuration
└── package.json                   # Project scripts and dependencies
```

* **Entry point:** [src/index.ts](file:///a:/web/week-15/brainly/src/index.ts)
* **DB Setup:** [src/db.ts](file:///a:/web/week-15/brainly/src/db.ts)
* **Validation Rules:** [src/validation/validate.ts](file:///a:/web/week-15/brainly/src/validation/validate.ts) & [src/validation/content.ts](file:///a:/web/week-15/brainly/src/validation/content.ts)
* **JWT Auth Middleware:** [src/middleware/middleware.ts](file:///a:/web/week-15/brainly/src/middleware/middleware.ts)

---

## 🛠️ API Documentation & Flow

### 🔐 Authentication API

#### **1. Register a New User**
* **Endpoint:** `POST /api/v1/signup`
* **Route:** [src/routes/signup.ts](file:///a:/web/week-15/brainly/src/routes/signup.ts)
* **Controller:** [src/controller/signup.ts](file:///a:/web/week-15/brainly/src/controller/signup.ts)
* **Request Body (JSON):**
  ```json
  {
    "username": "user123",
    "password": "StrongPassword123!"
  }
  ```
* **Validation Rules (`loginSchema` in [src/validation/validate.ts](file:///a:/web/week-15/brainly/src/validation/validate.ts)):**
  * `username`: String (3 to 10 characters).
  * `password`: String (8 to 20 characters), requiring at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
* **Flow:** Validates body payload $\rightarrow$ Checks if username exists $\rightarrow$ Hashes password using `bcrypt` $\rightarrow$ Creates user in DB $\rightarrow$ Returns signed JWT token (`201 Created`).

#### **2. Sign In User**
* **Endpoint:** `POST /api/v1/signin`
* **Route:** [src/routes/signin.ts](file:///a:/web/week-15/brainly/src/routes/signin.ts)
* **Controller:** [src/controller/login.ts](file:///a:/web/week-15/brainly/src/controller/login.ts)
* **Request Body (JSON):** Same as signup.
* **Flow:** Validates payload $\rightarrow$ Compares passwords via `bcrypt.compare` $\rightarrow$ Returns signed JWT token (`200 OK`).

---

### 🗂️ Content Management API

Mounted at prefix `/api/v1/content`.

#### **1. Add Content Card**
* **Endpoint:** `POST /api/v1/content`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Route:** [src/routes/content.ts](file:///a:/web/week-15/brainly/src/routes/content.ts)
* **Controller:** [src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts) (`createcontent`)
* **Request Body (JSON):**
  ```json
  {
    "title": "My Favorite Tweet",
    "link": "https://twitter.com/example/status/123",
    "type": "tweet",
    "tag": ["tech", "learning"]
  }
  ```

#### **2. Get All Content**
* **Endpoint:** `GET /api/v1/content`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Route:** [src/routes/content.ts](file:///a:/web/week-15/brainly/src/routes/content.ts)
* **Controller:** [src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts) (`getAllContent`)

#### **3. Delete Content Card**
* **Endpoint:** `DELETE /api/v1/content/:id`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Route:** [src/routes/content.ts](file:///a:/web/week-15/brainly/src/routes/content.ts)
* **Controller:** [src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts) (`deleteContent`)

---

### 🔗 Shareable Link & Public Brain API

#### **1. Enable Shareable Link**
* **Endpoint:** `POST /api/v1/shareable-link`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Route:** [src/routes/sharableLink.ts](file:///a:/web/week-15/brainly/src/routes/sharableLink.ts)
* **Controller:** [src/controller/enableSharableLink.ts](file:///a:/web/week-15/brainly/src/controller/enableSharableLink.ts)
* **Response:** Returns hash link string (e.g., `http://localhost:3000/hash_string`).

#### **2. Disable Shareable Link**
* **Endpoint:** `DELETE /api/v1/shareable-link`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Route:** [src/routes/sharableLink.ts](file:///a:/web/week-15/brainly/src/routes/sharableLink.ts)
* **Controller:** [src/controller/disableShareableLink.ts](file:///a:/web/week-15/brainly/src/controller/disableShareableLink.ts)

#### **3. View Public Shared Brain**
* **Endpoint:** `GET /api/v1/brain/:shareLink`
* **Headers:** None (Public)
* **Route:** [src/routes/brain.ts](file:///a:/web/week-15/brainly/src/routes/brain.ts)
* **Controller:** [src/controller/getSharedBrain.ts](file:///a:/web/week-15/brainly/src/controller/getSharedBrain.ts)
* **Response Body (JSON):**
  ```json
  {
    "username": "user123",
    "content": [
      {
        "_id": "...",
        "title": "My Saved Article",
        "link": "https://example.com",
        "type": "document",
        "tagref": [{ "_id": "...", "title": "learning" }]
      }
    ]
  }
  ```

---

## 📈 Progress Checklist & Roadmap

### What's Done So Far
- [x] Initial Express server setup & dotenv integration ([src/index.ts](file:///a:/web/week-15/brainly/src/index.ts))
- [x] MongoDB connection setup with Mongoose ([src/db.ts](file:///a:/web/week-15/brainly/src/db.ts))
- [x] Database model definitions ([src/model/](file:///a:/web/week-15/brainly/src/model/))
- [x] Schema input validations using Zod ([src/validation/](file:///a:/web/week-15/brainly/src/validation/))
- [x] Password hashing integration using `bcrypt` ([src/controller/signup.ts](file:///a:/web/week-15/brainly/src/controller/signup.ts))
- [x] JWT Authentication Flow & Bearer Middleware ([src/middleware/middleware.ts](file:///a:/web/week-15/brainly/src/middleware/middleware.ts))
- [x] Create, Get All, and Delete Content APIs ([src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts))
- [x] **Complete Sharing System:**
  - [x] `POST /api/v1/shareable-link` - Enable shareable link.
  - [x] `DELETE /api/v1/shareable-link` - Disable shareable link.
  - [x] `GET /api/v1/brain/:shareLink` - Retrieve shared cards publicly ([src/controller/getSharedBrain.ts](file:///a:/web/week-15/brainly/src/controller/getSharedBrain.ts)).
- [x] **CORS Support:** Integrated `cors` middleware for cross-origin web apps.
- [x] **Bug Fixes:** Fixed Zod URL schema syntax, Mongoose model reference casing, and standardized HTTP status codes.

---

## ⚙️ Configuration & Setup

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/brainly
jwt_secret=your_secure_jwt_secret_here
```

### 2. Installation
Install project dependencies:
```bash
npm install
```

### 3. Build & Compile
Compile the TypeScript code:
```bash
npm run build
```

### 4. Running the Server
Start the application (default port is `3000`):
```bash
node dist/index.js
```

