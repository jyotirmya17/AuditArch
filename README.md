<div align="center">
  <h1>AuditArch - Billing Portal</h1>
  
  <p align="center">
    A comprehensive, full-stack Billing Portal designed to streamline invoicing, client management, and PDF bill generation.
  </p>

  <div>
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express-Backend-lightgrey?style=for-the-badge&logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/Framer_Motion-Animated-fuchsia?style=for-the-badge&logo=framer" alt="Framer Motion" />
  </div>
</div>

---

## 🎨 Application Demo

Behold the sleek, premium design powered by React and Framer Motion!

<div align="center">
  <img src="./assets/demo.webp" alt="AuditArch UI Animation" width="800" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
</div>

> **Note:** The above animation showcases the interactive, responsive UI designed for maximum productivity and aesthetic appeal.

---

## 🚀 Features

- **Secure Authentication:** JWT-based user authentication and authorization with robust password hashing.
- **Client Management:** Easily add, update, and manage client details.
- **Invoice Generation:** Create, manage, and track bills effortlessly.
- **PDF Export:** Generate professional, downloadable PDF invoices dynamically using backend tools.
- **Responsive UI:** Modern, smooth interface powered by React and Framer Motion.
- **Robust Validation:** Input validation using Zod on the backend to maintain data integrity.
- **Rate Limiting & Security:** Integrated Helmet and Express Rate Limit to protect the API against common vulnerabilities.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Routing:** React Router DOM
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Security:** Helmet, Express Rate Limit, CORS
- **Validation:** Zod
- **Utilities:** date-fns, number-to-words, pdfkit

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jyotirmya17/AuditArch.git
   cd AuditArch
   ```

2. **Install dependencies for both Client and Server:**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `server` directory and configure the required variables (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`).

4. **Run the Application:**
   Open two terminal windows.

   **Start the Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

   **Start the Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the App:**
   Open your browser and navigate to the local development server URL (usually `http://localhost:5173`).

## 📂 Project Structure

```
AuditArch/
├── assets/              # README assets (images/animations)
├── client/              # React frontend
│   ├── src/             # Frontend source code
│   └── package.json     # Client dependencies
├── server/              # Node.js + Express backend
│   ├── src/
│   │   ├── models/      # Mongoose database models
│   │   ├── routes/      # Express API routes
│   │   ├── services/    # Core business logic
│   │   └── validators/  # Zod validation schemas
│   └── package.json     # Server dependencies
└── README.md
```

## 📄 License
This project is licensed under the ISC License.
