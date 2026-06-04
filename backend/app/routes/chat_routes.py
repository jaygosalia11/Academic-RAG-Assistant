# from fastapi import APIRouter
# from app.services.rag_service import run_rag

# router = APIRouter()


# @router.get("/chat")
# def chat(query: str, department: str = None, academic_year: str = None):

#     return run_rag(query, department, academic_year)

from fastapi import APIRouter

from app.models.chat_request import ChatRequest

from app.services.rag_service import run_rag

from app.database.chat_history import (
    create_session,
    save_message,
    get_messages
)

router = APIRouter()


@router.post("/chat")
def chat(request: ChatRequest):

    create_session(
        request.session_id
    )

    save_message(
        request.session_id,
        "user",
        request.question
    )

    history = get_messages(
        request.session_id
    )

    response = run_rag(
        query=request.question,
        history=history,
        department=request.department,
        academic_year=request.batch_year
    )

    save_message(
        request.session_id,
        "assistant",
        response["answer"]
    )

    return response


    @router.get("/chat-history/{session_id}")
def chat_history(session_id: str):

    messages = get_messages(
        session_id
    )

    return {
        "messages": messages
    }