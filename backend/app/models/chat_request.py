
from pydantic import BaseModel

class ChatRequest(BaseModel):
    session_id: str
    question: str
    department: str
    batch_year: str
    semester_level: str