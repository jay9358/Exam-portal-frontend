# 📝 Exam Portal – Frontend

A **modern online exam management system** built with **React + Redux + Vite + TailwindCSS**.  
It supports multiple user roles like `Admin`, `Student`, `StateManager`, and `CityManager`, delivering a fast, responsive, and secure exam experience.

---

## 🚀 Features

- 🔐 JWT-based authentication  
- 👤 Role-based dashboards & sidebar switching  
- 🧾 Quiz creation, instructions, and review system  
- 📊 Chart.js + pie chart integration  
- 📄 Export quiz results as PDF via jsPDF  
- 🎨 Beautiful UI using Tailwind CSS & styled-components  
- ⚡ Powered by Vite for ultra-fast dev builds  

---

## 🧱 Tech Stack

| Technology         | Purpose                          |
|--------------------|-----------------------------------|
| **React 18**        | Component-based UI               |
| **Redux Toolkit**   | State management                 |
| **React Router v6** | Routing and navigation           |
| **Axios**           | REST API communication           |
| **Vite**            | Lightning-fast dev & build tool  |
| **Tailwind CSS**    | Utility-first styling            |
| **jsPDF**           | Export data to PDF               |
| **Chart.js**        | Visual data representation       |

---

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js v16 or higher  
- npm (comes with Node.js)

### 📦 Installation

```bash
git clone https://github.com/jay9358/Exam-portal-frontend.git
cd Exam-portal-frontend
npm install
```

### ▶️ Run the App

```bash
npm run dev
```

Access at: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Environment Setup

Create a `.env` file at the root of your project:

```env
VITE_API_URL=http://localhost:8080/api
```

Make sure the URL points to your backend API.

---

## 🗂️ Project Structure

```
src/
├── Components/        → Reusable UI components
├── routes/            → Routing + AuthProvider
├── Store/             → Redux slices & state logic
├── App.jsx            → App logic & redirection
├── layout.jsx         → Layouts for different user roles
├── main.jsx           → React entry point
```

---

## 🧭 Routing Logic

- Uses React Router v6  
- Based on user role (`flag` stored in localStorage), routes redirect to:
  - `/admindashboard` (Admin)
  - `/studhome` (Student)
- Sidebar is hidden on login/reset pages

---

## 🔐 Authentication Flow

- `AuthProvider` tracks:
  - `isAuthenticated`
  - `role`
  - `logout()`
- Tokens & roles stored in `localStorage`
> ⚠️ Backend should validate user roles securely to avoid spoofing

---

## 💻 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter
```

---

## 📤 Deployment

You can deploy with:

- ✅ Vercel (vercel.json ready)
- ✅ Firebase or Netlify
- ✅ Any static host with `/dist`

### To build:

```bash
npm run build
```

Then upload the `dist/` folder to your hosting platform.

---

## ✅ To-Do

- [x] Admin & Student dashboards  
- [x] Exam start + result flow  
- [x] Quiz CRUD for Admin  
- [x] Role-based layout  
- [ ] Server-side role validation  
- [ ] Unit testing for login & quiz  

---

## 📄 License

This project is currently unlicensed.  
You may consider adding one like:

- [MIT License](https://choosealicense.com/licenses/mit/)
- [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome!  
Fork this repo and open a PR. Let’s build smarter exams together! 🧠✨

---

## 📬 Contact

- 📧 Email: [jay9358@github.com](mailto:jay9358@github.com)  
- 🌐 GitHub: [github.com/jay9358](https://github.com/jay9358)
