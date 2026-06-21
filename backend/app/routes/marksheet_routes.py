from fastapi import APIRouter, Form, UploadFile, File, HTTPException
import os
import shutil
import psycopg2

from app.workers.marksheet_tasks import process_marksheet
from app.database.connection import get_connection

router = APIRouter()

BASE_DIR = "app/data/marksheets"


@router.post("/admin/upload-marksheet")
async def upload_marksheet(
    student_id: int = Form(...),
    semester: int = Form(...),
    academic_year: str = Form(...),
    pdf_file: UploadFile = File(...)
):

    if not pdf_file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT department
            FROM academic_rag.users
            WHERE id = %s
        """, (student_id,))

        result = cursor.fetchone()

        if not result:
            raise HTTPException(
                status_code=404,
                detail="Student not found."
            )

        department = result[0]

   
        save_dir = os.path.join(
            BASE_DIR,
            department,
            str(student_id),
            academic_year
        )

        os.makedirs(save_dir, exist_ok=True)

        file_name = f"semester_{semester}.pdf"

        file_path = os.path.join(save_dir, file_name)
   
        file_path = os.path.normpath(file_path)
        file_path = file_path.replace("\\", "/")

        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(pdf_file.file, buffer)

        
        cursor.execute("""
            INSERT INTO academic_rag.documents (
                student_id,
                semester,
                academic_year,
                file_path,
                status
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            student_id,
            semester,
            academic_year,
            file_path,
            "UPLOADED"
        ))

        document_id = cursor.fetchone()[0]

        conn.commit()

        
        process_marksheet.delay(document_id)

        return {
            "message": "Marksheet uploaded successfully",
            "document_id": document_id,
            "student_id": student_id,
            "department": department,
            "semester": semester,
            "academic_year": academic_year,
            "status": "UPLOADED",
            "file_saved_at": file_path
        }

    except psycopg2.errors.UniqueViolation:
        conn.rollback()

        raise HTTPException(
            status_code=409,
            detail="Marksheet already uploaded for this semester and academic year."
        )

    finally:
        cursor.close()
        conn.close()