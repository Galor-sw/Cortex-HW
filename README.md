# Cortex HW - Website Traffic Dashboard

This project is a professional website traffic management dashboard developed as part of the Cortex Real Estate platform. It allows authenticated users to view, add, edit, and delete traffic records via a responsive table and graph interface.

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Firebase account (with Firestore and Authentication enabled)

### Installation

1. **Clone the repository**:

   ```
   git clone https://github.com/Galor-sw/cortex-hw.git
   cd cortex-hw
   ```

2. **Install dependencies**:

   ```
   cd client
   npm install
   ```

3. **Configure Firebase**:

      - Create a `.env` file in the root of the client folder and add your Firebase config variables (see example in `.env.example`)

4. **Run the app**:

   ```
   npm start
   ```

---

## 🛠️ Technologies Used

### Frontend

- **React.js** with hooks
- **Tailwind CSS** for styling
- **Recharts** for visualizing traffic data
- **React Router DOM** for routing
- **Firebase Authentication** for user management

### Backend (Firebase Cloud Functions)

- **Firestore Database** to store traffic records
- **Firebase Functions** (Cloud) to serve traffic data

---

## 🧱 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── table/         → TableData, sorting, pagination
│   │   ├── chart/         → LineChart for traffic data
│   │   ├── auth/          → Firebase login handling
│   │   └── header/        → App branding + logout
│   ├── firebase/          → Firebase config
│   └── App.js / index.js
```

---

## 👥 User Roles

The app supports two types of users:

- **Viewer**: Can view data only (default role)
- **Editor**: Can add, edit, and delete entries

User roles are stored in the Firestore `roles` collection by UID. Role checking is performed on client load using Firebase Authentication.

---

## 📊 Features

- Responsive traffic dashboard
- Toggle between Table and Graph view
- Sort by date or visits
- Search by specific date
- Add new traffic entries (Editor only)
- Edit or delete entries (Editor only)
- Pagination support
- View total entries count

---

## 🔐 Authentication

- Users must log in using Firebase Authentication (email/password).
- When a user is created, they are automatically assigned the role `viewer` in the Firestore database.
- Only an admin with access to the database can manually update a user's role to `editor`.

---