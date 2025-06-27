from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import AIEnhanceRequest, SaveResumeRequest
import json
import os
from datetime import datetime
from fastapi.responses import FileResponse

app = FastAPI()

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ai-enhance")
async def enhance_with_ai(data: AIEnhanceRequest):
    section = data.section.lower()
    content = data.content.strip()

    if section in ["objective", "summary"]:
        enhanced = (
            f"{content} Highly motivated developer skilled in delivering robust web solutions. "
            "Proficient in modern technologies with a passion for clean, scalable code and continuous learning."
        )

    elif section == "education":
        enhanced = (
            f"{content} Demonstrated academic excellence in computer science. "
            "Consider including: degree, graduation year, GPA, and institution name for comprehensive academic representation."
        )

    elif section == "extracurriculars":
        enhanced = (
            f"{content} Played a pivotal role in organizing campus tech events. "
            "Actively contributed to coding communities and peer learning initiatives."
        )

    elif section == "trainings":
        enhanced = (
            f"{content} Completed multiple hands-on certifications in full stack development. "
            "Focused on practical application, real-world project development, and agile methodologies."
        )

    elif section == "projects":
        enhanced = (
            f"{content} Engineered scalable full-stack solutions with high performance. "
            "Implemented modern UI/UX principles and optimized backend services for real-time usage."
        )

    elif section == "portfolio":
        enhanced = (
            f"{content} Maintains an active GitHub with clean, well-documented code. "
            "Demonstrates professional project structure and collaboration readiness."
        )

    elif section == "accomplishments":
        enhanced = (
            f"{content} Recognized for leadership in hackathons and consistent open-source contributions. "
            "Achieved measurable impact in cross-functional tech teams."
        )

    elif section == "skills":
        enhanced = (
            f"{content}, system design, CI/CD pipelines, RESTful APIs, GraphQL, Agile/Scrum, "
            "Unit Testing, Web Performance Optimization"
        )

    else:
        enhanced = f"{content} (Improved by AI: rephrased professionally for clarity and impact.)"

    return {"enhanced": enhanced}


@app.post("/save-resume")
async def save_resume(data: SaveResumeRequest):
    try:
        # Create saves directory if it doesn't exist
        os.makedirs("saves", exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"saves/{data.filename}_{timestamp}.json"
        
        # Save the file
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data.resume, f, indent=4, ensure_ascii=False)
            
        return {
            "message": "Resume saved successfully",
            "filename": filename,
            "download_url": f"/download-resume/{os.path.basename(filename)}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download-resume/{filename}")
async def download_resume(filename: str):
    file_path = f"saves/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)

# @app.post("/save-resume")
# def save_resume(data: SaveResumeRequest):
#     try:
#         with open("resume_data.json", "w") as f:
#             json.dump(data.resume, f, indent=4)
#         return {"message": "Resume saved successfully"}
#     except Exception as e:
#         return {"error": str(e)}


