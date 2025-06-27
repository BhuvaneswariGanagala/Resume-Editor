# Resume-Editor
# ✨ AI-Powered Resume Editor

An intelligent resume editor built with **React + Vite** frontend and **FastAPI** backend. This project enables users to upload resumes, edit content, preview PDFs, apply AI enhancements to resume sections, and download/save their resume in JSON format.

---

## 🚀 Features

### ✅ Frontend (React + Vite)
- Upload `.pdf` or `.docx` resume files
- View first page PDF preview (`react-pdf`)
- Inline resume editing for each section
- AI Enhancement button per section (`axios` to FastAPI)
- JSON download for resume data
- Toast notifications using `react-toastify`
- Beautiful, responsive UI with Tailwind CSS

### ⚙️ Backend (FastAPI)
- `POST /ai-enhance`: Enhances content for specific sections like skills, summary, education, etc.
- `POST /save-resume`: Saves JSON data of the resume locally
- CORS enabled for cross-origin frontend requests

---

## 🛠️ Tech Stack

| Frontend                | Backend                |
|-------------------------|------------------------|
| React (Vite)            | FastAPI (Python)       |
| Tailwind CSS            | Pydantic (Schemas)     |
| Axios for API requests  | CORS Middleware        |
| React-PDF               | JSON File Handling     |
| React-Toastify          |                        |

---

## 📁 Folder Structure

```bash
resume_editor/
├── backend/
│   ├── main.py               # FastAPI app
│   └── schemas.py            # Pydantic request models
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── FormData.jsx  # Main resume editor
│   │   └── assets/
│   ├── public/
│   ├── .env                  # VITE_API_BASE_URL config
│   └── vite.config.js

### 1. Clone the repository
git clone https://github.com/BhuvaneswariGanagala/Resume-Editor.git
cd resume-editor

###2. Backend Setup (FastAPI)
✅ Install dependencies
cd backend
pip install fastapi uvicorn

✅ Run backend server
uvicorn main:app --reload
Server runs at: http://localhost:8000

###3. Frontend Setup (React + Vite)
✅ Install dependencies
cd frontend
cd my-app
npm install

✅ Create .env
VITE_API_BASE_URL=http://localhost:8000

✅ Start frontend
npm run dev
App runs at: http://localhost:5173
