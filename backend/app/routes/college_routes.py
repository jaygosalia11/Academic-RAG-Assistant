from fastapi import APIRouter

from app.database.connection import get_connection

router = APIRouter(prefix="/colleges", tags=["Colleges"])


@router.get("")
async def get_colleges():

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                id,
                college_name
            FROM academic_rag.colleges
            ORDER BY college_name
        """)

        rows = cursor.fetchall()

        colleges = []

        for row in rows:
            colleges.append({
                "id": row[0],
                "college_name": row[1]
            })

        return {
            "count": len(colleges),
            "data": colleges
        }

    finally:
        cursor.close()
        conn.close()