from pydantic import BaseModel
from typing import Dict
class AIEnhanceRequest(BaseModel):
    section: str
    content: str
# class SaveResumeRequest(BaseModel):
#     resume: str
class SaveResumeRequest(BaseModel):
    resume: dict
    filename: str
class Config:
        from_attributes = True    

