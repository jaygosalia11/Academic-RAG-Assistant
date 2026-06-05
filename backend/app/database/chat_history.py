from app.database.connection import get_connection

def create_session(session_id, title="New Chat"):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO academic_rag.chat_sessions (id, title)
        VALUES (%s, %s)
        ON CONFLICT (id) DO NOTHING
    """, (session_id, title))

    conn.commit()
    cur.close()
    conn.close()

def save_message(
    session_id,
    role,
    message
):
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO academic_rag.chat_messages(
            session_id,
            role,
            message
        )
        VALUES (%s, %s, %s)
        """,
        (
            session_id,
            role,
            message
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

def get_messages(session_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT role, message
        FROM academic_rag.chat_messages
        WHERE session_id = %s
        ORDER BY created_at
    """, (session_id,))

    messages = cursor.fetchall()

    cursor.close()
    connection.close()

    return messages