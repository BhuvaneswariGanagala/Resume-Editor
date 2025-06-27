import React, { useState } from "react";
import { FiUpload, FiZap, FiGithub, FiYoutube } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormData from "./FormData";
import "../pdf-style.css";

const initialResume = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  objective:
    "Passionate software engineer with strong foundation in full-stack development...",
  education: [
    {
      degree: "Bachelor of Science, Computer Science",
      college: "Stanford University",
      year: "2019 - 2023",
      gpa: "GPA: 3.9/4.0",
    },
  ],
  extracurriculars: [
    "Active member of the university tech community and hackathon participant...",
  ],
  trainings: [
    {
      title: "Advanced React Development",
      source: "Udemy, Online",
      duration: "Jan 2024 - Mar 2024",
      description:
        "Mastered advanced React concepts including hooks, context, and performance optimization...",
    },
    {
      title: "Full Stack Web Development",
      source: "Coursera, Online",
      duration: "Sep 2023 - Dec 2023",
      description:
        "Comprehensive course covering frontend and backend development with modern frameworks...",
    },
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      duration: "Mar 2024 - May 2024",
      link: "https://example-ecommerce.com/",
      description:
        "A full-stack e-commerce platform built with React, Node.js, and MongoDB...",
    },
  ],
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "AWS",
    "Docker",
    "Git",
    "TypeScript",
    "MongoDB",
    "Express.js",
  ],
  portfolio: [
    {
      title: "GitHub Profile",
      link: "https://github.com",
    },
  ],
  accomplishments: [
    "Led development team to win university hackathon",
    "Contributed to 3 open-source projects with 100+ stars",
  ],
};

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("❌ Only PDF or DOCX files are allowed.");
      return;
    }

    toast.success(`✅ Uploaded ${file.name}. Simulating resume parsing...`);
    setPdfFile(file);
    setFormVisible(true);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-6 sm:px-12 text-center relative">
      
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-purple-100 shadow-sm py-3 px-4 sm:px-6 lg:px-12 flex justify-between items-center">
        <div className="text-lg sm:text-xl font-bold text-purple-700">ResumeEditor.ai</div>
        <div className="hidden sm:flex gap-4 lg:gap-6 text-sm text-gray-600">
          <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-purple-600 transition-colors">About</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-purple-600 flex items-center gap-1 transition-colors">
            <FiGithub className="w-4 h-4" /> <span className="hidden lg:inline">GitHub</span>
          </a>
        </div>
        {/* Mobile menu button */}
        <button 
          className="sm:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-purple-100 shadow-lg sm:hidden">
            <div className="flex flex-col py-4 px-4 space-y-3 text-sm text-gray-600">
              <a href="#features" className="hover:text-purple-600 transition-colors py-2">Features</a>
              <a href="#about" className="hover:text-purple-600 transition-colors py-2">About</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-purple-600 flex items-center gap-1 transition-colors py-2">
                <FiGithub className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-24"> {/* offset for fixed navbar */}

        {!formVisible && (
          <header className="max-w-3xl mx-auto">
            <span className="inline-block text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold mb-4">
              New — Your AI Resume Partner
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Build Your Resume <span className="text-purple-600">With Resume Editor</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Let AI enhance your resume with polished, professional language.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <label className="bg-purple-600 text-white px-6 py-3 rounded-full shadow hover:bg-purple-700 font-semibold cursor-pointer">
                <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} />
                Upload Resume →
              </label>
              <button
                className="bg-purple-400 text-white px-6 py-3 rounded-full shadow cursor-not-allowed opacity-60"
                disabled
                title="Please upload a resume first"
              >
                🤖 Try AI Enhancement
              </button>
            </div>

            {/* ✅ Tips Section */}
            <div className="text-left text-sm mt-10 bg-purple-50 border border-purple-100 rounded-xl p-6 shadow max-w-xl mx-auto">
              <h3 className="text-purple-700 font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-gray-600">
                You can edit any resume section after uploading. Just click on any field to customize it.
                AI will assist in polishing your text professionally.
              </p>
            </div>

            {/* Social section */}
            <div className="flex items-center justify-center gap-6 mt-10 text-gray-400 text-sm">
              <span className="flex items-center gap-2"><FiYoutube /> YouTube</span>
              <span className="flex items-center gap-2"><FiZap /> Product Hunt</span>
              <span className="flex items-center gap-2"><FiGithub /> GitHub</span>
            </div>
          </header>
        )}

        {formVisible && <FormData initialResume={initialResume} pdfFile={pdfFile} />}
      </div>

      {/* ✅ Footer */}
      <footer className="mt-16 py-6 border-t text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} ResumeEditor.ai — Built with 💜 using React + FastAPI
      </footer>
    </div>
  );
};

export default Home;

