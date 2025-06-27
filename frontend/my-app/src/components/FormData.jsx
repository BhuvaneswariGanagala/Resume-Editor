
import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { FiDownload, FiEdit2, FiZap, FiSave,FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { saveAs } from 'file-saver';
import '../pdf-style.css';
import axios from "axios";


// Configure pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FormData = ({ initialResume, pdfFile }) => {
  const [resume, setResume] = useState(initialResume || {});
  const [editingField, setEditingField] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(null);
  const [enhancingField, setEnhancingField] = useState(null);
  const editorRef = useRef(null);
  const [filename, setFilename] = useState("my_resume");
  const [showDownload, setShowDownload] = useState(false);

  // Convert file to URL if it's a File object
  const getPdfUrl = () => {
    if (!pdfFile) return null;
    return typeof pdfFile === 'string' ? pdfFile : URL.createObjectURL(pdfFile);
  };

  const handleChange = (field, value) => {
    try {
      const parsed = JSON.parse(value);
      setResume({ ...resume, [field]: parsed });
    } catch {
      setResume({ ...resume, [field]: value });
    }
  };


  const enhanceSection = async (field, value) => {
    // Skip if the value is empty
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      toast.error(`Cannot enhance empty ${field} field`);
      return;
    }
  
    setEnhancingField(field);
    try {
      // Convert value to readable format instead of JSON
      let contentToSend;
      if (typeof value === 'string') {
        contentToSend = value;
      } else if (Array.isArray(value)) {
        contentToSend = value.map(item =>
          typeof item === 'string'
            ? item
            : Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ')
        ).join('; ');
      } else {
        contentToSend = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/ai-enhance`, {
        section: field,
        content: contentToSend
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Handle the response based on your backend's structure
      const enhancedContent = response.data?.enhanced || response.data?.content;
      if (!enhancedContent) {
        throw new Error('No enhanced content received');
      }
  
      setResume({ ...resume, [field]: enhancedContent });
      toast.success(`${field} enhanced successfully!`);
    } catch (error) {
      console.error('Enhancement error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          `Failed to enhance ${field}`;
      toast.error(errorMessage);
    } finally {
      setEnhancingField(null);
    }
  };
  const handleSave = async () => {
    // Create a beautiful custom modal instead of basic prompt
    const userFilename = await new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-2xl border border-purple-200 p-6 sm:p-8 w-full max-w-md mx-auto transform transition-all duration-300 scale-95 opacity-0">
          <div class="text-center mb-6">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Save Your Resume</h3>
            <p class="text-sm sm:text-base text-gray-600">Enter a filename to save your masterpiece</p>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Filename</label>
            <input 
              type="text" 
              id="filenameInput"
              placeholder="my-awesome-resume" 
              value="${filename}"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white shadow-sm text-sm sm:text-base"
            />
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              id="cancelBtn"
              class="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button 
              id="saveBtn"
              class="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              Save
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Animate in
      setTimeout(() => {
        modal.querySelector('.bg-gradient-to-br').classList.remove('scale-95', 'opacity-0');
        modal.querySelector('.bg-gradient-to-br').classList.add('scale-100', 'opacity-100');
      }, 10);
      
      const input = modal.querySelector('#filenameInput');
      const saveBtn = modal.querySelector('#saveBtn');
      const cancelBtn = modal.querySelector('#cancelBtn');
      
      input.focus();
      input.select();
      
      const handleSave = () => {
        const value = input.value.trim();
        if (value) {
          // Animate out before resolving
          modal.querySelector('.bg-gradient-to-br').classList.add('scale-95', 'opacity-0');
          setTimeout(() => {
            document.body.removeChild(modal);
            resolve(value);
          }, 300);
        } else {
          input.classList.add('border-red-400', 'ring-2', 'ring-red-100');
          setTimeout(() => input.classList.remove('border-red-400', 'ring-2', 'ring-red-100'), 2000);
        }
      };
      
      const handleCancel = () => {
        // Animate out before resolving
        modal.querySelector('.bg-gradient-to-br').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
          document.body.removeChild(modal);
          resolve(null);
        }, 300);
      };
      
      saveBtn.addEventListener('click', handleSave);
      cancelBtn.addEventListener('click', handleCancel);
      input.addEventListener('keypress', (e) => e.key === 'Enter' && handleSave());
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCancel();
      });
    });
    
    if (!userFilename) return;

    setFilename(userFilename);
    setShowDownload(false);

    // Create a stunning loading animation
    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-6 h-6 border-2 border-purple-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div>
          <div className="font-semibold text-purple-800">Saving your resume...</div>
          <div className="text-sm text-purple-600">Creating your masterpiece</div>
        </div>
      </div>,
      {
        className: "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 shadow-xl",
        progressClassName: "bg-gradient-to-r from-purple-500 to-blue-600"
      }
    );

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/save-resume`, {
        resume: resume,
        filename: userFilename
      });

      // Spectacular success toast with animations
      toast.update(toastId, {
        render: (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <FiCheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <div>
              <div className="font-bold text-green-800 text-lg">
                {response.data.message || "Resume saved successfully!"}
              </div>
              <div className="text-sm text-green-600">Your masterpiece is ready! ✨</div>
            </div>
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
        className: "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-2xl",
        progressClassName: "bg-gradient-to-r from-green-400 to-emerald-500"
      });

      // Only set showDownload to true after successful save
      setShowDownload(true);
      
    } catch (error) {
      // Elegant error toast with helpful messaging
      toast.update(toastId, {
        render: (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <FiXCircle className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-300 rounded-full animate-ping"></div>
            </div>
            <div>
              <div className="font-bold text-red-800 text-lg">
                {error.response?.data?.detail || "Failed to save resume"}
              </div>
              <div className="text-sm text-red-600">Don't worry, try again! 💪</div>
            </div>
          </div>
        ),
        type: "error",
        isLoading: false,
        autoClose: 6000,
        closeButton: true,
        className: "bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-2xl",
        progressClassName: "bg-gradient-to-r from-red-400 to-pink-500"
      });

      console.error("Save error:", error);
    }
  };
  // const handleSave = async () => {
  //   const userFilename = prompt("Enter a filename (without extension):", filename);
  //   if (!userFilename) return; // User cancelled
    
  //   setFilename(userFilename);
  //   setShowDownload(false); // Hide download button until save is complete
    
  //   try {
  //     const response = await axios.post("http://localhost:8000/save-resume", {
  //       resume: resume,
  //       filename: userFilename
  //     });
      
  //     toast.success(response.data.message || "Resume saved successfully!");
  //     setShowDownload(true); // Show download option after successful save
  //   } catch (error) {
  //     toast.error(error.response?.data?.error || "Failed to save resume");
  //     console.error("Save error:", error);
  //   }
  // };
  
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `${filename}.json`);
    toast.success("Resume downloaded!");
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF loading error:', error);
    setPdfError('Failed to load PDF. Please check if the file is valid.');
  };

  const formatValueForDisplay = (value) => {
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(item =>
        typeof item === "string"
          ? item
          : Object.entries(item).map(([k, v]) => `${k}: ${v}`).join('\n')
      ).join('\n\n');
    }
    return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n');
  };

  const calculateRows = (value) => {
    const formattedValue = formatValueForDisplay(value);
    return Math.min(8, formattedValue.split('\n').length + 1);
  };

  // Fields that should not have AI enhance button
  const excludedFields = ['name', 'email', 'phone', 'skills'];

  return (
    <>
      <div
        ref={editorRef}
        className="max-w-6xl mx-auto mt-4 sm:mt-8 bg-gradient-to-br from-white via-purple-50 to-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl space-y-6 sm:space-y-8 border border-purple-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-200 to-transparent rounded-full opacity-20 -translate-y-8 sm:-translate-y-16 translate-x-8 sm:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-purple-300 to-transparent rounded-full opacity-30 translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>
        
        <div className="relative z-10">
          {/* Back to Home Button */}
          <div className="flex justify-start mb-4 sm:mb-6">
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
          
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
              </div>
              <span className="hidden sm:inline">✨ AI-Powered Resume Editor</span>
              <span className="sm:hidden">✨ AI Editor</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              Edit & Elevate
            </h2>
            <p className="text-base sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium px-4">
              Transform your resume into a powerful personal brand with our intelligent editing tools
            </p>
          </div>
  
          {pdfFile && (
            <div className="bg-gradient-to-br from-white via-purple-50 to-white border border-purple-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-lg font-bold text-purple-900 mb-1 truncate">PDF Uploaded Successfully</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{typeof pdfFile === 'object' ? pdfFile.name : 'PDF File'}</p>
                </div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              </div>
              
              <div className="overflow-hidden rounded-xl sm:rounded-2xl border-2 border-purple-200/30 shadow-inner bg-white transform hover:scale-[1.02] transition-transform duration-300">
                <div className="h-[120px] sm:h-[160px] flex items-center justify-center">
                  {pdfError ? (
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-red-600 font-medium mb-1 sm:mb-2 text-sm sm:text-base">⚠️ PDF Error</div>
                      <div className="text-xs sm:text-sm text-gray-600">{pdfError}</div>
                    </div>
                  ) : (
                    <Document 
                      file={getPdfUrl()} 
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={
                        <div className="flex items-center gap-2 text-purple-600 text-sm sm:text-base">
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-purple-600"></div>
                          Loading PDF...
                        </div>
                      }
                      error={
                        <div className="text-center p-3 sm:p-4">
                          <div className="text-red-600 font-medium mb-1 sm:mb-2 text-sm sm:text-base">⚠️ PDF Error</div>
                          <div className="text-xs sm:text-sm text-gray-600">Unable to load PDF file</div>
                        </div>
                      }
                    >
                      <Page 
                        pageNumber={pageNumber} 
                        width={Math.min(520, window.innerWidth - 40)}
                        loading={
                          <div className="flex items-center gap-2 text-purple-600 text-sm sm:text-base">
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-purple-600"></div>
                            Loading page...
                          </div>
                        }
                        error={
                          <div className="text-center p-3 sm:p-4">
                            <div className="text-red-600 font-medium mb-1 sm:mb-2 text-sm sm:text-base">⚠️ Page Error</div>
                            <div className="text-xs sm:text-sm text-gray-600">Unable to load page {pageNumber}</div>
                          </div>
                        }
                      />
                    </Document>
                  )}
                </div>
                {numPages && !pdfError && (
                  <div className="text-center mt-2 text-xs sm:text-sm text-gray-600">
                    Page {pageNumber} of {numPages}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
  
      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-8 py-4 sm:py-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FiEdit2 className="w-6 h-6" />
              Resume Editor
            </h3>
            <p className="text-purple-100 mt-2">Customize your resume content below</p>
          </div>
          
          <div className="p-8 space-y-6">
            {Object.entries(resume).map(([field, value]) => {
              if (field.toLowerCase() === "skills" && Array.isArray(value)) {
                return (
                  <div key={field} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 capitalize">
                        {field.replace(/([A-Z])/g, ' $1')}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm font-medium"
                          onClick={() => {
                            const newSkills = [...value, ""];
                            handleChange(field, newSkills);
                            setTimeout(() => {
                              const inputs = document.querySelectorAll('[data-skill-input="true"]');
                              if (inputs.length > 0) {
                                inputs[inputs.length - 1].focus();
                              }
                            }, 0);
                          }}
                          title="Add Skill"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Add Skill
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {value.length === 0 ? (
                        <span className="text-gray-400 italic text-sm">No skills added yet. Click "Add Skill" to get started.</span>
                      ) : (
                        value.map((skill, idx) => (
                          <div key={idx} className="relative group">
                            <input
                              data-skill-input="true"
                              type="text"
                              className="px-4 py-2 rounded-full bg-white text-gray-900 font-medium shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:shadow-md"
                              style={{ minWidth: "120px", maxWidth: "200px" }}
                              value={skill}
                              onChange={e => {
                                const newSkills = [...value];
                                newSkills[idx] = e.target.value;
                                handleChange(field, newSkills);
                              }}
                              onKeyDown={e => {
                                if (e.key === "Tab") {
                                  e.preventDefault();
                                  const newSkills = value.filter((_, i) => i !== idx);
                                  handleChange(field, newSkills);
                                }
                              }}
                              title="Click or Tab to remove"
                              readOnly={skill === ""}
                              onFocus={e => {
                                if (skill === "") e.target.readOnly = false;
                              }}
                            />
                            <div 
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={() => {
                                const newSkills = value.filter((_, i) => i !== idx);
                                handleChange(field, newSkills);
                              }}
                            >
                              ×
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={field} className="flex flex-col sm:flex-row items-start gap-4 border-b border-gray-200 py-3">
                  <div className="sm:w-1/4 font-semibold text-gray-800 capitalize mt-2">{field.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="sm:w-3/4 w-full relative">
                    {editingField === field ? (
                      <textarea
                        className="w-full resize-none p-3 rounded-xl bg-gray-50 text-gray-900 shadow-inner border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                        style={{ outline: "none" }}
                        value={formatValueForDisplay(value)}
                        rows={calculateRows(value)}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      <div className="relative">
                        <div
                          className="bg-gradient-to-r from-white to-purple-100 p-3 rounded-xl shadow cursor-pointer hover:shadow-md transition-all duration-200 border border-purple-100"
                          onClick={() => setEditingField(field)}
                        >
                          <div className="whitespace-pre-wrap text-gray-900 text-left">
                            {formatValueForDisplay(value)}
                          </div>
                          <FiEdit2 className="absolute top-2 right-2 text-purple-600 hover:text-purple-800 transition-colors" />
                        </div>
                        {!excludedFields.includes(field.toLowerCase()) && (
                          <button
                            onClick={() => enhanceSection(field, value)}
                            disabled={enhancingField === field}
                            className="absolute bottom-2 right-10 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow hover:shadow-md"
                            title="AI Enhance this section"
                          >
                            {enhancingField === field ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <FiZap className="w-3 h-3" />
                            )}
                            {enhancingField === field ? 'Enhancing...' : 'AI Enhance'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 font-semibold transition-colors duration-200 hover:shadow-lg"
          >
            <FiSave className="inline mr-2" /> Save to Server
          </button>
          
          {showDownload && (
            <button
              onClick={handleDownload}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 font-semibold transition-colors duration-200 hover:shadow-lg"
            >
              <FiDownload className="inline mr-2" /> Download JSON
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default FormData;