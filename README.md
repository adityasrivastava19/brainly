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
│   │   └── content.ts             # Content creation, retrieval (stub), and deletion
│   ├── routes/
│   │   ├── signup.ts              # Router for signup
│   │   ├── signin.ts              # Router for signin
│   │   ├── content.ts             # Router for POST /content
│   │   └── deleteContent.ts       # Router for DELETE /content/:id
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
* **Endpoint:** `POST /api/v1/signup` (or `POST /signup`)
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
* **Flow:** Validates body payload $\rightarrow$ Checks if username is already taken $\rightarrow$ Hashes password using `bcrypt` (10 rounds) $\rightarrow$ Creates user record in DB $\rightarrow$ Generates and returns a signed JWT token (expires in 7 days).

#### **2. Sign In User**
* **Endpoint:** `POST /api/v1/signin` (or `POST /signin`)
* **Route:** [src/routes/signin.ts](file:///a:/web/week-15/brainly/src/routes/signin.ts)
* **Controller:** [src/controller/login.ts](file:///a:/web/week-15/brainly/src/controller/login.ts)
* **Request Body (JSON):** Same as signup.
* **Flow:** Validates body payload $\rightarrow$ Retrieves user record by username $\rightarrow$ Compares hashed passwords via `bcrypt.compare` $\rightarrow$ Generates and returns a signed JWT token.

---

### 🗂️ Content Management API

Both Content APIs are mounted at prefix `/content` and `/api/v1/content` respectively in the main router setup.

#### **1. Add Content Card**
* **Endpoint:** `POST /api/v1/content` (or `POST /content`)
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Route:** [src/routes/content.ts](file:///a:/web/week-15/brainly/src/routes/content.ts)
* **Controller:** [src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts) (specifically the `createcontent` function)
* **Request Body (JSON):**
  ```json
  {
    "title": "My Favorite Tweet",
    "link": "https://twitter.com/example/status/123",
    "type": "tweet",
    "tag": ["tech", "learning"]
  }
  ```
* **Validation Rules (`contentSchema` in [src/validation/content.ts](file:///a:/web/week-15/brainly/src/validation/content.ts)):**
  * `title`: String (1 to 100 characters).
  * `link`: String (must be a valid URL).
  * `type`: Enum (`"document"`, `"tweet"`, `"youtube"`, `"link"`).
  * `tag`: Array of strings (optional).
* **Flow:** Verifies Bearer token with [auth middleware](file:///a:/web/week-15/brainly/src/middleware/middleware.ts) $\rightarrow$ Extracts `userid` $\rightarrow$ Checks for existing tags in the tags collection; creates and saves new ones if they don't exist $\rightarrow$ Creates the content document linking the `userid` and array of `tagref` ObjectIds $\rightarrow$ Populates and returns the complete object.

#### **2. Delete Content Card**
* **Endpoint:** `DELETE /api/v1/content/:id` (or `DELETE /content/:id`)
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Route:** [src/routes/deleteContent.ts](file:///a:/web/week-15/brainly/src/routes/deleteContent.ts)
* **Controller:** [src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts) (specifically the `deleteContent` function)
* **Flow:** Verifies Bearer token $\rightarrow$ Validates whether `id` is a valid MongoDB ObjectId $\rightarrow$ Performs an awaited `findOneAndDelete` matching the `_id` and the user's `userid`.

---

## 📈 Progress Checklist & Roadmap

### What's Done So Far
- [x] Initial Express server setup & dotenv integration ([src/index.ts](file:///a:/web/week-15/brainly/src/index.ts))
- [x] MongoDB connection setup with Mongoose ([src/db.ts](file:///a:/web/week-15/brainly/src/db.ts))
- [x] Database model definitions ([src/model/](file:///a:/web/week-15/brainly/src/model/))
- [x] Schema input validations using Zod ([src/validation/](file:///a:/web/week-15/brainly/src/validation/))
- [x] Robust password hashing integration using `bcrypt` ([src/controller/signup.ts](file:///a:/web/week-15/brainly/src/controller/signup.ts))
- [x] Complete JWT Authentication Flow ([src/controller/login.ts](file:///a:/web/week-15/brainly/src/controller/login.ts))
- [x] JWT Bearer Token validation middleware ([src/middleware/middleware.ts](file:///a:/web/week-15/brainly/src/middleware/middleware.ts))
- [x] Custom types extending Express request object with decoded token payload ([src/types/express/index.d.ts](file:///a:/web/week-15/brainly/src/types/express/index.d.ts))
- [x] Create Content API with dynamic tag generation ([src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts))
- [x] Delete Content controller implementation ([src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts))
- [x] **Fix Routing & Parameter Bugs:**
  - [x] Mounted the router in [deleteContent.ts](file:///a:/web/week-15/brainly/src/routes/deleteContent.ts) instead of mounting the raw controller function directly in [src/index.ts](file:///a:/web/week-15/brainly/src/index.ts).
  - [x] Corrected the delete route from `POST /content/delete` to `DELETE /content/:id` to match REST standards and aligned with the controller's use of `req.params.id`.
- [x] **Code Quality & Typos Cleanup:**
  - [x] Corrected filenames and variable spellings (`singnup.ts` $\rightarrow$ `signup.ts`, `cotent.ts` $\rightarrow$ `content.ts`, `deleteContenet.ts` $\rightarrow$ `deleteContent.ts`).

### Future Tasks & Next Steps
- [ ] **Implement Get Content API:**
  - [ ] Implement `getAllContent` in [src/controller/content.ts](file:///a:/web/week-15/brainly/src/controller/content.ts) to retrieve all cards for a user.
  - [ ] Add a `GET /api/v1/content` route mapped to this controller.
- [ ] **Implement Sharing System:**
  - [ ] `POST /api/v1/brain/share` - Toggle share-ability (generate/remove share hash link).
  - [ ] `GET /api/v1/brain/:shareLink` - Retrieve shared cards publicly.
- [ ] **Frontend client:** Build a responsive UI dashboard to visualize the saved links, documents, and tags.

---

## ⚙️ Configuration & Setup

### 1. Environment Variables
Create a `.env` file in the root directory and configure the database URI and JWT secret key:
```env
MONGO_URI=mongodb://localhost:27017/brainly
jwt_secert=your_secure_jwt_secret_here
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
