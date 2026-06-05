
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ ADD THIS

from app.routes.admin_routes import router as admin_router
from app.routes.chat_routes import router as chat_router

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# your existing routers
app.include_router(admin_router)
app.include_router(chat_router)