from fastapi import APIRouter, Form, UploadFile, File
import os
import shutil
from app.core.ingest import ingest_syllabus


router = APIRouter()

BASE_DIR = "app/data/syllabus"


@router.post("/admin/upload-syllabus")
async def upload_syllabus(
    department: str = Form(...),
    batch_year: str = Form(...),
    semester_level: str = Form(...),  
    pdf_file: UploadFile = File(...)
):

    # 1. Create folder structure
    save_dir = os.path.join(BASE_DIR, department, batch_year)
    os.makedirs(save_dir, exist_ok=True)

    # 2. Save file
    file_path = os.path.join(save_dir, pdf_file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)

 

    # 4. Ingest into vector DB
    chunks = ingest_syllabus(
        folder_path=save_dir,
        department=department,
        batch_year=batch_year,
        semester_level=semester_level
    )

    return {
        "message": "Upload + Ingestion successful",
        "department": department,
        "batch_year": batch_year,
        "semester_level": semester_level,
        "file_saved_at": file_path,
        "chunks_created": len(chunks)
    }