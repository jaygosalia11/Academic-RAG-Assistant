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
def create_user(name, email, password, department, batch, semester,college_id):
    conn = get_connection()
    cur = conn.cursor()

    hashed = hash_password(password)

    # cur.execute("""
    #     INSERT INTO academic_rag.users (name, email, password, department, batch, semester,college_id)
    #     VALUES (%s, %s, %s, %s, %s, %s,%s)
    #     RETURNING id, name, email, department, batch, semester,college_id
    # """, (name, email, hashed, department, batch, semester,college_id))


    cur.execute("""
    INSERT INTO academic_rag.users (
        name,
        email,
        password,
        department,
        batch,
        semester,
        college_id,
        role
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, 'STUDENT')
    RETURNING
        id,
        name,
        email,
        department,
        batch,
        semester,
        college_id,
        role
""", (
    name,
    email,
    hashed,
    department,
    batch,
    semester,
    college_id
))

    user = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return user


# def get_user_by_email(email):
#     conn = get_connection()
#     cur = conn.cursor()

#     cur.execute("""
#         SELECT
#             id,
#             name,
#             email,
#             password,
#             department,
#             batch,
#             semester
#         FROM academic_rag.users
#         WHERE email = %s
#     """, (email,))

#     user = cur.fetchone()

#     cur.close()
#     conn.close()

#     return user



def get_user_by_email(email):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
    u.id,
    u.name,
    u.email,
    u.password,
    u.department,
    u.batch,
    u.semester,
    u.college_id,
    c.college_name,
    u.role
FROM academic_rag.users u
LEFT JOIN academic_rag.colleges c
    ON u.college_id = c.id
WHERE u.email = %s;
    """, (email,))

    user = cur.fetchone()

    cur.close()
    conn.close()

    return user