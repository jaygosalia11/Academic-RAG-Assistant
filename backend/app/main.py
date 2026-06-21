
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat_routes import router as chat_router
from app.routes.admin_routes import router as admin_router
from app.auth.auth_router import router as auth_router
from app.routes.marksheet_routes import router as marksheet_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(marksheet_router)