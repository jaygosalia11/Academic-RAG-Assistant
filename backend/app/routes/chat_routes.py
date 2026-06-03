from fastapi import APIRouter
from app.services.rag_service import run_rag

router = APIRouter()


@router.get("/chat")
def chat(query: str, department: str = None, academic_year: str = None):

    return run_rag(query, department, academic_year)