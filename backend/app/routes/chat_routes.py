
from fastapi import APIRouter

from app.models.chat_request import ChatRequest
from app.services.rag_service import run_rag

from app.database.chat_history import (
    create_session,
    save_message,
    get_messages
)

from app.database.connection import get_connection  # ✅ FIXED IMPORT

router = APIRouter()

# =========================
# CHAT API
# =========================
@router.post("/chat")
def chat(request: ChatRequest):

    create_session(request.session_id)

    save_message(
        request.session_id,
        "user",
        request.question
    )

    history = get_messages(request.session_id)

    response = run_rag(
        query=request.question,
        history=history,
        department=request.department,
        batch_year=request.batch_year,
        semester_level=request.semester_level
    )

    save_message(
        request.session_id,
        "assistant",
        response["answer"]
    )

    return response


# =========================
# CHAT HISTORY API
# =========================
@router.get("/chat-history/{session_id}")
def chat_history(session_id: str):

    messages = get_messages(session_id)

    return {
        "messages": messages
    }


# =========================
# GET ALL SESSIONS
# =========================
@router.get("/chat-sessions")
def get_sessions():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, title, created_at
        FROM academic_rag.chat_sessions
        ORDER BY created_at DESC
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "sessions": [
            {
                "id": r[0],
                "title": r[1],
                "created_at": r[2]
            }
            for r in rows
        ]
    }


# =========================
# CREATE SESSION API
# =========================
@router.post("/chat-session/create")
def create_chat_session(payload: dict):

    session_id = payload["session_id"]

    create_session(session_id)

    return {
        "message": "Session created",
        "session_id": session_id
    }