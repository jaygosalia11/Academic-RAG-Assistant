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
    college_id: int = Form(...),
    academic_year: str = Form(...),
    pdf_file: UploadFile = File(...),
):

    if not pdf_file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # ---------------- student check ----------------
        cursor.execute(
            """
            SELECT department
            FROM academic_rag.users
            WHERE id = %s
        """,
            (student_id,),
        )

        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Student not found.")

        department = result[0]

        # ---------------- college check ----------------
        cursor.execute(
            """
            SELECT id
            FROM academic_rag.colleges
            WHERE id = %s
        """,
            (college_id,),
        )

        college = cursor.fetchone()

        if not college:
            raise HTTPException(status_code=404, detail="College not found.")

        # ---------------- file path ----------------
        save_dir = os.path.join(
            BASE_DIR, str(college_id), department, str(student_id), academic_year
        )

        os.makedirs(save_dir, exist_ok=True)

        file_name = f"semester_{semester}.pdf"
        file_path = os.path.join(save_dir, file_name)

        file_path = os.path.normpath(file_path).replace("\\", "/")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(pdf_file.file, buffer)

        # ---------------- insert document ----------------
        cursor.execute(
            """
            INSERT INTO academic_rag.documents (
                student_id,
                college_id,
                semester,
                academic_year,
                file_path,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """,
            (student_id, college_id, semester, academic_year, file_path, "UPLOADED"),
        )

        document_id = cursor.fetchone()[0]
        conn.commit()

        process_marksheet.delay(document_id)

        return {
            "message": "Marksheet uploaded successfully",
            "document_id": document_id,
            "student_id": student_id,
            "department": department,
            "college_id": college_id,
            "semester": semester,
            "academic_year": academic_year,
            "status": "UPLOADED",
            "file_saved_at": file_path,
        }

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(
            status_code=409,
            detail="Marksheet already uploaded for this semester and academic year.",
        )

    finally:
        cursor.close()
        conn.close()


@router.get("/students/{student_id}/marksheets/{semester}")
async def get_marksheet(student_id: int, semester: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT
                seat_number,
                student_name,
                programme_name,
                exam_month,
                sgpi,
                percentage_marks,
                course_code,
                course_name,
                course_credits,
                credit_earned,
                cmulg
            FROM academic_rag.marksheet_data
            WHERE user_id = %s
              AND semester = %s
            ORDER BY course_code
        """,
            (student_id, semester),
        )

        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="Marksheet not found.")

        first_row = rows[0]

        response = {
            "student_id": student_id,
            "semester": semester,
            "seat_number": first_row[0],
            "student_name": first_row[1],
            "programme_name": first_row[2],
            "exam_month": first_row[3],
            "sgpi": float(first_row[4]) if first_row[4] else None,
            "percentage_marks": float(first_row[5]) if first_row[5] else None,
            "subjects": [],
        }

        for row in rows:

            response["subjects"].append(
                {
                    "course_code": row[6],
                    "course_name": row[7],
                    "course_credits": row[8],
                    "credit_earned": row[9],
                    "cmulg": row[10],
                }
            )

        return response

    finally:
        cursor.close()
        conn.close()


@router.get("/admin/marksheets")
async def get_all_marksheets():

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                d.id,
                d.student_id,
                d.college_id,
                u.name,
                u.email,
                u.department,
                u.batch,
                d.semester,
                d.academic_year,
                d.file_path,
                d.status,
                d.created_at
            FROM academic_rag.documents d
            INNER JOIN academic_rag.users u
                ON d.student_id = u.id
            ORDER BY d.created_at DESC
        """)

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append(
                {
                    "document_id": row[0],
                    "student_id": row[1],
                    "college_id": row[2],
                    "student_name": row[3],
                    "email": row[4],
                    "department": row[5],
                    "batch": row[6],
                    "semester": row[7],
                    "academic_year": row[8],
                    "file_path": row[9],
                    "status": row[10],
                    "uploaded_at": row[11],
                }
            )

        return {"count": len(result), "data": result}

    finally:
        cursor.close()
        conn.close()



@router.get("/admin/dashboard/summary/{college_id}")
async def get_dashboard_summary(college_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # 1. Total students in college
        cursor.execute("""
            SELECT COUNT(*)
            FROM academic_rag.users
            WHERE id IN (
                SELECT student_id
                FROM academic_rag.documents
                WHERE college_id = %s
            )
        """, (college_id,))
        total_students = cursor.fetchone()[0]

        # 2. Total uploads
        cursor.execute("""
            SELECT COUNT(*)
            FROM academic_rag.documents
            WHERE college_id = %s
        """, (college_id,))
        total_uploads = cursor.fetchone()[0]

        # 3. Pending reviews (UPLOADED + PROCESSING + NEEDS_REVIEW)
        cursor.execute("""
            SELECT COUNT(*)
            FROM academic_rag.documents
            WHERE college_id = %s
              AND status IN ('UPLOADED', 'PROCESSING', 'NEEDS_REVIEW')
        """, (college_id,))
        pending_reviews = cursor.fetchone()[0]

        # 4. Completed marksheets
        cursor.execute("""
            SELECT COUNT(*)
            FROM academic_rag.documents
            WHERE college_id = %s
              AND status = 'COMPLETED'
        """, (college_id,))
        completed = cursor.fetchone()[0]

        return {
            "college_id": college_id,
            "total_students": total_students,
            "total_uploads": total_uploads,
            "pending_reviews": pending_reviews,
            "completed_marksheets": completed
        }

    finally:
        cursor.close()
        conn.close()

@router.get("/students/{student_id}/sgpi-history")
async def get_sgpi_history(student_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                semester,
                MAX(sgpi) AS sgpi
            FROM academic_rag.marksheet_data
            WHERE user_id = %s
            GROUP BY semester
            ORDER BY semester
        """, (student_id,))

        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="No marksheet data found."
            )

        result = []

        for row in rows:
            result.append({
                "semester": row[0],
                "sgpi": float(row[1]) if row[1] is not None else None
            })

        return {
            "student_id": student_id,
            "data": result
        }

    finally:
        cursor.close()
        conn.close()


@router.get("/students/{student_id}/total-credits")
async def get_total_credits(student_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                COALESCE(SUM(credit_earned), 0)
            FROM academic_rag.marksheet_data
            WHERE user_id = %s
        """, (student_id,))

        total_credits = cursor.fetchone()[0]

        return {
            "student_id": student_id,
            "total_credits_earned": int(total_credits)
        }

    finally:
        cursor.close()
        conn.close()


@router.get("/students/{student_id}/credits-history")
async def get_credits_history(student_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                semester,
                SUM(credit_earned) AS total_credits
            FROM academic_rag.marksheet_data
            WHERE user_id = %s
            GROUP BY semester
            ORDER BY semester
        """, (student_id,))

        rows = cursor.fetchall()

        result = []

        for row in rows:
            result.append({
                "semester": row[0],
                "credits_earned": int(row[1])
            })

        return {
            "student_id": student_id,
            "data": result
        }

    finally:
        cursor.close()
        conn.close()