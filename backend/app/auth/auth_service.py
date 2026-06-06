import bcrypt
from app.database.connection import get_connection


def hash_password(password: str):

    salt = bcrypt.gensalt()

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        salt
    )

    return hashed_password.decode("utf-8")

def verify_password(
    plain_password,
    hashed_password
):

    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )

# create user
def create_user(name, email, password):
    conn = get_connection()
    cur = conn.cursor()

    hashed = hash_password(password)

    cur.execute("""
        INSERT INTO academic_rag.users (name, email, password)
        VALUES (%s, %s, %s)
        RETURNING id, name, email
    """, (name, email, hashed))

    user = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return user


# get user by email
def get_user_by_email(email):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name, email, password
        FROM academic_rag.users
        WHERE email = %s
    """, (email,))

    user = cur.fetchone()

    cur.close()
    conn.close()

    return user