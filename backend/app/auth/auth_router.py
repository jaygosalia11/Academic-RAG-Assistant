from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth.auth_service import (
    create_user,
    get_user_by_email,
    verify_password
)

router = APIRouter(prefix="/auth")


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    department: str
    batch: str
    semester: str
    college_id: int


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(req: RegisterRequest):

    existing_user = get_user_by_email(req.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    user = create_user(req.name, req.email, req.password,req.department, req.batch, req.semester,req.college_id)

    return {
        "message": "User registered successfully",
        "user": {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "college_id": user[6],
            "role": user[7]
        }
    }


@router.post("/login")
def login(req: LoginRequest):

    user = get_user_by_email(req.email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_password = user[3]

    if not verify_password(req.password, db_password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # return {
    #     "message": "Login successful",
    #     "user": {
    #         "id": user[0],
    #         "name": user[1],
    #         "email": user[2],
    #         "college_id": user[7],
    #          "department": user[4],
    #         "batch_year": user[5],
    #         "semester_level": user[6],
    #     }
    # }

    return {
        "message": "Login successful",
        "user": {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "department": user[4],
            "batch_year": user[5],
            "semester_level": user[6],
            "college_id": user[7],
            "college_name": user[8],
            "role": user[9]
        }
    }